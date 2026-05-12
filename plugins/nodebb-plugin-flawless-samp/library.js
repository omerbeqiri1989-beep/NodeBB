'use strict';

/**
 * Flawless Roleplay — SA-MP Gamemode Integration Plugin
 *
 * Bridges in-game data to the forum:
 * 1. Profile Enhancement: Shows player's in-game stats on forum profile
 * 2. Auto-Group Assignment: Assigns faction/gang groups based on INI data
 * 3. Periodic Sync: Cron job reads INI files and updates forum user fields
 * 4. Server Status: Provides SA-MP server query endpoint
 */

const db = require.main.require('./src/database');
const User = require.main.require('./src/user');
const Groups = require.main.require('./src/groups');
const nconf = require.main.require('nconf');

const {
  readPlayerFile,
  listAllPlayers,
  extractPlayerData,
  FACTION_GROUP_NAMES,
  GANG_GROUP_NAMES,
} = require('./ini-parser');

const SYNC_INTERVAL = parseInt(process.env.SAMP_SYNC_INTERVAL || '300000', 10); // 5 minutes default
const SAMP_SERVER_IP = process.env.SAMP_SERVER_IP || 'play.flawlessrp.com';
const SAMP_SERVER_PORT = parseInt(process.env.SAMP_SERVER_PORT || '7777', 10);

let syncTimer = null;

const plugin = module.exports;

/**
 * Initialize the SA-MP integration plugin
 */
plugin.init = async function (params) {
  const { router, middleware } = params;

  // ---- API Routes ----

  // Get server status
  router.get('/api/flawless-samp/server-status', async (req, res) => {
    try {
      const status = await queryServerStatus();
      res.json(status);
    } catch (err) {
      res.json({ online: false, players: 0, maxPlayers: 200, error: err.message });
    }
  });

  // Get player game stats (public)
  router.get('/api/flawless-samp/player/:playerName', async (req, res) => {
    try {
      const playerName = req.params.playerName;
      const iniData = readPlayerFile(playerName);
      if (!iniData) {
        return res.status(404).json({ error: 'Player not found' });
      }
      const playerData = extractPlayerData(iniData);
      // Remove raw data from public API
      delete playerData._raw;
      res.json(playerData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get player game stats by forum UID
  router.get('/api/flawless-samp/user/:uid/game-stats', async (req, res) => {
    try {
      const uid = parseInt(req.params.uid, 10);
      const playerName = await db.getObjectField(`user:${uid}`, 'flawlessPlayer');
      if (!playerName) {
        return res.status(404).json({ error: 'No linked player' });
      }
      const iniData = readPlayerFile(playerName);
      if (!iniData) {
        return res.status(404).json({ error: 'Player INI file not found' });
      }
      const playerData = extractPlayerData(iniData);
      delete playerData._raw;
      res.json(playerData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Manual sync trigger (admin only)
  router.post('/api/flawless-samp/sync', middleware.authenticate, async (req, res) => {
    try {
      // Check if user is admin
      const isAdmin = await User.isAdministrator(req.uid);
      if (!isAdmin) {
        return res.status(403).json({ error: 'Admin only' });
      }
      const result = await syncAllPlayers();
      res.json({ success: true, synced: result.synced, errors: result.errors });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Game stats profile page
  router.get('/user/:userslug/game-stats', middleware.buildHeader, async (req, res, next) => {
    try {
      const userData = await User.getUserByUserslug(req.params.userslug);
      if (!userData) return next();

      const playerName = await db.getObjectField(`user:${userData.uid}`, 'flawlessPlayer');
      let gameData = null;

      if (playerName) {
        const iniData = readPlayerFile(playerName);
        if (iniData) {
          gameData = extractPlayerData(iniData);
          delete gameData._raw;
        }
      }

      res.render('account/game-stats', {
        title: `${userData.username} — Game Stats`,
        uid: userData.uid,
        username: userData.username,
        userslug: userData.userslug,
        playerName: playerName || null,
        gameData: gameData,
        breadcrumbs: [
          { text: 'Home', url: '/' },
          { text: userData.username, url: `/user/${userData.userslug}` },
          { text: 'Game Stats' },
        ],
      });
    } catch (err) {
      next(err);
    }
  });

  // Start periodic sync
  startPeriodicSync();

  console.log('[Flawless SA-MP] Plugin initialized');
};

/**
 * Add "Game Stats" tab to user profile menu
 */
plugin.addGameStatsTab = async function (data) {
  data.links = data.links || [];
  data.links.push({
    id: 'game-stats',
    route: 'game-stats',
    icon: 'fa-gamepad',
    name: 'Game Stats',
    visibility: { self: true, other: true, moderator: true, globalMod: true, admin: true },
  });
  return data;
};

/**
 * Add game data to user profile
 */
plugin.addGameDataToProfile = async function (data) {
  if (!data.uid) return data;

  const playerName = await db.getObjectField(`user:${data.uid}`, 'flawlessPlayer');
  if (!playerName) return data;

  const iniData = readPlayerFile(playerName);
  if (!iniData) return data;

  const gameData = extractPlayerData(iniData);

  // Add game fields to profile data
  data.gameLevel = gameData.level;
  data.gameFaction = gameData.factionName;
  data.gameFactionColor = gameData.factionColor;
  data.gameGang = gameData.gangName;
  data.gameGangColor = gameData.gangColor;
  data.gameDonateRank = gameData.donateRankName;
  data.gameKills = gameData.kills;
  data.gameDeaths = gameData.deaths;
  data.gameKD = gameData.kd;
  data.gameCash = gameData.cash;
  data.gameBank = gameData.bank;
  data.gameTotalWealth = gameData.totalWealth;
  data.gamePlayTime = gameData.playTimeHours;
  data.playerName = playerName;

  return data;
};

/**
 * Add game-related badges to user posts
 */
plugin.addGameBadges = async function (data) {
  if (!data.uid) return data;

  const playerName = await db.getObjectField(`user:${data.uid}`, 'flawlessPlayer');
  if (!playerName) return data;

  // Get cached game data from DB (updated by sync)
  const cachedData = await db.getObject(`flawless:player:cache:${playerName}`);
  if (!cachedData) return data;

  data.customFields = data.customFields || [];

  // Faction badge
  if (cachedData.factionName && cachedData.factionName !== 'Civilian') {
    data.customFields.push({
      name: 'faction',
      value: cachedData.factionName,
      color: cachedData.factionColor,
      icon: 'fa-shield',
    });
  }

  // Gang badge
  if (cachedData.gangName && cachedData.gangName !== 'None') {
    data.customFields.push({
      name: 'gang',
      value: cachedData.gangName,
      color: cachedData.gangColor,
      icon: 'fa-users',
    });
  }

  // Level badge
  if (cachedData.level) {
    data.customFields.push({
      name: 'level',
      value: `Level ${cachedData.level}`,
      color: '#F59E0B',
      icon: 'fa-star',
    });
  }

  return data;
};

/**
 * Whitelist custom game fields for user data
 */
plugin.whitelistGameFields = async function (data) {
  data.whitelist = data.whitelist || [];
  data.whitelist.push(
    'flawlessPlayer',
    'flawlessDonateRank',
    'gameLevel',
    'gameFaction',
    'gameGang'
  );
  return data;
};

/* ============================================
   SYNC ENGINE
   ============================================ */

/**
 * Start periodic sync of player data
 */
function startPeriodicSync() {
  if (syncTimer) clearInterval(syncTimer);

  syncTimer = setInterval(async () => {
    try {
      const result = await syncAllPlayers();
      if (result.synced > 0) {
        console.log(`[Flawless SA-MP] Synced ${result.synced} players (${result.errors} errors)`);
      }
    } catch (err) {
      console.error('[Flawless SA-MP] Sync error:', err.message);
    }
  }, SYNC_INTERVAL);

  // Run initial sync after a short delay
  setTimeout(async () => {
    try {
      const result = await syncAllPlayers();
      console.log(`[Flawless SA-MP] Initial sync: ${result.synced} players (${result.errors} errors)`);
    } catch (err) {
      console.error('[Flawless SA-MP] Initial sync error:', err.message);
    }
  }, 10000);
}

/**
 * Sync all linked players from INI files to forum
 */
async function syncAllPlayers() {
  let synced = 0;
  let errors = 0;

  // Get all linked players
  const playerNames = await db.getSortedSetRange('flawless:players', 0, -1);

  for (const playerName of playerNames) {
    try {
      const mapping = await db.getObject(`flawless:player:${playerName}`);
      if (!mapping || !mapping.uid) continue;

      const iniData = readPlayerFile(playerName);
      if (!iniData) continue;

      const gameData = extractPlayerData(iniData);
      const uid = parseInt(mapping.uid, 10);

      // Cache game data
      await db.setObject(`flawless:player:cache:${playerName}`, {
        level: gameData.level,
        faction: gameData.faction,
        factionName: gameData.factionName,
        factionColor: gameData.factionColor,
        gang: gameData.gang,
        gangName: gameData.gangName,
        gangColor: gameData.gangColor,
        donateRank: gameData.donateRank,
        kills: gameData.kills,
        deaths: gameData.deaths,
        cash: gameData.cash,
        bank: gameData.bank,
        totalWealth: gameData.totalWealth,
        connectedTime: gameData.connectedTime,
        adminLevel: gameData.adminLevel,
        isLeader: gameData.isLeader,
        lastSync: Date.now(),
      });

      // Update user custom fields
      await db.setObjectField(`user:${uid}`, 'gameLevel', gameData.level);
      await db.setObjectField(`user:${uid}`, 'gameFaction', gameData.factionName);
      await db.setObjectField(`user:${uid}`, 'gameGang', gameData.gangName);

      // Auto-assign faction group
      await syncFactionGroup(uid, gameData.faction);

      // Auto-assign gang group
      await syncGangGroup(uid, gameData.gang);

      // Auto-assign admin/moderator groups
      await syncAdminGroup(uid, gameData.adminLevel);

      // Auto-assign donator group
      await syncDonatorGroup(uid, gameData.donateRank);

      // Auto-assign faction leader group
      if (gameData.isLeader) {
        await ensureGroupAndJoin('Faction Leaders', uid);
      } else {
        try { await Groups.leave('Faction Leaders', uid); } catch (e) { /* ignore */ }
      }

      synced++;
    } catch (err) {
      errors++;
      console.warn(`[Flawless SA-MP] Sync error for ${playerName}:`, err.message);
    }
  }

  return { synced, errors };
}

/**
 * Sync faction group membership
 */
async function syncFactionGroup(uid, factionId) {
  // Remove from all faction groups first
  for (const [id, groupName] of Object.entries(FACTION_GROUP_NAMES)) {
    try {
      if (parseInt(id) !== factionId) {
        await Groups.leave(groupName, uid);
      }
    } catch (e) { /* ignore */ }
  }

  // Add to current faction group
  const groupName = FACTION_GROUP_NAMES[factionId];
  if (groupName) {
    await ensureGroupAndJoin(groupName, uid);
  }
}

/**
 * Sync gang group membership
 */
async function syncGangGroup(uid, gangId) {
  // Remove from all gang groups first
  for (const [id, groupName] of Object.entries(GANG_GROUP_NAMES)) {
    try {
      if (parseInt(id) !== gangId) {
        await Groups.leave(groupName, uid);
      }
    } catch (e) { /* ignore */ }
  }

  // Add to current gang group
  const groupName = GANG_GROUP_NAMES[gangId];
  if (groupName) {
    await ensureGroupAndJoin(groupName, uid);
  }
}

/**
 * Sync admin/moderator group based on AdminLevel
 */
async function syncAdminGroup(uid, adminLevel) {
  const adminGroups = [
    { name: 'Helpers', minLevel: 1, maxLevel: 1 },
    { name: 'Moderators', minLevel: 2, maxLevel: 3 },
    { name: 'Administrators', minLevel: 4, maxLevel: 99 },
  ];

  for (const group of adminGroups) {
    if (adminLevel >= group.minLevel && adminLevel <= group.maxLevel) {
      await ensureGroupAndJoin(group.name, uid);
    } else {
      try { await Groups.leave(group.name, uid); } catch (e) { /* ignore */ }
    }
  }
}

/**
 * Sync donator group based on DonateRank
 */
async function syncDonatorGroup(uid, donateRank) {
  const donatorGroups = [
    { name: 'Daisy VIP', rank: 1 },
    { name: 'Rose VIP', rank: 2 },
    { name: 'Ivy VIP', rank: 3 },
  ];

  for (const group of donatorGroups) {
    if (donateRank === group.rank) {
      await ensureGroupAndJoin(group.name, uid);
    } else {
      try { await Groups.leave(group.name, uid); } catch (e) { /* ignore */ }
    }
  }
}

/**
 * Ensure a group exists and add user to it
 */
async function ensureGroupAndJoin(groupName, uid) {
  try {
    const exists = await Groups.exists(groupName);
    if (!exists) {
      await Groups.create({
        name: groupName,
        description: `${groupName} members`,
        hidden: 0,
        private: 1,
        disableJoinRequests: 1,
      });
    }
    const isMember = await Groups.isMember(uid, groupName);
    if (!isMember) {
      await Groups.join(groupName, uid);
    }
  } catch (err) {
    console.warn(`[Flawless SA-MP] Failed to add uid ${uid} to group ${groupName}:`, err.message);
  }
}

/* ============================================
   SERVER STATUS QUERY
   ============================================ */

/**
 * Query SA-MP server status using UDP query protocol
 */
async function queryServerStatus() {
  return new Promise((resolve) => {
    const dgram = require('dgram');
    const client = dgram.createSocket('udp4');
    const timeout = setTimeout(() => {
      client.close();
      resolve({ online: false, players: 0, maxPlayers: 200 });
    }, 3000);

    try {
      // SA-MP query packet: 'SAMP' + IP bytes + port bytes + 'i' (info query)
      const ipParts = SAMP_SERVER_IP.split('.');
      const packet = Buffer.alloc(11);
      packet.write('SAMP', 0);
      if (ipParts.length === 4) {
        packet[4] = parseInt(ipParts[0]);
        packet[5] = parseInt(ipParts[1]);
        packet[6] = parseInt(ipParts[2]);
        packet[7] = parseInt(ipParts[3]);
      }
      packet.writeUInt16LE(SAMP_SERVER_PORT, 8);
      packet[10] = 0x69; // 'i' for info query

      client.on('message', (msg) => {
        clearTimeout(timeout);
        client.close();

        try {
          // Parse SA-MP query response
          if (msg.length > 11) {
            const offset = 11;
            // Skip password flag (1 byte)
            const players = msg.readUInt16LE(offset + 1);
            const maxPlayers = msg.readUInt16LE(offset + 3);
            resolve({
              online: true,
              players: players,
              maxPlayers: maxPlayers,
            });
          } else {
            resolve({ online: true, players: 0, maxPlayers: 200 });
          }
        } catch (e) {
          resolve({ online: true, players: 0, maxPlayers: 200 });
        }
      });

      client.on('error', () => {
        clearTimeout(timeout);
        client.close();
        resolve({ online: false, players: 0, maxPlayers: 200 });
      });

      client.send(packet, 0, packet.length, SAMP_SERVER_PORT, SAMP_SERVER_IP);
    } catch (err) {
      clearTimeout(timeout);
      try { client.close(); } catch (e) { /* ignore */ }
      resolve({ online: false, players: 0, maxPlayers: 200 });
    }
  });
}
