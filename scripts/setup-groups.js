#!/usr/bin/env node

/**
 * Flawless RP — NodeBB User Groups Setup Script
 * Creates all faction, gang, VIP, and admin user groups.
 *
 * Usage:
 *   NODEBB_URL=http://localhost:4567 NODEBB_TOKEN=your-admin-token node setup-groups.js
 */

'use strict';

const NODEBB_URL = process.env.NODEBB_URL || 'http://localhost:4567';
const TOKEN = process.env.NODEBB_TOKEN;

if (!TOKEN) {
  console.error('ERROR: NODEBB_TOKEN environment variable is required.');
  process.exit(1);
}

const GROUPS = [
  // Admin Groups
  { name: 'Administrators', description: 'Server administrators (AdminLevel >= 4)', labelColor: '#EF4444', icon: 'fa-shield' },
  { name: 'Moderators', description: 'Server moderators (AdminLevel 2-3)', labelColor: '#F59E0B', icon: 'fa-gavel' },
  { name: 'Helpers', description: 'Server helpers (AdminLevel 1)', labelColor: '#22C55E', icon: 'fa-life-ring' },

  // Faction Groups
  { name: 'LSPD', description: 'Los Santos Police Department members', labelColor: '#3B82F6', icon: 'fa-star' },
  { name: 'FBI', description: 'Federal Bureau of Investigation members', labelColor: '#1D4ED8', icon: 'fa-eye' },
  { name: 'SASD', description: 'San Andreas Sheriff Department members', labelColor: '#92400E', icon: 'fa-star' },
  { name: 'ARES', description: 'ARES faction members', labelColor: '#7C3AED', icon: 'fa-crosshairs' },
  { name: 'SANEWS', description: 'San Andreas News members', labelColor: '#06B6D4', icon: 'fa-newspaper-o' },
  { name: 'Government', description: 'Government faction members', labelColor: '#059669', icon: 'fa-university' },
  { name: 'Hitman Agency', description: 'Hitman Agency members', labelColor: '#DC2626', icon: 'fa-crosshairs' },
  { name: 'Paramedics', description: 'Paramedics faction members', labelColor: '#F43F5E', icon: 'fa-plus-square' },
  { name: 'National Guard', description: 'National Guard members', labelColor: '#4B5563', icon: 'fa-fighter-jet' },

  // Gang Groups
  { name: 'Ghetto Ghouls', description: 'Ghetto Ghouls gang members', labelColor: '#F58216', icon: 'fa-fire' },
  { name: 'Velvet Thugs', description: 'Velvet Thugs gang members', labelColor: '#636363', icon: 'fa-users' },
  { name: 'Baba Stars', description: 'Baba Stars gang members', labelColor: '#22C55E', icon: 'fa-star' },
  { name: 'Los Santos Rifa', description: 'Los Santos Rifa gang members', labelColor: '#3B82F6', icon: 'fa-bolt' },
  { name: 'Grove Street Families', description: 'Grove Street Families gang members', labelColor: '#16A34A', icon: 'fa-leaf' },
  { name: 'La Cosa Nostra', description: 'La Cosa Nostra gang members', labelColor: '#1F2937', icon: 'fa-user-secret' },

  // VIP Groups
  { name: 'Daisy VIP', description: 'Daisy VIP membership holders (DonateRank 1)', labelColor: '#A3E635', icon: 'fa-leaf' },
  { name: 'Rose VIP', description: 'Rose VIP membership holders (DonateRank 2)', labelColor: '#F59E0B', icon: 'fa-diamond' },
  { name: 'Ivy VIP', description: 'Ivy VIP membership holders (DonateRank 3)', labelColor: '#EF4444', icon: 'fa-crown' },

  // Special Groups
  { name: 'Faction Leaders', description: 'Faction leaders (IsLeader = 1)', labelColor: '#FFD700', icon: 'fa-crown' },
  { name: 'Trusted Traders', description: 'Manually assigned trusted marketplace traders', labelColor: '#10B981', icon: 'fa-check-circle' },
];

async function createGroup(groupData) {
  const res = await fetch(`${NODEBB_URL}/api/v3/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      name: groupData.name,
      description: groupData.description,
      labelColor: groupData.labelColor,
      textColor: '#FFFFFF',
      icon: groupData.icon,
      private: 1,
      hidden: 0,
      disableJoinRequests: 1,
      disableLeave: 0,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // Group might already exist
    if (text.includes('already exists') || res.status === 409) {
      console.log(`  EXISTS: ${groupData.name}`);
      return;
    }
    console.error(`  FAILED: ${groupData.name} — ${res.status} ${text}`);
    return;
  }

  console.log(`  CREATED: ${groupData.name} (${groupData.labelColor})`);
}

async function setup() {
  console.log('='.repeat(60));
  console.log('FLAWLESS ROLEPLAY — User Groups Setup');
  console.log(`Target: ${NODEBB_URL}`);
  console.log('='.repeat(60));
  console.log('');

  for (const group of GROUPS) {
    await createGroup(group);
  }

  console.log('');
  console.log(`DONE! Processed ${GROUPS.length} groups.`);
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
