/**
 * Flawless Roleplay — Client-side Theme JavaScript
 * Handles dynamic features: server status, latest topics, timeago, etc.
 */

'use strict';

(function () {
  // Wait for DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initServerStatus();
    initLatestTopics();
    initCategoryHoverEffects();
    initDonatorAvatarEffects();
  });

  /**
   * Server Status Widget — Polls SA-MP server query API
   */
  function initServerStatus() {
    var statusEl = document.getElementById('server-status-indicator');
    var countEl = document.getElementById('player-count');
    if (!statusEl || !countEl) return;

    function updateStatus() {
      fetch('/api/flawless-samp/server-status')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.online) {
            statusEl.style.background = '#22C55E';
            statusEl.nextElementSibling && (statusEl.nextElementSibling.textContent = 'SERVER ONLINE');
            countEl.textContent = data.players || '0';
          } else {
            statusEl.style.background = '#EF4444';
            statusEl.nextElementSibling && (statusEl.nextElementSibling.textContent = 'SERVER OFFLINE');
            countEl.textContent = '--';
          }
        })
        .catch(function () {
          statusEl.style.background = '#6B7280';
          countEl.textContent = '--';
        });
    }

    updateStatus();
    setInterval(updateStatus, 30000); // Update every 30 seconds
  }

  /**
   * Latest Topics Sidebar Widget
   */
  function initLatestTopics() {
    var container = document.getElementById('frp-latest-topics');
    if (!container) return;

    fetch('/api/recent?count=10')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.topics) return;
        var html = '';
        data.topics.forEach(function (t) {
          html += '<div class="topic-item" style="padding: 8px 0; border-bottom: 1px solid #1e1e24;">';
          html += '<a href="/topic/' + t.slug + '" style="color: #e5e7eb; text-decoration: none; font-size: 0.9rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + escapeHtml(t.title) + '</a>';
          html += '<div class="topic-meta" style="font-size: 0.75rem; color: #6B7280; margin-top: 2px;">';
          html += 'by ' + escapeHtml(t.user ? t.user.username : 'Unknown');
          html += ' &middot; <span class="timeago" title="' + (t.timestampISO || '') + '"></span>';
          html += '</div></div>';
        });
        container.innerHTML = html;

        // Re-initialize timeago for new elements
        if (window.jQuery && window.jQuery.timeago) {
          window.jQuery('.timeago').timeago();
        }
      })
      .catch(function () {
        container.innerHTML = '<p style="color: #6B7280; font-size: 0.85rem;">Unable to load topics.</p>';
      });
  }

  /**
   * Category hover effects
   */
  function initCategoryHoverEffects() {
    var categories = document.querySelectorAll('.category-item');
    categories.forEach(function (cat) {
      cat.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(2px)';
      });
      cat.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0)';
      });
    });
  }

  /**
   * Apply donator avatar glow effects based on data attributes
   */
  function initDonatorAvatarEffects() {
    var avatars = document.querySelectorAll('[data-donator-rank]');
    avatars.forEach(function (avatar) {
      var rank = parseInt(avatar.getAttribute('data-donator-rank'), 10);
      if (rank === 1) avatar.classList.add('donator-daisy');
      else if (rank === 2) avatar.classList.add('donator-rose');
      else if (rank >= 3) avatar.classList.add('donator-ivy');
    });
  }

  /**
   * HTML escape utility
   */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }
})();
