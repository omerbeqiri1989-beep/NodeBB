'use strict';

/**
 * SA-MP INI File Parser
 * Parses Key=Value format used by SA-MP scriptfiles
 * Replicates the UCP's ini-parser.ts logic in plain JavaScript
 */

const fs = require('fs');
const path = require('path');

const SCRIPTFILES_PATH = process.env.SCRIPTFILES_PATH || '/scriptfiles';

/**
 * Parse INI content string into a flat key-value map
 */
function parseIniContent(content) {
  const data = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';') || trimmed.startsWith('//')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    if (key) {
      data[key] = value;
    }
  }
  return data;
}

/**
 * Read and parse a player's INI file
 */
function readPlayerFile(playerName) {
  const filePath = path.join(SCRIPTFILES_PATH, 'Users', `${playerName}.ini`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return parseIniContent(content);
}

/**
 * List all player INI files
 */
function listAllPlayers() {
  const usersDir = path.join(SCRIPTFILES_PATH, 'Users');
  if (!fs.existsSync(usersDir)) return [];
  return fs.readdirSync(usersDir)
    .filter(f => f.endsWith('.ini'))
    .map(f => f.replace('.ini', ''));
}

/**
 * Get string value with default
 */
function getString(data, key, defaultValue) {
  return data[key] !== undefined ? data[key] : (defaultValue || '');
}

/**
 * Get integer value with default
 */
function getInt(data, key, defaultValue) {
  const val = data[key];
  if (val === undefined || val === '') return defaultValue || 0;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? (defaultValue || 0) : parsed;
}

/**
 * Get float value with default
 */
function getFloat(data, key, defaultValue) {
  const val = data[key];
  if (val === undefined || val === '') return defaultValue || 0;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? (defaultValue || 0) : parsed;
}

// Faction name mapping (Faction ID → Name)
const FACTION_NAMES = {
  0: 'Civilian',
  1: 'LSPD',
  2: 'FBI',
  3: 'SASD',
  4: 'ARES',
  5: 'SANEWS',
  6: 'Government',
  7: 'Hitman Agency',
  8: 'Paramedics',
  9: 'National Guard',
};

// Faction color mapping
const FACTION_COLORS = {
  0: '#6B7280',
  1: '#3B82F6',
  2: '#1D4ED8',
  3: '#92400E',
  4: '#7C3AED',
  5: '#06B6D4',
  6: '#059669',
  7: '#DC2626',
  8: '#F43F5E',
  9: '#4B5563',
};

// Gang name mapping (Gang ID → Name)
const GANG_NAMES = {
  0: 'Ghetto Ghouls',
  1: 'Velvet Thugs',
  2: 'Baba Stars',
  3: 'Los Santos Rifa',
  4: 'Grove Street Families',
  5: 'La Cosa Nostra',
  255: 'None',
};

// Gang color mapping
const GANG_COLORS = {
  0: '#F58216',
  1: '#636363',
  2: '#22C55E',
  3: '#3B82F6',
  4: '#16A34A',
  5: '#1F2937',
  255: '#6B7280',
};

// Donator rank names
const DONATOR_NAMES = {
  0: 'None',
  1: 'Daisy VIP',
  2: 'Rose VIP',
  3: 'Ivy VIP',
};

// Faction group names for NodeBB
const FACTION_GROUP_NAMES = {
  1: 'LSPD',
  2: 'FBI',
  3: 'SASD',
  4: 'ARES',
  5: 'SANEWS',
  6: 'Government',
  7: 'Hitman Agency',
  8: 'Paramedics',
  9: 'National Guard',
};

// Gang group names for NodeBB
const GANG_GROUP_NAMES = {
  0: 'Ghetto Ghouls',
  1: 'Velvet Thugs',
  2: 'Baba Stars',
  3: 'Los Santos Rifa',
  4: 'Grove Street Families',
  5: 'La Cosa Nostra',
};

/**
 * Extract structured player data from raw INI data
 */
function extractPlayerData(iniData) {
  const faction = getInt(iniData, 'Faction', 0);
  const gang = getInt(iniData, 'Gang', 255);
  const donateRank = getInt(iniData, 'DonateRank', 0);
  const kills = getInt(iniData, 'Kills', 0);
  const deaths = getInt(iniData, 'Deaths', 0);
  const cash = getInt(iniData, 'Cash', 0);
  const bank = getInt(iniData, 'Bank', 0);
  const level = getInt(iniData, 'Level', 1);
  const adminLevel = getInt(iniData, 'AdminLevel', 0);
  const connectedTime = getInt(iniData, 'ConnectedTime', 0);
  const isLeader = getInt(iniData, 'IsLeader', 0);
  const factionRank = getInt(iniData, 'FactionRank', 0);
  const gangRank = getInt(iniData, 'GangRank', 0);

  return {
    level,
    faction,
    factionName: FACTION_NAMES[faction] || 'Unknown',
    factionColor: FACTION_COLORS[faction] || '#6B7280',
    factionRank,
    isLeader,
    gang,
    gangName: GANG_NAMES[gang] || 'None',
    gangColor: GANG_COLORS[gang] || '#6B7280',
    gangRank,
    donateRank,
    donateRankName: DONATOR_NAMES[donateRank] || 'None',
    kills,
    deaths,
    kd: deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2),
    cash,
    bank,
    totalWealth: cash + bank,
    adminLevel,
    connectedTime,
    playTimeHours: Math.floor(connectedTime / 3600),

    // Skills
    boxingSkill: getInt(iniData, 'BoxingSkill', 0),
    pistolSkill: getInt(iniData, 'PistolSkill', 0),
    smgSkill: getInt(iniData, 'SMGSkill', 0),
    shotgunSkill: getInt(iniData, 'ShotgunSkill', 0),
    ak47Skill: getInt(iniData, 'AK47Skill', 0),
    m4Skill: getInt(iniData, 'M4Skill', 0),
    sniperSkill: getInt(iniData, 'SniperSkill', 0),
    fishingSkill: getInt(iniData, 'FishingSkill', 0),

    // Licenses
    carLicense: getInt(iniData, 'CarLicense', 0),
    flyLicense: getInt(iniData, 'FlyLicense', 0),
    boatLicense: getInt(iniData, 'BoatLicense', 0),
    fishLicense: getInt(iniData, 'FishLicense', 0),
    gunLicense: getInt(iniData, 'GunLicense', 0),

    // Job
    job: getInt(iniData, 'Job', 0),

    // Raw data reference
    _raw: iniData,
  };
}

module.exports = {
  parseIniContent,
  readPlayerFile,
  listAllPlayers,
  getString,
  getInt,
  getFloat,
  extractPlayerData,
  FACTION_NAMES,
  FACTION_COLORS,
  GANG_NAMES,
  GANG_COLORS,
  DONATOR_NAMES,
  FACTION_GROUP_NAMES,
  GANG_GROUP_NAMES,
};
