#!/usr/bin/env node

/**
 * Flawless RP — NodeBB Category Setup Script
 * Creates the complete forum category hierarchy with 70+ categories.
 *
 * Usage:
 *   NODEBB_URL=http://localhost:4567 NODEBB_TOKEN=your-admin-token node setup-categories.js
 *
 * Generate an API token from: ACP > Settings > API Access
 */

'use strict';

const NODEBB_URL = process.env.NODEBB_URL || 'http://localhost:4567';
const TOKEN = process.env.NODEBB_TOKEN;

if (!TOKEN) {
  console.error('ERROR: NODEBB_TOKEN environment variable is required.');
  console.error('Generate one from ACP > Settings > API Access');
  process.exit(1);
}

let categoryCount = 0;

async function createCategory(data) {
  const res = await fetch(`${NODEBB_URL}/api/v3/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`FAILED: ${data.name} — ${res.status} ${text}`);
    return null;
  }

  const json = await res.json();
  const cid = json.response?.cid || json.payload?.cid;
  categoryCount++;
  console.log(`[${categoryCount}] Created: ${data.name} (cid: ${cid})`);
  return { cid };
}

async function setup() {
  console.log('='.repeat(60));
  console.log('FLAWLESS ROLEPLAY — Category Setup');
  console.log(`Target: ${NODEBB_URL}`);
  console.log('='.repeat(60));
  console.log('');

  // ============================================================
  // SECTION: FLAWLESS ROLEPLAY (Main)
  // ============================================================

  // Announcements & News
  const announcements = await createCategory({
    name: 'Announcements & News',
    description: 'All important announcements. Keep yourself up-to-date.',
    bgColor: '#F59E0B',
    color: '#000',
    icon: 'fa-bullhorn',
    order: 1,
  });

  if (announcements) {
    await createCategory({ name: 'Server Updates & Changelogs', description: 'Patch notes and updates.', parentCid: announcements.cid, icon: 'fa-code-branch', order: 1 });
    await createCategory({ name: 'Community Events', description: 'Upcoming events and competitions.', parentCid: announcements.cid, icon: 'fa-calendar', order: 2 });
    await createCategory({ name: 'Staff Announcements', description: 'Important messages from the admin team.', parentCid: announcements.cid, icon: 'fa-shield', order: 3 });
  }

  // Information Center
  const info = await createCategory({
    name: 'Information Center',
    description: 'Server rules, features, and guides.',
    bgColor: '#3B82F6',
    color: '#fff',
    icon: 'fa-info-circle',
    order: 2,
  });

  if (info) {
    await createCategory({ name: 'Server Rules', description: 'Read before playing.', parentCid: info.cid, icon: 'fa-gavel', order: 1 });
    await createCategory({ name: 'Rule Updates', description: 'Changes and additions to the rules.', parentCid: info.cid, icon: 'fa-refresh', order: 2 });
    await createCategory({ name: 'Server Features & Guides', description: 'Learn about server systems.', parentCid: info.cid, icon: 'fa-book', order: 3 });
    await createCategory({ name: 'Frequently Asked Questions', description: 'Common questions answered.', parentCid: info.cid, icon: 'fa-question-circle', order: 4 });
    await createCategory({ name: 'Connection Guide', description: 'How to download SA-MP and connect to Flawless RP.', parentCid: info.cid, icon: 'fa-plug', order: 5 });
  }

  // Player Support
  const support = await createCategory({
    name: 'Player Support',
    description: 'Get help from our community.',
    bgColor: '#22C55E',
    color: '#000',
    icon: 'fa-life-ring',
    order: 3,
  });

  if (support) {
    await createCategory({ name: 'General Help & Questions', parentCid: support.cid, icon: 'fa-question', order: 1 });
    await createCategory({ name: 'Technical Support', parentCid: support.cid, icon: 'fa-wrench', order: 2 });
    await createCategory({ name: 'Player-Created Guides', parentCid: support.cid, icon: 'fa-pencil', order: 3 });
    await createCategory({ name: 'Video Tutorials', parentCid: support.cid, icon: 'fa-video-camera', order: 4 });
  }

  // ============================================================
  // SECTION: APPLICATIONS & REQUESTS
  // ============================================================

  // Ban Appeals
  const banAppeals = await createCategory({
    name: 'Ban Appeals',
    description: 'Appeal your ban here.',
    bgColor: '#EF4444',
    color: '#fff',
    icon: 'fa-ban',
    order: 10,
  });

  if (banAppeals) {
    await createCategory({ name: 'Pending Appeals', parentCid: banAppeals.cid, icon: 'fa-clock-o', order: 1 });
    await createCategory({ name: 'Accepted Appeals', parentCid: banAppeals.cid, icon: 'fa-check', order: 2 });
    await createCategory({ name: 'Denied Appeals', parentCid: banAppeals.cid, icon: 'fa-times', order: 3 });
  }

  // Player Reports
  const reports = await createCategory({
    name: 'Player Reports',
    description: 'Report rule-breaking players.',
    bgColor: '#DC2626',
    color: '#fff',
    icon: 'fa-flag',
    order: 11,
  });

  if (reports) {
    await createCategory({ name: 'Pending Reports', parentCid: reports.cid, icon: 'fa-clock-o', order: 1 });
    await createCategory({ name: 'Resolved Reports', parentCid: reports.cid, icon: 'fa-check', order: 2 });
    await createCategory({ name: 'Denied Reports', parentCid: reports.cid, icon: 'fa-times', order: 3 });
  }

  // Staff Applications
  const staffApps = await createCategory({
    name: 'Staff Applications',
    description: 'Apply to become a staff member.',
    bgColor: '#7C3AED',
    color: '#fff',
    icon: 'fa-user-plus',
    order: 12,
  });

  if (staffApps) {
    await createCategory({ name: 'Open Applications', parentCid: staffApps.cid, icon: 'fa-folder-open', order: 1 });
    await createCategory({ name: 'Accepted Applications', parentCid: staffApps.cid, icon: 'fa-check-circle', order: 2 });
    await createCategory({ name: 'Denied Applications', parentCid: staffApps.cid, icon: 'fa-times-circle', order: 3 });
  }

  // Name Change Requests
  await createCategory({
    name: 'Name Change Requests',
    description: 'Request an in-game name change.',
    bgColor: '#06B6D4',
    color: '#000',
    icon: 'fa-id-card',
    order: 13,
  });

  // Refund Requests
  await createCategory({
    name: 'Refund Requests',
    description: 'Request a refund for lost items due to bugs.',
    bgColor: '#F59E0B',
    color: '#000',
    icon: 'fa-undo',
    order: 14,
  });

  // ============================================================
  // SECTION: FACTION MANAGEMENT — LAW ENFORCEMENT
  // ============================================================

  const lawEnforcement = await createCategory({
    name: 'Law Enforcement',
    description: 'LSPD, FBI, SASD, and National Guard.',
    bgColor: '#3B82F6',
    color: '#fff',
    icon: 'fa-shield',
    order: 20,
  });

  if (lawEnforcement) {
    // LSPD
    const lspd = await createCategory({ name: 'Los Santos Police Department', description: 'LSPD Faction Hub', parentCid: lawEnforcement.cid, bgColor: '#3B82F6', icon: 'fa-star', order: 1 });
    if (lspd) {
      await createCategory({ name: 'LSPD Roster & Ranks', parentCid: lspd.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'LSPD Handbook', parentCid: lspd.cid, icon: 'fa-book', order: 2 });
      await createCategory({ name: 'LSPD Internal Affairs', parentCid: lspd.cid, icon: 'fa-eye', order: 3 });
      const lspdRecruit = await createCategory({ name: 'LSPD Recruitment', parentCid: lspd.cid, icon: 'fa-user-plus', order: 4 });
      if (lspdRecruit) {
        await createCategory({ name: 'LSPD Accepted', parentCid: lspdRecruit.cid, icon: 'fa-check', order: 1 });
        await createCategory({ name: 'LSPD Denied', parentCid: lspdRecruit.cid, icon: 'fa-times', order: 2 });
      }
    }

    // FBI
    const fbi = await createCategory({ name: 'Federal Bureau of Investigation', description: 'FBI Faction Hub', parentCid: lawEnforcement.cid, bgColor: '#1D4ED8', icon: 'fa-eye', order: 2 });
    if (fbi) {
      await createCategory({ name: 'FBI Roster & Ranks', parentCid: fbi.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'FBI Handbook', parentCid: fbi.cid, icon: 'fa-book', order: 2 });
      await createCategory({ name: 'FBI Internal Affairs', parentCid: fbi.cid, icon: 'fa-eye', order: 3 });
      await createCategory({ name: 'FBI Recruitment', parentCid: fbi.cid, icon: 'fa-user-plus', order: 4 });
    }

    // SASD
    const sasd = await createCategory({ name: 'San Andreas Sheriff Department', description: 'SASD Faction Hub', parentCid: lawEnforcement.cid, bgColor: '#92400E', icon: 'fa-star', order: 3 });
    if (sasd) {
      await createCategory({ name: 'SASD Roster & Ranks', parentCid: sasd.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'SASD Handbook', parentCid: sasd.cid, icon: 'fa-book', order: 2 });
      await createCategory({ name: 'SASD Recruitment', parentCid: sasd.cid, icon: 'fa-user-plus', order: 3 });
    }

    // National Guard
    const ng = await createCategory({ name: 'National Guard', description: 'National Guard Faction Hub', parentCid: lawEnforcement.cid, bgColor: '#4B5563', icon: 'fa-fighter-jet', order: 4 });
    if (ng) {
      await createCategory({ name: 'National Guard Roster', parentCid: ng.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'National Guard Recruitment', parentCid: ng.cid, icon: 'fa-user-plus', order: 2 });
    }
  }

  // ============================================================
  // SECTION: FACTION MANAGEMENT — GOVERNMENT & SERVICES
  // ============================================================

  const govServices = await createCategory({
    name: 'Government & Services',
    description: 'Government, SANEWS, ARES, and Paramedics.',
    bgColor: '#059669',
    color: '#fff',
    icon: 'fa-university',
    order: 21,
  });

  if (govServices) {
    // Government
    const gov = await createCategory({ name: 'Government', description: 'Government Faction Hub', parentCid: govServices.cid, bgColor: '#059669', icon: 'fa-university', order: 1 });
    if (gov) {
      await createCategory({ name: 'Government Roster', parentCid: gov.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Government Announcements', parentCid: gov.cid, icon: 'fa-bullhorn', order: 2 });
      await createCategory({ name: 'Government Recruitment', parentCid: gov.cid, icon: 'fa-user-plus', order: 3 });
    }

    // SANEWS
    const sanews = await createCategory({ name: 'San Andreas News', description: 'SANEWS Faction Hub', parentCid: govServices.cid, bgColor: '#06B6D4', icon: 'fa-newspaper-o', order: 2 });
    if (sanews) {
      await createCategory({ name: 'SANEWS Roster', parentCid: sanews.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Published Articles', parentCid: sanews.cid, icon: 'fa-file-text', order: 2 });
      await createCategory({ name: 'SANEWS Recruitment', parentCid: sanews.cid, icon: 'fa-user-plus', order: 3 });
    }

    // ARES
    const ares = await createCategory({ name: 'ARES', description: 'ARES Faction Hub', parentCid: govServices.cid, bgColor: '#7C3AED', icon: 'fa-crosshairs', order: 3 });
    if (ares) {
      await createCategory({ name: 'ARES Roster', parentCid: ares.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'ARES Recruitment', parentCid: ares.cid, icon: 'fa-user-plus', order: 2 });
    }

    // Paramedics
    const medic = await createCategory({ name: 'Paramedics', description: 'Paramedics Faction Hub', parentCid: govServices.cid, bgColor: '#F43F5E', icon: 'fa-plus-square', order: 4 });
    if (medic) {
      await createCategory({ name: 'Paramedics Roster', parentCid: medic.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Paramedics Recruitment', parentCid: medic.cid, icon: 'fa-user-plus', order: 2 });
    }
  }

  // ============================================================
  // SECTION: FACTION MANAGEMENT — ILLEGAL FACTIONS
  // ============================================================

  const illegalFactions = await createCategory({
    name: 'Illegal Factions',
    description: 'Hitman Agency and illegal faction applications.',
    bgColor: '#DC2626',
    color: '#fff',
    icon: 'fa-user-secret',
    order: 22,
  });

  if (illegalFactions) {
    const hitman = await createCategory({ name: 'Hitman Agency', description: 'Hitman Agency Faction Hub', parentCid: illegalFactions.cid, bgColor: '#DC2626', icon: 'fa-crosshairs', order: 1 });
    if (hitman) {
      await createCategory({ name: 'Agency Roster', parentCid: hitman.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Contract Board', description: 'IC — Restricted', parentCid: hitman.cid, icon: 'fa-file-text', order: 2 });
    }
    await createCategory({ name: 'Faction Applications (Illegal)', parentCid: illegalFactions.cid, icon: 'fa-user-plus', order: 2 });
  }

  // ============================================================
  // SECTION: GANG ZONE
  // ============================================================

  const gangZone = await createCategory({
    name: 'Gang Zone',
    description: 'Official and unofficial gangs.',
    bgColor: '#F58216',
    color: '#000',
    icon: 'fa-users',
    order: 30,
  });

  if (gangZone) {
    // Ghetto Ghouls
    const ghouls = await createCategory({ name: 'Ghetto Ghouls', parentCid: gangZone.cid, bgColor: '#F58216', icon: 'fa-fire', order: 1 });
    if (ghouls) {
      await createCategory({ name: 'Ghetto Ghouls Roster', parentCid: ghouls.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Ghetto Ghouls Recruitment', parentCid: ghouls.cid, icon: 'fa-user-plus', order: 2 });
      await createCategory({ name: 'Ghetto Ghouls Media', parentCid: ghouls.cid, icon: 'fa-camera', order: 3 });
    }

    // Velvet Thugs
    const velvet = await createCategory({ name: 'The Velvet Thugs', parentCid: gangZone.cid, bgColor: '#636363', icon: 'fa-users', order: 2 });
    if (velvet) {
      await createCategory({ name: 'Velvet Thugs Roster', parentCid: velvet.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Velvet Thugs Recruitment', parentCid: velvet.cid, icon: 'fa-user-plus', order: 2 });
      await createCategory({ name: 'Velvet Thugs Media', parentCid: velvet.cid, icon: 'fa-camera', order: 3 });
    }

    // Baba Stars
    const baba = await createCategory({ name: 'Baba Stars', parentCid: gangZone.cid, bgColor: '#22C55E', icon: 'fa-star', order: 3 });
    if (baba) {
      await createCategory({ name: 'Baba Stars Roster', parentCid: baba.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Baba Stars Recruitment', parentCid: baba.cid, icon: 'fa-user-plus', order: 2 });
      await createCategory({ name: 'Baba Stars Media', parentCid: baba.cid, icon: 'fa-camera', order: 3 });
    }

    // Los Santos Rifa
    const rifa = await createCategory({ name: 'Los Santos Rifa', parentCid: gangZone.cid, bgColor: '#3B82F6', icon: 'fa-bolt', order: 4 });
    if (rifa) {
      await createCategory({ name: 'Los Santos Rifa Roster', parentCid: rifa.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Los Santos Rifa Recruitment', parentCid: rifa.cid, icon: 'fa-user-plus', order: 2 });
      await createCategory({ name: 'Los Santos Rifa Media', parentCid: rifa.cid, icon: 'fa-camera', order: 3 });
    }

    // Grove Street Families
    const grove = await createCategory({ name: 'Grove Street Families', parentCid: gangZone.cid, bgColor: '#16A34A', icon: 'fa-leaf', order: 5 });
    if (grove) {
      await createCategory({ name: 'Grove Street Roster', parentCid: grove.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'Grove Street Recruitment', parentCid: grove.cid, icon: 'fa-user-plus', order: 2 });
      await createCategory({ name: 'Grove Street Media', parentCid: grove.cid, icon: 'fa-camera', order: 3 });
    }

    // La Cosa Nostra
    const lcn = await createCategory({ name: 'La Cosa Nostra', parentCid: gangZone.cid, bgColor: '#1F2937', icon: 'fa-user-secret', order: 6 });
    if (lcn) {
      await createCategory({ name: 'La Cosa Nostra Roster', parentCid: lcn.cid, icon: 'fa-list', order: 1 });
      await createCategory({ name: 'La Cosa Nostra Recruitment', parentCid: lcn.cid, icon: 'fa-user-plus', order: 2 });
      await createCategory({ name: 'La Cosa Nostra Media', parentCid: lcn.cid, icon: 'fa-camera', order: 3 });
    }

    // Unofficial Gangs
    const unofficial = await createCategory({ name: 'Unofficial Gangs', parentCid: gangZone.cid, icon: 'fa-question-circle', order: 7 });
    if (unofficial) {
      await createCategory({ name: 'Gang Creation Requests', parentCid: unofficial.cid, icon: 'fa-plus', order: 1 });
    }

    // Turf War Reports
    await createCategory({ name: 'Turf War Reports', description: 'IC — Turf war results and records.', parentCid: gangZone.cid, icon: 'fa-map', order: 8 });
  }

  // ============================================================
  // SECTION: IN CHARACTER
  // ============================================================

  const ic = await createCategory({
    name: 'In Character',
    description: 'Roleplay content and IC interactions.',
    bgColor: '#F59E0B',
    color: '#000',
    icon: 'fa-theater-masks',
    order: 40,
  });

  if (ic) {
    const chronicle = await createCategory({ name: 'San Andreas Chronicle', description: 'IC News articles and reports.', parentCid: ic.cid, icon: 'fa-newspaper-o', order: 1 });
    if (chronicle) {
      await createCategory({ name: 'News Archive', parentCid: chronicle.cid, icon: 'fa-archive', order: 1 });
    }

    const classifieds = await createCategory({ name: 'Classified Advertisements', parentCid: ic.cid, icon: 'fa-bullhorn', order: 2 });
    if (classifieds) {
      await createCategory({ name: 'Vehicles for Sale', parentCid: classifieds.cid, icon: 'fa-car', order: 1 });
      await createCategory({ name: 'Properties for Sale', description: 'Houses and businesses.', parentCid: classifieds.cid, icon: 'fa-home', order: 2 });
      await createCategory({ name: 'Jobs & Services', parentCid: classifieds.cid, icon: 'fa-briefcase', order: 3 });
      await createCategory({ name: 'Wanted / Looking For', parentCid: classifieds.cid, icon: 'fa-search', order: 4 });
    }

    const stories = await createCategory({ name: 'Character Stories & Development', parentCid: ic.cid, icon: 'fa-book', order: 3 });
    if (stories) {
      await createCategory({ name: 'Character Biographies', parentCid: stories.cid, icon: 'fa-user', order: 1 });
      await createCategory({ name: 'Roleplay Screenshots & Videos', parentCid: stories.cid, icon: 'fa-camera', order: 2 });
      await createCategory({ name: 'Creative Writing', parentCid: stories.cid, icon: 'fa-pencil', order: 3 });
    }

    await createCategory({ name: 'Court Cases & Legal Proceedings', parentCid: ic.cid, icon: 'fa-gavel', order: 4 });
  }

  // ============================================================
  // SECTION: OUT OF CHARACTER
  // ============================================================

  const ooc = await createCategory({
    name: 'Out of Character',
    description: 'General discussions and community content.',
    bgColor: '#6B7280',
    color: '#fff',
    icon: 'fa-comments',
    order: 50,
  });

  if (ooc) {
    await createCategory({ name: 'General Discussion', parentCid: ooc.cid, icon: 'fa-comments-o', order: 1 });
    await createCategory({ name: 'Introductions & Farewells', parentCid: ooc.cid, icon: 'fa-hand-paper-o', order: 2 });

    const suggestions = await createCategory({ name: 'Suggestions & Feedback', parentCid: ooc.cid, icon: 'fa-lightbulb-o', order: 3 });
    if (suggestions) {
      await createCategory({ name: 'Server Suggestions', parentCid: suggestions.cid, icon: 'fa-server', order: 1 });
      await createCategory({ name: 'Forum Suggestions', parentCid: suggestions.cid, icon: 'fa-commenting', order: 2 });
      await createCategory({ name: 'Implemented Suggestions', parentCid: suggestions.cid, icon: 'fa-check-circle', order: 3 });
    }

    const marketplace = await createCategory({ name: 'Marketplace', description: 'OOC Trading', parentCid: ooc.cid, icon: 'fa-shopping-bag', order: 4 });
    if (marketplace) {
      await createCategory({ name: 'Selling', parentCid: marketplace.cid, icon: 'fa-tag', order: 1 });
      await createCategory({ name: 'Buying', parentCid: marketplace.cid, icon: 'fa-shopping-cart', order: 2 });
      await createCategory({ name: 'Trusted Traders', parentCid: marketplace.cid, icon: 'fa-check-circle', order: 3 });
    }

    const media = await createCategory({ name: 'Media & Entertainment', parentCid: ooc.cid, icon: 'fa-film', order: 5 });
    if (media) {
      await createCategory({ name: 'Screenshots & Videos', parentCid: media.cid, icon: 'fa-camera', order: 1 });
      await createCategory({ name: 'Music', parentCid: media.cid, icon: 'fa-music', order: 2 });
      await createCategory({ name: 'Memes & Fun', parentCid: media.cid, icon: 'fa-smile-o', order: 3 });
    }
  }

  // ============================================================
  // SECTION: OTHER GAMES
  // ============================================================

  const otherGames = await createCategory({
    name: 'Other Games',
    description: 'Discuss other games with the community.',
    bgColor: '#8B5CF6',
    color: '#fff',
    icon: 'fa-gamepad',
    order: 60,
  });

  if (otherGames) {
    await createCategory({ name: 'GTA V / FiveM', parentCid: otherGames.cid, icon: 'fa-car', order: 1 });
    await createCategory({ name: 'Counter-Strike', parentCid: otherGames.cid, icon: 'fa-crosshairs', order: 2 });
    await createCategory({ name: 'Other PC Games', parentCid: otherGames.cid, icon: 'fa-desktop', order: 3 });
    await createCategory({ name: 'Console Gaming', parentCid: otherGames.cid, icon: 'fa-gamepad', order: 4 });
    await createCategory({ name: 'Mobile Gaming', parentCid: otherGames.cid, icon: 'fa-mobile', order: 5 });
  }

  // ============================================================
  // SECTION: ARCHIVE (Read-only)
  // ============================================================

  const archive = await createCategory({
    name: 'Archive',
    description: 'Read-only archived content.',
    bgColor: '#374151',
    color: '#fff',
    icon: 'fa-archive',
    order: 70,
  });

  if (archive) {
    await createCategory({ name: 'Old Announcements', parentCid: archive.cid, icon: 'fa-bullhorn', order: 1 });
    await createCategory({ name: 'Archived Applications', parentCid: archive.cid, icon: 'fa-folder', order: 2 });
    await createCategory({ name: 'Archived Discussions', parentCid: archive.cid, icon: 'fa-comments', order: 3 });
  }

  // ============================================================
  // DONE
  // ============================================================

  console.log('');
  console.log('='.repeat(60));
  console.log(`DONE! Created ${categoryCount} categories successfully.`);
  console.log('='.repeat(60));
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
