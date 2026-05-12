'use strict';

/**
 * Flawless Roleplay — Donation Store Plugin
 *
 * Provides a full donation store with Stripe/PayPal integration,
 * VIP membership tiers, one-time items, and bundle packages.
 *
 * Payment Flow:
 * 1. User clicks "Purchase" on store item
 * 2. Plugin creates a Stripe Checkout Session / PayPal order
 * 3. User pays on Stripe/PayPal hosted page
 * 4. Webhook fires on payment success
 * 5. Plugin updates user groups, donator rank, and notifies the user
 */

const db = require.main.require('./src/database');
const User = require.main.require('./src/user');
const Groups = require.main.require('./src/groups');
const Messaging = require.main.require('./src/messaging');
const nconf = require.main.require('nconf');

const { STORE_ITEMS, getAllItems, getItemById, getItemBySlug } = require('./store-items');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const UCP_API_URL = process.env.UCP_API_URL || 'http://localhost:3000';

let stripe = null;

const plugin = module.exports;

/**
 * Initialize the donation plugin — register routes
 */
plugin.init = async function (params) {
  const { router, middleware } = params;

  // Initialize Stripe if key is available
  if (STRIPE_SECRET_KEY) {
    try {
      const Stripe = require('stripe');
      stripe = new Stripe(STRIPE_SECRET_KEY);
      console.log('[Flawless Donations] Stripe initialized');
    } catch (err) {
      console.warn('[Flawless Donations] Stripe not available:', err.message);
    }
  }

  // ---- Public Routes ----

  // Store page
  router.get('/store', middleware.buildHeader, async (req, res) => {
    const data = {
      title: 'Donation Store',
      breadcrumbs: [{ text: 'Home', url: '/' }, { text: 'Store' }],
      subscriptions: STORE_ITEMS.subscriptions,
      items: STORE_ITEMS.items,
      packages: STORE_ITEMS.packages,
      categories: getCategories(),
    };
    res.render('store', data);
  });

  // Store API — get all items
  router.get('/api/store/items', async (req, res) => {
    res.json({
      subscriptions: STORE_ITEMS.subscriptions,
      items: STORE_ITEMS.items,
      packages: STORE_ITEMS.packages,
    });
  });

  // Store item detail
  router.get('/store/:slug', middleware.buildHeader, async (req, res) => {
    const item = getItemBySlug(req.params.slug);
    if (!item) {
      return res.status(404).render('404', { title: 'Item Not Found' });
    }
    res.render('store-item', {
      title: item.name,
      item: item,
      breadcrumbs: [
        { text: 'Home', url: '/' },
        { text: 'Store', url: '/store' },
        { text: item.name },
      ],
    });
  });

  // ---- Checkout Routes (require authentication) ----

  // Initiate Stripe checkout
  router.post('/api/donations/checkout/stripe', middleware.authenticate, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Stripe is not configured' });
      }

      const { itemId } = req.body;
      const item = getItemById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const uid = req.uid;
      const userData = await User.getUserData(uid);

      const sessionConfig = {
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: item.currency.toLowerCase(),
            product_data: {
              name: `Flawless RP - ${item.name}`,
              description: item.description,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: 1,
        }],
        mode: item.type === 'subscription' ? 'subscription' : 'payment',
        success_url: `${nconf.get('url')}/store/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${nconf.get('url')}/store`,
        customer_email: userData.email || undefined,
        metadata: {
          uid: String(uid),
          itemId: String(itemId),
          playerName: userData.fullname || userData.username || '',
        },
      };

      // For subscriptions, use recurring price
      if (item.type === 'subscription') {
        sessionConfig.line_items[0].price_data.recurring = {
          interval: item.interval || 'month',
        };
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      // Store pending order
      await db.setObject(`flawless:donation:pending:${session.id}`, {
        uid: uid,
        itemId: itemId,
        amount: item.price,
        currency: item.currency,
        status: 'pending',
        createdAt: Date.now(),
        sessionId: session.id,
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
      console.error('[Flawless Donations] Checkout error:', err);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Initiate PayPal checkout
  router.post('/api/donations/checkout/paypal', middleware.authenticate, async (req, res) => {
    try {
      const { itemId } = req.body;
      const item = getItemById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        return res.status(503).json({ error: 'PayPal is not configured' });
      }

      const uid = req.uid;

      // Create PayPal order via API
      const accessToken = await getPayPalAccessToken();
      const order = await createPayPalOrder(accessToken, item, uid);

      // Store pending order
      await db.setObject(`flawless:donation:pending:paypal:${order.id}`, {
        uid: uid,
        itemId: itemId,
        amount: item.price,
        currency: item.currency,
        status: 'pending',
        createdAt: Date.now(),
        orderId: order.id,
      });

      const approvalUrl = order.links.find(l => l.rel === 'approve');
      res.json({ url: approvalUrl ? approvalUrl.href : null, orderId: order.id });
    } catch (err) {
      console.error('[Flawless Donations] PayPal checkout error:', err);
      res.status(500).json({ error: 'Failed to create PayPal order' });
    }
  });

  // ---- Webhook Routes ----

  // Stripe webhook
  router.post('/api/donations/webhook/stripe', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).send('Stripe not configured');
      }

      let event;
      if (STRIPE_WEBHOOK_SECRET) {
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, STRIPE_WEBHOOK_SECRET);
      } else {
        event = req.body;
      }

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          await handleSuccessfulPayment(session.metadata.uid, session.metadata.itemId, {
            provider: 'stripe',
            transactionId: session.id,
            amount: session.amount_total / 100,
            currency: session.currency.toUpperCase(),
          });
          break;
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          // Handle subscription cancellation
          if (subscription.metadata && subscription.metadata.uid) {
            await handleSubscriptionCancelled(subscription.metadata.uid, subscription.metadata.itemId);
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error('[Flawless Donations] Stripe webhook error:', err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // PayPal IPN/webhook
  router.post('/api/donations/webhook/paypal', async (req, res) => {
    try {
      const { resource } = req.body;
      if (!resource) {
        return res.status(400).send('Invalid payload');
      }

      // Verify the webhook (simplified — in production, verify signature)
      const orderId = resource.id;
      const pendingOrder = await db.getObject(`flawless:donation:pending:paypal:${orderId}`);

      if (pendingOrder && resource.status === 'COMPLETED') {
        await handleSuccessfulPayment(pendingOrder.uid, pendingOrder.itemId, {
          provider: 'paypal',
          transactionId: orderId,
          amount: pendingOrder.amount,
          currency: pendingOrder.currency,
        });
      }

      res.json({ received: true });
    } catch (err) {
      console.error('[Flawless Donations] PayPal webhook error:', err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // ---- User Routes ----

  // Donation history for current user
  router.get('/api/donations/history', middleware.authenticate, async (req, res) => {
    try {
      const uid = req.uid;
      const donationIds = await db.getSortedSetRevRange(`uid:${uid}:donations`, 0, 49);
      const donations = await Promise.all(
        donationIds.map(id => db.getObject(`flawless:donation:${id}`))
      );
      res.json({ donations: donations.filter(Boolean) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Success page
  router.get('/store/success', middleware.buildHeader, async (req, res) => {
    res.render('store-success', {
      title: 'Payment Successful',
      breadcrumbs: [
        { text: 'Home', url: '/' },
        { text: 'Store', url: '/store' },
        { text: 'Success' },
      ],
    });
  });

  // ---- Admin Routes ----

  // Admin donation management
  router.get('/admin/plugins/donations', middleware.admin.buildHeader, async (req, res) => {
    const recentDonations = await db.getSortedSetRevRange('flawless:donations:all', 0, 49);
    const donations = await Promise.all(
      recentDonations.map(id => db.getObject(`flawless:donation:${id}`))
    );

    const totalRevenue = donations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

    res.render('admin/donations', {
      title: 'Donation Management',
      donations: donations.filter(Boolean),
      totalRevenue: totalRevenue.toFixed(2),
      stripeConfigured: !!STRIPE_SECRET_KEY,
      paypalConfigured: !!PAYPAL_CLIENT_ID,
    });
  });

  console.log('[Flawless Donations] Plugin initialized');
};

/**
 * Add Store link to navigation
 */
plugin.addStoreNavLink = async function (header) {
  header.navigation = header.navigation || [];
  header.navigation.push({
    route: '/store',
    title: 'Store',
    enabled: true,
    iconClass: 'fa-shopping-cart',
    textClass: 'visible-xs-inline',
    text: 'Donation Store',
  });
  return header;
};

/**
 * Add Donation History to user profile menu
 */
plugin.addDonationHistory = async function (data) {
  data.links = data.links || [];
  data.links.push({
    id: 'donation-history',
    route: 'donation-history',
    icon: 'fa-shopping-cart',
    name: 'Donation History',
    visibility: { self: true, other: false, moderator: false, globalMod: false, admin: true },
  });
  return data;
};

/**
 * Add donator badge to user custom fields
 */
plugin.addDonatorBadge = async function (data) {
  if (!data.uid) return data;

  const donateRank = await db.getObjectField(`user:${data.uid}`, 'flawlessDonateRank');
  if (donateRank) {
    data.customFields = data.customFields || [];
    const rank = parseInt(donateRank, 10);
    let badge = null;

    if (rank === 1) badge = { name: 'Daisy VIP', class: 'badge-vip-daisy', icon: 'fa-leaf' };
    else if (rank === 2) badge = { name: 'Rose VIP', class: 'badge-vip-rose', icon: 'fa-diamond' };
    else if (rank >= 3) badge = { name: 'Ivy VIP', class: 'badge-vip-ivy', icon: 'fa-crown' };

    if (badge) {
      data.customFields.push({
        name: 'donatorBadge',
        value: badge.name,
        class: badge.class,
        icon: badge.icon,
      });
    }
  }

  return data;
};

/**
 * Add admin navigation link
 */
plugin.addAdminNavLink = async function (header) {
  header.plugins = header.plugins || [];
  header.plugins.push({
    route: '/plugins/donations',
    icon: 'fa-shopping-cart',
    name: 'Donations',
  });
  return header;
};

/* ============================================
   PAYMENT PROCESSING
   ============================================ */

/**
 * Handle a successful payment
 */
async function handleSuccessfulPayment(uid, itemId, paymentInfo) {
  try {
    uid = parseInt(uid, 10);
    const item = getItemById(itemId);
    if (!item) {
      console.error('[Flawless Donations] Item not found:', itemId);
      return;
    }

    // Generate donation ID
    const donationId = `${Date.now()}-${uid}-${itemId}`;

    // Store donation record
    await db.setObject(`flawless:donation:${donationId}`, {
      id: donationId,
      uid: uid,
      itemId: itemId,
      itemName: item.name,
      amount: paymentInfo.amount,
      currency: paymentInfo.currency,
      provider: paymentInfo.provider,
      transactionId: paymentInfo.transactionId,
      status: 'completed',
      completedAt: Date.now(),
    });

    // Add to user's donation history
    await db.sortedSetAdd(`uid:${uid}:donations`, Date.now(), donationId);

    // Add to global donation log
    await db.sortedSetAdd('flawless:donations:all', Date.now(), donationId);

    // Process item-specific effects
    if (item.donateRank) {
      // VIP subscription — update donator rank
      await updateDonatorRank(uid, item.donateRank, item.groupName);
    }

    // Send PM notification to user
    await sendDonationNotification(uid, item, paymentInfo);

    // Update UCP/INI file via API
    await syncDonationToUCP(uid, item);

    console.log(`[Flawless Donations] Payment processed: ${item.name} for uid ${uid} (${paymentInfo.provider})`);
  } catch (err) {
    console.error('[Flawless Donations] Payment processing error:', err);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(uid, itemId) {
  try {
    uid = parseInt(uid, 10);
    const item = getItemById(itemId);
    if (!item || !item.groupName) return;

    // Remove from VIP group
    await Groups.leave(item.groupName, uid);

    // Reset donator rank
    await db.setObjectField(`user:${uid}`, 'flawlessDonateRank', 0);

    // Notify user
    const adminUid = 1; // System admin
    await Messaging.sendMessage({
      uid: adminUid,
      roomId: await getOrCreateDMRoom(adminUid, uid),
      content: `Your **${item.name}** subscription has expired. You can renew it at the [Donation Store](/store).`,
    });

    console.log(`[Flawless Donations] Subscription cancelled: ${item.name} for uid ${uid}`);
  } catch (err) {
    console.error('[Flawless Donations] Subscription cancellation error:', err);
  }
}

/**
 * Update user's donator rank and group membership
 */
async function updateDonatorRank(uid, donateRank, groupName) {
  // Remove from other VIP groups first
  const vipGroups = ['Daisy VIP', 'Rose VIP', 'Ivy VIP'];
  for (const group of vipGroups) {
    try {
      await Groups.leave(group, uid);
    } catch (e) {
      // Group might not exist yet
    }
  }

  // Add to the new VIP group
  try {
    // Create group if it doesn't exist
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
    await Groups.join(groupName, uid);
  } catch (err) {
    console.error(`[Flawless Donations] Failed to add uid ${uid} to group ${groupName}:`, err);
  }

  // Update custom field
  await db.setObjectField(`user:${uid}`, 'flawlessDonateRank', donateRank);
}

/**
 * Send donation notification PM
 */
async function sendDonationNotification(uid, item, paymentInfo) {
  try {
    const adminUid = 1;
    const roomId = await getOrCreateDMRoom(adminUid, uid);
    if (roomId) {
      await Messaging.sendMessage({
        uid: adminUid,
        roomId: roomId,
        content: `Thank you for your donation!\n\n**Item:** ${item.name}\n**Amount:** €${paymentInfo.amount}\n**Transaction:** ${paymentInfo.transactionId}\n\nYour benefits have been activated. Enjoy!`,
      });
    }
  } catch (err) {
    console.warn('[Flawless Donations] Failed to send notification:', err.message);
  }
}

/**
 * Sync donation to UCP via API (updates player INI file)
 */
async function syncDonationToUCP(uid, item) {
  try {
    const playerName = await db.getObjectField(`user:${uid}`, 'flawlessPlayer');
    if (!playerName) return;

    const payload = {
      playerName: playerName,
      itemId: item.id,
      donateRank: item.donateRank || 0,
    };

    const response = await fetch(`${UCP_API_URL}/api/donations/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('[Flawless Donations] UCP sync failed:', response.status);
    }
  } catch (err) {
    console.warn('[Flawless Donations] UCP sync error:', err.message);
  }
}

/**
 * Get or create a DM room between two users
 */
async function getOrCreateDMRoom(fromUid, toUid) {
  try {
    const roomId = await Messaging.newRoom(fromUid, { uids: [toUid] });
    return roomId;
  } catch (err) {
    return null;
  }
}

/**
 * Get PayPal access token
 */
async function getPayPalAccessToken() {
  const baseUrl = process.env.PAYPAL_SANDBOX === 'true'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Create PayPal order
 */
async function createPayPalOrder(accessToken, item, uid) {
  const baseUrl = process.env.PAYPAL_SANDBOX === 'true'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: item.currency,
          value: item.price.toFixed(2),
        },
        description: `Flawless RP - ${item.name}`,
        custom_id: `${uid}:${item.id}`,
      }],
      application_context: {
        return_url: `${nconf.get('url')}/store/success`,
        cancel_url: `${nconf.get('url')}/store`,
        brand_name: 'Flawless Roleplay',
      },
    }),
  });

  return response.json();
}

/**
 * Get unique item categories
 */
function getCategories() {
  const cats = new Set(STORE_ITEMS.items.map(i => i.category));
  return Array.from(cats);
}
