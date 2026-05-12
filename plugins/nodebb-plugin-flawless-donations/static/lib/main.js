'use strict';

/**
 * Flawless Roleplay — Donation Store Client-Side JavaScript
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initCategoryFilters();
    initPurchaseButtons();
  });

  var selectedItemId = null;

  /**
   * Category filter buttons for the item grid
   */
  function initCategoryFilters() {
    var filters = document.querySelectorAll('.category-filter');
    var items = document.querySelectorAll('.item-card');

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = this.getAttribute('data-category');

        // Update active state
        filters.forEach(function (f) { f.classList.remove('active'); });
        this.classList.add('active');

        // Filter items
        items.forEach(function (item) {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * Purchase button click handlers
   */
  function initPurchaseButtons() {
    var buttons = document.querySelectorAll('.purchase-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedItemId = this.getAttribute('data-item-id');

        // Fetch item details
        fetch('/api/store/items')
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var allItems = [].concat(data.subscriptions || [], data.items || [], data.packages || []);
            var item = allItems.find(function (i) { return i.id === selectedItemId; });

            if (item) {
              document.getElementById('modal-item-name').textContent = item.name;
              document.getElementById('modal-item-price').textContent = '€' + item.price.toFixed(2);

              // Show payment modal
              var modal = new bootstrap.Modal(document.getElementById('paymentModal'));
              modal.show();
            }
          });
      });
    });

    // Stripe payment button
    var stripeBtn = document.getElementById('pay-stripe');
    if (stripeBtn) {
      stripeBtn.addEventListener('click', function () {
        if (!selectedItemId) return;
        this.disabled = true;
        this.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Processing...';

        fetch('/api/donations/checkout/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': getCsrfToken(),
          },
          body: JSON.stringify({ itemId: selectedItemId }),
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (data.url) {
              window.location.href = data.url;
            } else {
              alert(data.error || 'Failed to create checkout session. Please try again.');
              stripeBtn.disabled = false;
              stripeBtn.innerHTML = '<i class="fa fa-credit-card me-2"></i>Pay with Card (Stripe)';
            }
          })
          .catch(function (err) {
            alert('An error occurred. Please try again.');
            stripeBtn.disabled = false;
            stripeBtn.innerHTML = '<i class="fa fa-credit-card me-2"></i>Pay with Card (Stripe)';
          });
      });
    }

    // PayPal payment button
    var paypalBtn = document.getElementById('pay-paypal');
    if (paypalBtn) {
      paypalBtn.addEventListener('click', function () {
        if (!selectedItemId) return;
        this.disabled = true;
        this.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Processing...';

        fetch('/api/donations/checkout/paypal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': getCsrfToken(),
          },
          body: JSON.stringify({ itemId: selectedItemId }),
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (data.url) {
              window.location.href = data.url;
            } else {
              alert(data.error || 'Failed to create PayPal order. Please try again.');
              paypalBtn.disabled = false;
              paypalBtn.innerHTML = '<i class="fa fa-paypal me-2"></i>Pay with PayPal';
            }
          })
          .catch(function (err) {
            alert('An error occurred. Please try again.');
            paypalBtn.disabled = false;
            paypalBtn.innerHTML = '<i class="fa fa-paypal me-2"></i>Pay with PayPal';
          });
      });
    }
  }

  /**
   * Get CSRF token from NodeBB
   */
  function getCsrfToken() {
    var meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
  }
})();
