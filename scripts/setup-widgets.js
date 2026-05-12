#!/usr/bin/env node

/**
 * Flawless RP — NodeBB Widget Configuration
 * Defines all widget HTML for the forum sidebar and homepage.
 *
 * These widgets should be added via ACP > Appearance > Widgets
 * or programmatically via the NodeBB Write API.
 *
 * Usage: node setup-widgets.js (outputs widget HTML for manual insertion)
 */

'use strict';

const widgets = {
  // ============================================================
  // SERVER STATUS WIDGET
  // ============================================================
  serverStatus: {
    name: 'Server Status',
    placement: 'sidebar',
    html: `
<div class="frp-server-status card" style="background: #111114; border: 1px solid #1e1e24; border-radius: 4px;">
  <div class="card-body text-center" style="padding: 16px;">
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
      <div id="server-status-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: #22C55E; display: inline-block; margin-right: 8px; animation: pulse 2s infinite;"></div>
      <span style="font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; color: #e5e7eb; text-transform: uppercase; letter-spacing: 1px;">SERVER ONLINE</span>
    </div>
    <div style="margin-top: 8px;">
      <span id="player-count" style="font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; color: #F59E0B;">--</span>
      <span style="color: #6B7280; font-size: 0.85rem;"> / 200 Players</span>
    </div>
    <div style="margin-top: 12px;">
      <code style="color: #9CA3AF; font-size: 0.9rem; background: rgba(245, 158, 11, 0.1); padding: 4px 8px; border-radius: 3px;">play.flawlessrp.com:7777</code>
    </div>
    <a href="samp://play.flawlessrp.com:7777" class="btn btn-sm mt-2" style="width: 100%; background: #F59E0B; color: #000; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
      &#9654; CONNECT NOW
    </a>
  </div>
</div>
<style>
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>`,
  },

  // ============================================================
  // LATEST THREADS WIDGET
  // ============================================================
  latestThreads: {
    name: 'Latest Threads',
    placement: 'sidebar',
    html: `
<div class="frp-latest-widget" style="background: #111114; border: 1px solid #1e1e24; border-radius: 4px; padding: 16px;">
  <h4 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin-bottom: 12px; font-size: 0.95rem;">
    LATEST THREADS
  </h4>
  <div id="frp-latest-topics">
    <p style="color: #6B7280; font-size: 0.85rem;">Loading...</p>
  </div>
</div>
<script>
(function() {
  fetch('/api/recent?count=10').then(function(r) { return r.json(); }).then(function(data) {
    var c = document.getElementById('frp-latest-topics');
    if (!data || !data.topics) { c.innerHTML = '<p style="color:#6B7280;">No topics yet.</p>'; return; }
    var h = '';
    data.topics.forEach(function(t) {
      h += '<div style="padding:8px 0;border-bottom:1px solid #1e1e24;">';
      h += '<a href="/topic/' + t.slug + '" style="color:#e5e7eb;text-decoration:none;font-size:0.9rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + t.title + '</a>';
      h += '<div style="font-size:0.75rem;color:#6B7280;margin-top:2px;">by ' + (t.user ? t.user.username : 'Unknown') + ' &middot; <span class="timeago" title="' + (t.timestampISO || '') + '"></span></div>';
      h += '</div>';
    });
    c.innerHTML = h;
    if (window.jQuery && window.jQuery.timeago) { window.jQuery('.timeago').timeago(); }
  }).catch(function() {
    document.getElementById('frp-latest-topics').innerHTML = '<p style="color:#6B7280;">Unable to load.</p>';
  });
})();
</script>`,
  },

  // ============================================================
  // FORUM STATS WIDGET
  // ============================================================
  forumStats: {
    name: 'Forum Statistics',
    placement: 'sidebar',
    html: `
<div style="background: #111114; border: 1px solid #1e1e24; border-radius: 4px; padding: 16px;">
  <h4 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin-bottom: 12px; font-size: 0.95rem;">
    FORUM STATISTICS
  </h4>
  <div id="frp-forum-stats">
    <p style="color: #6B7280; font-size: 0.85rem;">Loading...</p>
  </div>
</div>
<script>
(function() {
  fetch('/api/config').then(function(r) { return r.json(); }).then(function(data) {
    var c = document.getElementById('frp-forum-stats');
    var stats = [
      { label: 'Topics', value: data.topicCount || 0 },
      { label: 'Posts', value: data.postCount || 0 },
      { label: 'Users', value: data.userCount || 0 },
      { label: 'Online', value: data.onlineCount || 0 },
    ];
    var h = '';
    stats.forEach(function(s) {
      h += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1e1e24;">';
      h += '<span style="color:#9CA3AF;font-size:0.85rem;">' + s.label + '</span>';
      h += '<span style="color:#F59E0B;font-family:\'JetBrains Mono\',monospace;font-size:0.85rem;">' + s.value.toLocaleString() + '</span>';
      h += '</div>';
    });
    c.innerHTML = h;
  }).catch(function() {});
})();
</script>`,
  },

  // ============================================================
  // DISCORD WIDGET
  // ============================================================
  discord: {
    name: 'Discord',
    placement: 'sidebar',
    html: `
<div style="background: #111114; border: 1px solid #1e1e24; border-radius: 4px; padding: 16px; text-align: center;">
  <h4 style="font-family: 'Barlow Condensed', sans-serif; color: #5865F2; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #5865F2; padding-bottom: 8px; margin-bottom: 12px; font-size: 0.95rem;">
    <i class="fa fa-comments me-1"></i> JOIN DISCORD
  </h4>
  <p style="color: #9CA3AF; font-size: 0.85rem; margin-bottom: 12px;">
    Chat with the community in real-time
  </p>
  <a href="https://discord.gg/flawlessrp" target="_blank" class="btn btn-sm" style="width: 100%; background: #5865F2; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
    <i class="fa fa-external-link me-1"></i> JOIN SERVER
  </a>
</div>`,
  },

  // ============================================================
  // PLAY NOW BUTTON WIDGET
  // ============================================================
  playNow: {
    name: 'Play Now',
    placement: 'sidebar',
    html: `
<div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 4px; padding: 16px; text-align: center;">
  <h4 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; text-transform: uppercase; letter-spacing: 1px; font-size: 1rem; margin-bottom: 8px;">
    READY TO PLAY?
  </h4>
  <p style="color: #9CA3AF; font-size: 0.8rem; margin-bottom: 12px;">
    Download SA-MP and join Flawless Roleplay
  </p>
  <a href="/connect" class="btn btn-sm" style="width: 100%; background: #F59E0B; color: #000; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
    <i class="fa fa-download me-1"></i> HOW TO CONNECT
  </a>
  <a href="/store" class="btn btn-sm btn-outline-primary" style="width: 100%; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
    <i class="fa fa-shopping-cart me-1"></i> DONATION STORE
  </a>
</div>`,
  },
};

// Output all widgets
console.log('='.repeat(60));
console.log('FLAWLESS ROLEPLAY — Widget HTML Reference');
console.log('='.repeat(60));
console.log('');
console.log('Add these widgets via ACP > Appearance > Widgets');
console.log('Place them in the appropriate widget areas.');
console.log('');

for (const [key, widget] of Object.entries(widgets)) {
  console.log(`--- ${widget.name} (${widget.placement}) ---`);
  console.log(widget.html);
  console.log('');
}

module.exports = widgets;
