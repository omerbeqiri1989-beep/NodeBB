<!-- Flawless Roleplay — Donation Store -->
<!-- IMPORT partials/breadcrumbs.tpl -->

<div class="store-page" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
  <!-- Store Header -->
  <div class="text-center mb-4" style="padding: 40px 20px; background: linear-gradient(135deg, #111114 0%, #1a1a1f 100%); border: 1px solid #1e1e24; border-radius: 8px;">
    <h1 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; text-transform: uppercase; letter-spacing: 3px; font-size: 2rem; margin-bottom: 8px;">
      <i class="fa fa-shopping-cart me-2"></i>DONATION STORE
    </h1>
    <p style="color: #9CA3AF; font-size: 1rem; max-width: 600px; margin: 0 auto;">
      Support Flawless Roleplay and unlock exclusive in-game perks and forum benefits.
      All donations go directly towards server maintenance and development.
    </p>
  </div>

  <!-- VIP Membership Tiers -->
  <div class="section-header" style="font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #F59E0B; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin: 32px 0 16px 0; font-size: 1.1rem;">
    <i class="fa fa-crown me-2"></i>VIP MEMBERSHIPS
  </div>

  <div class="row g-3 mb-4">
    {{{ each subscriptions }}}
    <div class="col-lg-4 col-md-6">
      <div class="frp-store-item tier-{subscriptions.tier}" style="height: 100%; display: flex; flex-direction: column;">
        <div class="text-center mb-3">
          <span style="font-size: 2rem;">{subscriptions.emoji}</span>
          <h3 style="font-family: 'Barlow Condensed', sans-serif; color: {subscriptions.color}; text-transform: uppercase; letter-spacing: 1px; margin: 8px 0 4px 0;">
            {subscriptions.name}
          </h3>
          <div class="price">
            <span class="currency">€</span>{subscriptions.price}<span style="font-size: 0.8rem; color: #6B7280;">/month</span>
          </div>
        </div>
        <p style="color: #9CA3AF; font-size: 0.85rem; text-align: center;">{subscriptions.description}</p>
        <ul style="list-style: none; padding: 0; margin: 16px 0; flex-grow: 1;">
          {{{ each subscriptions.features }}}
          <li style="padding: 4px 0; color: #d1d5db; font-size: 0.85rem;">
            <i class="fa fa-check me-2" style="color: {subscriptions.color};"></i>
            {subscriptions.features.@value}
          </li>
          {{{ end }}}
        </ul>
        <button class="btn btn-primary w-100 purchase-btn" data-item-id="{subscriptions.id}" style="background: {subscriptions.color} !important; border-color: {subscriptions.color} !important;">
          <i class="fa fa-shopping-cart me-1"></i> SUBSCRIBE NOW
        </button>
      </div>
    </div>
    {{{ end }}}
  </div>

  <!-- Bundle Packages -->
  <div class="section-header" style="font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #F59E0B; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin: 32px 0 16px 0; font-size: 1.1rem;">
    <i class="fa fa-gift me-2"></i>BUNDLE PACKAGES
  </div>

  <div class="row g-3 mb-4">
    {{{ each packages }}}
    <div class="col-lg-3 col-md-6">
      <div class="frp-store-item" style="border-top: 3px solid {packages.color};">
        <div class="text-center mb-2">
          <i class="fa {packages.icon}" style="font-size: 1.5rem; color: {packages.color};"></i>
          <h4 style="font-family: 'Barlow Condensed', sans-serif; color: #f3f4f6; margin: 8px 0 4px 0; font-size: 1rem;">
            {packages.name}
          </h4>
          <div class="price" style="font-size: 1.3rem;">
            <span class="currency">€</span>{packages.price}
          </div>
          {{{ if packages.savings }}}
          <span style="font-size: 0.75rem; color: #22C55E;">Save {packages.savings}</span>
          {{{ end }}}
        </div>
        <p style="color: #9CA3AF; font-size: 0.8rem; text-align: center;">{packages.description}</p>
        <button class="btn btn-primary btn-sm w-100 purchase-btn" data-item-id="{packages.id}">
          <i class="fa fa-shopping-cart me-1"></i> BUY NOW
        </button>
      </div>
    </div>
    {{{ end }}}
  </div>

  <!-- Individual Items -->
  <div class="section-header" style="font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #F59E0B; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin: 32px 0 16px 0; font-size: 1.1rem;">
    <i class="fa fa-list me-2"></i>INDIVIDUAL ITEMS
  </div>

  <!-- Category Filter -->
  <div class="mb-3">
    <button class="btn btn-sm btn-outline-primary me-1 mb-1 category-filter active" data-category="all">All</button>
    {{{ each categories }}}
    <button class="btn btn-sm btn-outline-primary me-1 mb-1 category-filter" data-category="{categories.@value}" style="text-transform: capitalize;">
      {categories.@value}
    </button>
    {{{ end }}}
  </div>

  <div class="row g-3" id="items-grid">
    {{{ each items }}}
    <div class="col-lg-3 col-md-4 col-sm-6 item-card" data-category="{items.category}">
      <div class="frp-store-item" style="height: 100%; display: flex; flex-direction: column;">
        <div class="d-flex align-items-center mb-2">
          <i class="fa {items.icon} me-2" style="color: #F59E0B; font-size: 1.2rem;"></i>
          <h5 style="font-family: 'Barlow Condensed', sans-serif; color: #f3f4f6; margin: 0; font-size: 0.95rem;">
            {items.name}
          </h5>
        </div>
        <p style="color: #9CA3AF; font-size: 0.8rem; flex-grow: 1;">{items.description}</p>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="price" style="font-size: 1.1rem;">
            <span class="currency">€</span>{items.price}
          </span>
          <button class="btn btn-primary btn-sm purchase-btn" data-item-id="{items.id}">
            <i class="fa fa-shopping-cart"></i> Buy
          </button>
        </div>
      </div>
    </div>
    {{{ end }}}
  </div>

  <!-- Payment Methods -->
  <div class="text-center mt-4 pt-4" style="border-top: 1px solid #1e1e24;">
    <p style="color: #6B7280; font-size: 0.85rem;">
      <i class="fa fa-lock me-1"></i> Secure payments powered by
      <strong style="color: #635BFF;">Stripe</strong> &amp;
      <strong style="color: #003087;">PayPal</strong>
    </p>
    <p style="color: #4B5563; font-size: 0.75rem;">
      All donations are non-refundable. By purchasing, you agree to our Terms of Service.
    </p>
  </div>
</div>

<!-- Payment Modal -->
<div class="modal fade" id="paymentModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content" style="background: #111114; border: 1px solid #1e1e24;">
      <div class="modal-header" style="border-bottom: 1px solid #1e1e24;">
        <h5 class="modal-title" style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B;">CHOOSE PAYMENT METHOD</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body text-center">
        <p id="modal-item-name" style="color: #e5e7eb; font-size: 1.1rem;"></p>
        <p id="modal-item-price" style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; font-size: 1.5rem;"></p>
        <div class="d-grid gap-2 mt-3">
          <button class="btn btn-lg" id="pay-stripe" style="background: #635BFF; color: #fff; font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: 1px;">
            <i class="fa fa-credit-card me-2"></i>Pay with Card (Stripe)
          </button>
          <button class="btn btn-lg" id="pay-paypal" style="background: #003087; color: #fff; font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: 1px;">
            <i class="fa fa-paypal me-2"></i>Pay with PayPal
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
