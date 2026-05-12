'use strict';

/**
 * Flawless Roleplay — Game Stats Client-Side JavaScript
 * Handles dynamic loading of game stats on profile pages
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initGameStatsWidget();
    initServerStatusWidget();
  });

  /**
   * Load game stats widget on user profile sidebar
   */
  function initGameStatsWidget() {
    var widget = document.querySelector('[data-widget="game-stats"]');
    if (!widget) return;

    var uid = widget.getAttribute('data-uid');
    if (!uid) return;

    fetch('/api/flawless-samp/user/' + uid + '/game-stats')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.error) {
          widget.innerHTML = '<p style="color: #6B7280; font-size: 0.85rem; text-align: center;">No game data</p>';
          return;
        }

        widget.innerHTML = [
          '<div class="frp-game-stats" style="padding: 12px;">',
          '  <h5 style="font-family: \'Barlow Condensed\', sans-serif; color: #F59E0B; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #F59E0B; padding-bottom: 6px; margin-bottom: 10px; font-size: 0.85rem;">',
          '    <i class="fa fa-gamepad me-1"></i> IN-GAME STATS',
          '  </h5>',
          '  <div class="stat-item"><span class="stat-label">Level</span><span class="stat-value">' + data.level + '</span></div>',
          '  <div class="stat-item"><span class="stat-label">Faction</span><span class="stat-value" style="color: ' + data.factionColor + ';">' + data.factionName + '</span></div>',
          '  <div class="stat-item"><span class="stat-label">Gang</span><span class="stat-value" style="color: ' + data.gangColor + ';">' + data.gangName + '</span></div>',
          '  <div class="stat-item"><span class="stat-label">K/D</span><span class="stat-value">' + data.kd + '</span></div>',
          '  <div class="stat-item"><span class="stat-label">Wealth</span><span class="stat-value" style="color: #22C55E;">$' + data.totalWealth.toLocaleString() + '</span></div>',
          '  <div class="stat-item"><span class="stat-label">Playtime</span><span class="stat-value">' + data.playTimeHours + 'h</span></div>',
          '</div>',
        ].join('\n');
      })
      .catch(function () {
        widget.innerHTML = '<p style="color: #6B7280; font-size: 0.85rem; text-align: center;">Unable to load game data</p>';
      });
  }

  /**
   * Initialize server status widget
   */
  function initServerStatusWidget() {
    var statusEl = document.getElementById('server-status-indicator');
    var countEl = document.getElementById('player-count');
    if (!statusEl || !countEl) return;

    function update() {
      fetch('/api/flawless-samp/server-status')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.online) {
            statusEl.style.background = '#22C55E';
            countEl.textContent = data.players || '0';
          } else {
            statusEl.style.background = '#EF4444';
            countEl.textContent = '--';
          }
        })
        .catch(function () {
          statusEl.style.background = '#6B7280';
          countEl.textContent = '--';
        });
    }

    update();
    setInterval(update, 30000);
  }
})();
