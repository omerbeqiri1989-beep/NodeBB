'use strict';

/**
 * Flawless Roleplay — Donation Store Items
 * Complete catalog of all purchasable items and VIP tiers
 */

const STORE_ITEMS = {
  // ============================================
  // VIP MEMBERSHIP TIERS (Subscriptions)
  // ============================================
  subscriptions: [
    {
      id: 'daisy-vip',
      slug: 'daisy-vip',
      name: 'Daisy Membership',
      emoji: '🌿',
      tier: 'daisy',
      donateRank: 1,
      price: 3.99,
      currency: 'EUR',
      type: 'subscription',
      interval: 'month',
      color: '#A3E635',
      badgeClass: 'badge-vip-daisy',
      groupName: 'Daisy VIP',
      description: 'Entry-level VIP membership with exclusive forum perks and in-game benefits.',
      features: [
        'Custom forum title color (green)',
        '"Daisy VIP" badge on forum posts',
        'Access to VIP subforum',
        '1 custom license plate in-game',
        'Priority in support queue',
        'Double XP weekends',
      ],
    },
    {
      id: 'rose-vip',
      slug: 'rose-vip',
      name: 'Rose Membership',
      emoji: '🌹',
      tier: 'rose',
      donateRank: 2,
      price: 6.99,
      currency: 'EUR',
      type: 'subscription',
      interval: 'month',
      color: '#F59E0B',
      badgeClass: 'badge-vip-rose',
      groupName: 'Rose VIP',
      description: 'Premium VIP membership with enhanced forum customization and in-game perks.',
      features: [
        'Everything in Daisy +',
        'Custom forum title (any color/text)',
        '"Rose VIP" badge (gold border)',
        '1 extra vehicle slot in-game',
        'Custom phone number',
        'MP3 Player item',
        'Boombox item',
        'Access to Rose-only subforum',
      ],
    },
    {
      id: 'ivy-vip',
      slug: 'ivy-vip',
      name: 'Ivy Membership',
      emoji: '🌺',
      tier: 'ivy',
      donateRank: 3,
      price: 11.99,
      currency: 'EUR',
      type: 'subscription',
      interval: 'month',
      color: '#EF4444',
      badgeClass: 'badge-vip-ivy',
      groupName: 'Ivy VIP',
      description: 'Ultimate VIP membership with maximum perks, animated badge, and exclusive access.',
      features: [
        'Everything in Rose +',
        '"Ivy VIP" badge (animated gold glow)',
        'Larger avatar/signature limits',
        '2 extra vehicle slots',
        'Private island access',
        'Double paycheck',
        'Custom email in-game',
        'Priority name change (free)',
        'Access to Ivy-exclusive subforum',
      ],
    },
  ],

  // ============================================
  // ONE-TIME DONATION ITEMS (À la carte)
  // ============================================
  items: [
    // --- Properties ---
    { id: 'custom-house', slug: 'custom-house', name: 'Custom House', price: 20.00, currency: 'EUR', type: 'one-time', category: 'properties', icon: 'fa-home', description: 'Get a house placed at your desired location' },
    { id: 'tier1-business', slug: 'tier1-business', name: 'Tier 1 Business', price: 35.00, currency: 'EUR', type: 'one-time', category: 'properties', icon: 'fa-building', description: 'Own a business at a prime location' },
    { id: 'tier2-business', slug: 'tier2-business', name: 'Tier 2 Business', price: 55.00, currency: 'EUR', type: 'one-time', category: 'properties', icon: 'fa-building-o', description: 'Premium business with custom interior' },

    // --- Vehicles ---
    { id: 'tier1-vehicle', slug: 'tier1-vehicle', name: 'Tier 1 Vehicle', price: 5.00, currency: 'EUR', type: 'one-time', category: 'vehicles', icon: 'fa-car', description: 'Economy vehicle of your choice' },
    { id: 'tier2-vehicle', slug: 'tier2-vehicle', name: 'Tier 2 Vehicle', price: 7.00, currency: 'EUR', type: 'one-time', category: 'vehicles', icon: 'fa-car', description: 'Mid-range vehicle' },
    { id: 'tier3-vehicle', slug: 'tier3-vehicle', name: 'Tier 3 Vehicle', price: 10.00, currency: 'EUR', type: 'one-time', category: 'vehicles', icon: 'fa-car', description: 'Luxury/sport vehicle' },
    { id: 'nrg-500', slug: 'nrg-500', name: 'NRG-500', price: 15.00, currency: 'EUR', type: 'one-time', category: 'vehicles', icon: 'fa-motorcycle', description: 'The legendary motorcycle' },

    // --- Customization ---
    { id: 'custom-plate', slug: 'custom-plate', name: 'Custom License Plate', price: 2.00, currency: 'EUR', type: 'one-time', category: 'customization', icon: 'fa-id-card', description: 'Personalize your plate' },
    { id: 'dynamic-door', slug: 'dynamic-door', name: 'Dynamic Door', price: 15.00, currency: 'EUR', type: 'one-time', category: 'customization', icon: 'fa-door-open', description: 'Custom enterable door anywhere' },
    { id: 'custom-phone', slug: 'custom-phone', name: 'Custom Phone Number', price: 2.00, currency: 'EUR', type: 'one-time', category: 'customization', icon: 'fa-phone', description: 'Choose your in-game phone number' },
    { id: 'custom-forum-title', slug: 'custom-forum-title', name: 'Custom Forum Title', price: 7.50, currency: 'EUR', type: 'one-time', category: 'customization', icon: 'fa-tag', description: 'Stand out on forums' },

    // --- Lands ---
    { id: 'small-land', slug: 'small-land', name: 'Small Land', price: 59.99, currency: 'EUR', type: 'one-time', category: 'lands', icon: 'fa-map', description: 'Build zone' },
    { id: 'medium-land', slug: 'medium-land', name: 'Medium Land', price: 69.99, currency: 'EUR', type: 'one-time', category: 'lands', icon: 'fa-map', description: 'Larger build zone' },
    { id: 'large-land', slug: 'large-land', name: 'Large Land', price: 79.99, currency: 'EUR', type: 'one-time', category: 'lands', icon: 'fa-map', description: 'Maximum build zone' },

    // --- Relocations ---
    { id: 'house-move', slug: 'house-move', name: 'House Move', price: 5.00, currency: 'EUR', type: 'one-time', category: 'services', icon: 'fa-truck', description: 'Relocate your house' },
    { id: 'business-move', slug: 'business-move', name: 'Business Move', price: 10.00, currency: 'EUR', type: 'one-time', category: 'services', icon: 'fa-truck', description: 'Relocate your business' },
    { id: 'door-move', slug: 'door-move', name: 'Door Move', price: 5.00, currency: 'EUR', type: 'one-time', category: 'services', icon: 'fa-truck', description: 'Relocate your door' },
    { id: 'house-interior', slug: 'house-interior', name: 'House Interior Change', price: 5.00, currency: 'EUR', type: 'one-time', category: 'services', icon: 'fa-paint-brush', description: 'Change your house interior' },

    // --- Gang Items ---
    { id: 'gang-interior', slug: 'gang-interior', name: 'Gang Interior', price: 49.99, currency: 'EUR', type: 'one-time', category: 'gang', icon: 'fa-users', description: 'Custom gang HQ interior' },
    { id: 'gang-exterior', slug: 'gang-exterior', name: 'Gang Exterior', price: 59.99, currency: 'EUR', type: 'one-time', category: 'gang', icon: 'fa-users', description: 'Custom gang HQ exterior' },

    // --- Premium Items ---
    { id: 'private-island', slug: 'private-island', name: 'Private Island', price: 100.00, currency: 'EUR', type: 'one-time', category: 'premium', icon: 'fa-globe', description: 'Your own island' },
    { id: 'mp3-player', slug: 'mp3-player', name: 'MP3 Player', price: 5.00, currency: 'EUR', type: 'one-time', category: 'items', icon: 'fa-music', description: 'Listen to music in-game' },
    { id: 'boombox-1x', slug: 'boombox-1x', name: 'Boombox (1x)', price: 5.00, currency: 'EUR', type: 'one-time', category: 'items', icon: 'fa-volume-up', description: 'Portable music player' },
    { id: 'boombox-2x', slug: 'boombox-2x', name: 'Boombox (2x)', price: 8.00, currency: 'EUR', type: 'one-time', category: 'items', icon: 'fa-volume-up', description: 'Two boomboxes' },
    { id: 'private-dojo', slug: 'private-dojo', name: 'Private Dojo', price: 24.99, currency: 'EUR', type: 'one-time', category: 'premium', icon: 'fa-shield', description: 'Personal training facility' },

    // --- Boosts ---
    { id: 'double-xp-7d', slug: 'double-xp-7d', name: 'Double XP (7 days)', price: 2.00, currency: 'EUR', type: 'one-time', category: 'boosts', icon: 'fa-bolt', description: 'Temporary 2x experience' },
    { id: 'double-xp-30d', slug: 'double-xp-30d', name: 'Double XP (30 days)', price: 5.00, currency: 'EUR', type: 'one-time', category: 'boosts', icon: 'fa-bolt', description: '30 days of 2x experience' },
    { id: 'poker-table-1d', slug: 'poker-table-1d', name: 'Poker Table (1 day)', price: 1.99, currency: 'EUR', type: 'one-time', category: 'boosts', icon: 'fa-diamond', description: 'Host poker at your property' },
  ],

  // ============================================
  // BUNDLE PACKAGES
  // ============================================
  packages: [
    {
      id: 'newbie-package',
      slug: 'newbie-package',
      name: 'Newbie Package',
      price: 29.99,
      currency: 'EUR',
      type: 'one-time',
      category: 'packages',
      icon: 'fa-gift',
      color: '#A3E635',
      description: 'House + Tier 1 Vehicle + Daisy VIP',
      includes: ['custom-house', 'tier1-vehicle', 'daisy-vip'],
      savings: '€8.98',
    },
    {
      id: 'civilian-package',
      slug: 'civilian-package',
      name: 'Civilian Package',
      price: 54.99,
      currency: 'EUR',
      type: 'one-time',
      category: 'packages',
      icon: 'fa-gift',
      color: '#F59E0B',
      description: 'House + Business + Tier 2 Vehicle + Rose VIP',
      includes: ['custom-house', 'tier1-business', 'tier2-vehicle', 'rose-vip'],
      savings: '€13.99',
    },
    {
      id: 'lunatic-package',
      slug: 'lunatic-package',
      name: 'Lunatic Package',
      price: 79.99,
      currency: 'EUR',
      type: 'one-time',
      category: 'packages',
      icon: 'fa-gift',
      color: '#EF4444',
      description: 'House + Business + Tier 3 Vehicle + Ivy VIP',
      includes: ['custom-house', 'tier1-business', 'tier3-vehicle', 'ivy-vip'],
      savings: '€16.99',
    },
    {
      id: 'starter-package',
      slug: 'starter-package',
      name: 'Starter Package',
      price: 7.99,
      currency: 'EUR',
      type: 'one-time',
      category: 'packages',
      icon: 'fa-gift',
      color: '#3B82F6',
      description: 'Tier 1 Vehicle + Custom Plate',
      includes: ['tier1-vehicle', 'custom-plate'],
      savings: '€1.01',
    },
  ],
};

/**
 * Get all store items as a flat array
 */
function getAllItems() {
  return [
    ...STORE_ITEMS.subscriptions,
    ...STORE_ITEMS.items,
    ...STORE_ITEMS.packages,
  ];
}

/**
 * Find an item by ID
 */
function getItemById(id) {
  return getAllItems().find(item => item.id === id) || null;
}

/**
 * Find an item by slug
 */
function getItemBySlug(slug) {
  return getAllItems().find(item => item.slug === slug) || null;
}

/**
 * Get items by category
 */
function getItemsByCategory(category) {
  return STORE_ITEMS.items.filter(item => item.category === category);
}

/**
 * Get item categories
 */
function getCategories() {
  const categories = new Set(STORE_ITEMS.items.map(item => item.category));
  return Array.from(categories);
}

module.exports = {
  STORE_ITEMS,
  getAllItems,
  getItemById,
  getItemBySlug,
  getItemsByCategory,
  getCategories,
};
