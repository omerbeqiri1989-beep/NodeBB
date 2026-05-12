<!-- Flawless Roleplay — Admin Donation Management -->
<div class="acp-page-container">
  <div class="row">
    <div class="col-12">
      <h2 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B;">
        <i class="fa fa-shopping-cart me-2"></i>DONATION MANAGEMENT
      </h2>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card" style="background: #111114; border: 1px solid #1e1e24;">
            <div class="card-body text-center">
              <div style="font-size: 0.8rem; color: #6B7280; text-transform: uppercase;">Total Revenue</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; color: #22C55E;">€{totalRevenue}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card" style="background: #111114; border: 1px solid #1e1e24;">
            <div class="card-body text-center">
              <div style="font-size: 0.8rem; color: #6B7280; text-transform: uppercase;">Stripe</div>
              <div style="font-size: 1rem; color: {{{ if stripeConfigured }}}#22C55E{{{ else }}}#EF4444{{{ end }}};">
                {{{ if stripeConfigured }}}Configured{{{ else }}}Not Configured{{{ end }}}
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card" style="background: #111114; border: 1px solid #1e1e24;">
            <div class="card-body text-center">
              <div style="font-size: 0.8rem; color: #6B7280; text-transform: uppercase;">PayPal</div>
              <div style="font-size: 1rem; color: {{{ if paypalConfigured }}}#22C55E{{{ else }}}#EF4444{{{ end }}};">
                {{{ if paypalConfigured }}}Configured{{{ else }}}Not Configured{{{ end }}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Donations Table -->
      <div class="card" style="background: #111114; border: 1px solid #1e1e24;">
        <div class="card-header" style="background: #18181c; border-bottom: 1px solid #1e1e24;">
          <h5 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; margin: 0;">RECENT DONATIONS</h5>
        </div>
        <div class="card-body p-0">
          <table class="table table-dark mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Provider</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {{{ each donations }}}
              <tr>
                <td><span class="timeago" title="{donations.completedAt}"></span></td>
                <td>UID: {donations.uid}</td>
                <td>{donations.itemName}</td>
                <td style="color: #22C55E;">€{donations.amount}</td>
                <td>{donations.provider}</td>
                <td>
                  <span class="badge" style="background: #22C55E;">{donations.status}</span>
                </td>
              </tr>
              {{{ end }}}
              {{{ if !donations.length }}}
              <tr>
                <td colspan="6" class="text-center" style="color: #6B7280; padding: 24px;">No donations yet</td>
              </tr>
              {{{ end }}}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
