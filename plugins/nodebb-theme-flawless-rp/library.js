'use strict';

const theme = module.exports;

/**
 * Flawless Roleplay Theme — Library
 * Handles theme initialization and custom hooks
 */

theme.onConfigGet = async function (config) {
  // Override default theme settings
  config.theme = config.theme || {};
  config['brand:logo'] = config['brand:logo'] || '';
  config['brand:logo:url'] = config['brand:logo:url'] || '/';
  return config;
};

theme.addCustomCSS = async function (header) {
  // Add Google Fonts preconnect for performance
  header.links = header.links || [];
  header.links.push(
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
  );
  return header;
};
