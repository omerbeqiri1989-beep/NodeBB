'use strict';

/**
 * Flawless Roleplay — NodeBB SSO Plugin
 *
 * JWT-based SSO bridge so players who log in to the UCP are automatically
 * logged in to the forum. Reads the shared JWT cookie (frp_player_token)
 * set by the UCP on the .flawlessrp.com domain.
 *
 * Flow:
 * 1. Player logs into UCP with Firstname_Lastname + password (Whirlpool verified)
 * 2. UCP issues JWT token (stored in httpOnly cookie `frp_player_token`)
 * 3. When player visits the forum, this plugin reads the shared JWT
 * 4. If valid, NodeBB creates/logs in the matching user
 */

const jwt = require('jsonwebtoken');
const User = require.main.require('./src/user');
const db = require.main.require('./src/database');
const meta = require.main.require('./src/meta');
const nconf = require.main.require('nconf');

const JWT_SECRET = process.env.JWT_SECRET || 'flawless-rp-secret-key-change-me';
const COOKIE_NAME = 'frp_player_token';
const UCP_URL = process.env.UCP_URL || 'https://ucp.flawlessrp.com';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || '.flawlessrp.com';

const plugin = module.exports;

/**
 * Initialize the SSO plugin — register routes
 */
plugin.init = async function (params) {
  const { router, middleware } = params;

  // SSO endpoint: UCP redirects here after login, or user clicks "Login with Flawless RP"
  router.get('/auth/flawless', async (req, res) => {
    try {
      const token = extractToken(req);

      if (!token) {
        // Redirect to UCP login with return URL
        const returnUrl = encodeURIComponent(nconf.get('url') + '/auth/flawless');
        return res.redirect(`${UCP_URL}/login?returnTo=${returnUrl}`);
      }

      const decoded = verifyToken(token);
      if (!decoded || !decoded.playerName) {
        return res.redirect(nconf.get('url') + '/login?error=invalid_token');
      }

      const playerName = decoded.playerName;

      // Find or create NodeBB user
      let uid = await getUidByPlayerName(playerName);

      if (!uid) {
        // Create new NodeBB user
        uid = await User.create({
          username: formatUsername(playerName),
          fullname: playerName,
        });

        // Store the mapping
        await db.setObject(`flawless:player:${playerName}`, {
          uid: uid,
          playerName: playerName,
          linkedAt: Date.now(),
        });
        await db.setObjectField(`user:${uid}`, 'flawlessPlayer', playerName);
        await db.sortedSetAdd('flawless:players', uid, playerName);

        console.log(`[Flawless SSO] Created new user: ${playerName} (uid: ${uid})`);
      }

      // Update last login timestamp
      await db.setObjectField(`flawless:player:${playerName}`, 'lastLogin', Date.now());

      // Log the user in via NodeBB's session system
      req.login({ uid: uid }, (err) => {
        if (err) {
          console.error('[Flawless SSO] Login error:', err);
          return res.redirect(nconf.get('url') + '/login?error=login_failed');
        }
        // Redirect to homepage or the requested page
        const returnTo = req.query.returnTo || '/';
        res.redirect(nconf.get('url') + returnTo);
      });
    } catch (err) {
      console.error('[Flawless SSO] Auth error:', err.message);
      res.redirect(nconf.get('url') + '/login?error=auth_failed');
    }
  });

  // SSO callback (for OAuth2-style flow)
  router.get('/auth/flawless/callback', async (req, res) => {
    // Same logic as above — handles the callback from UCP
    res.redirect(nconf.get('url') + '/auth/flawless');
  });

  // Logout sync endpoint — clears the shared cookie
  router.post('/auth/flawless/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME, { domain: COOKIE_DOMAIN, path: '/' });
    req.logout(() => {
      res.redirect(nconf.get('url') + '/');
    });
  });

  // API endpoint to check SSO status
  router.get('/api/flawless-sso/status', async (req, res) => {
    try {
      const token = extractToken(req);
      if (!token) {
        return res.json({ authenticated: false });
      }

      const decoded = verifyToken(token);
      if (!decoded || !decoded.playerName) {
        return res.json({ authenticated: false });
      }

      const uid = await getUidByPlayerName(decoded.playerName);
      res.json({
        authenticated: true,
        playerName: decoded.playerName,
        uid: uid || null,
        linked: !!uid,
      });
    } catch (err) {
      res.json({ authenticated: false, error: err.message });
    }
  });

  // API endpoint to link an existing NodeBB account to a player
  router.post('/api/flawless-sso/link', middleware.authenticate, async (req, res) => {
    try {
      const { playerName } = req.body;
      if (!playerName) {
        return res.status(400).json({ error: 'playerName is required' });
      }

      const uid = req.uid;
      const existingUid = await getUidByPlayerName(playerName);
      if (existingUid && existingUid !== uid) {
        return res.status(409).json({ error: 'This player is already linked to another account' });
      }

      await db.setObject(`flawless:player:${playerName}`, {
        uid: uid,
        playerName: playerName,
        linkedAt: Date.now(),
      });
      await db.setObjectField(`user:${uid}`, 'flawlessPlayer', playerName);
      await db.sortedSetAdd('flawless:players', uid, playerName);

      res.json({ success: true, playerName: playerName, uid: uid });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  console.log('[Flawless SSO] Plugin initialized');
};

/**
 * Register the Flawless RP login strategy
 */
plugin.getStrategy = async function (strategies) {
  strategies.push({
    name: 'flawless',
    url: '/auth/flawless',
    callbackURL: '/auth/flawless/callback',
    icon: 'fa-gamepad',
    scope: '',
    color: '#F59E0B',
    label: 'Login with Flawless RP',
  });
  return strategies;
};

/**
 * Handle logout — clear the shared cookie
 */
plugin.onLogout = async function (data) {
  if (data.req && data.res) {
    data.res.clearCookie(COOKIE_NAME, { domain: COOKIE_DOMAIN, path: '/' });
  }
};

/**
 * Add UCP link to the header navigation
 */
plugin.addUCPLink = async function (header) {
  header.navigation = header.navigation || [];
  header.navigation.push({
    route: UCP_URL,
    title: 'UCP',
    enabled: true,
    iconClass: 'fa-dashboard',
    textClass: 'visible-xs-inline',
    text: 'User Control Panel',
  });
  return header;
};

/* ============================================
   HELPER FUNCTIONS
   ============================================ */

/**
 * Extract JWT token from cookie or Authorization header
 */
function extractToken(req) {
  // Check cookie first
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }

  // Parse cookies manually if cookie-parser hasn't run
  const cookieHeader = req.headers && req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, c) => {
      const [key, ...val] = c.trim().split('=');
      if (key) acc[key] = val.join('=');
      return acc;
    }, {});
    if (cookies[COOKIE_NAME]) {
      return cookies[COOKIE_NAME];
    }
  }

  // Check Authorization header
  const authHeader = req.headers && req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Verify and decode a JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.warn('[Flawless SSO] Token verification failed:', err.message);
    return null;
  }
}

/**
 * Get NodeBB uid by player name
 */
async function getUidByPlayerName(playerName) {
  const data = await db.getObject(`flawless:player:${playerName}`);
  return data ? parseInt(data.uid, 10) : null;
}

/**
 * Format player name for NodeBB username (Firstname_Lastname → Firstname Lastname)
 */
function formatUsername(playerName) {
  return playerName.replace(/_/g, ' ');
}
