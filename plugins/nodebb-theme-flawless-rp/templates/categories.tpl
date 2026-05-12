<!-- Flawless Roleplay — Categories Template with Recent Threads -->
<div class="categories-page" data-widget-area="header">
  {{{ each widgets.header }}}
  {{widgets.header.html}}
  {{{ end }}}
</div>

<!-- IMPORT partials/breadcrumbs.tpl -->

<div class="row">
  <div class="col-lg-9 col-md-8" data-widget-area="main">
    {{{ each categories }}}
    {{{ if !categories.isSection }}}
    <div class="category-item" data-cid="{categories.cid}" style="background: var(--frp-surface); border: 1px solid var(--frp-border); border-left: 3px solid {categories.bgColor}; border-radius: 4px; margin-bottom: 8px; padding: 16px; transition: all 0.2s ease;">
      <div class="d-flex align-items-start">
        <div class="category-icon me-3" style="font-size: 1.5rem; color: {categories.bgColor}; min-width: 40px; text-align: center;">
          <i class="fa {categories.icon}"></i>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h3 style="margin: 0 0 4px 0; font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem;">
                <a href="{config.relative_path}/category/{categories.slug}" style="color: #f3f4f6; text-decoration: none;">{categories.name}</a>
              </h3>
              {{{ if categories.description }}}
              <p style="color: #9CA3AF; font-size: 0.85rem; margin: 0 0 8px 0;">{categories.description}</p>
              {{{ end }}}
            </div>
            <div class="category-stats text-end" style="min-width: 120px;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #6B7280;">
                <span style="color: #F59E0B;">{categories.topic_count}</span> threads
              </div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #6B7280;">
                <span style="color: #F59E0B;">{categories.post_count}</span> posts
              </div>
            </div>
          </div>
          <!-- Recent Topic Teaser -->
          {{{ if categories.teaser }}}
          <div class="recent-topic d-flex align-items-center mt-2 pt-2" style="border-top: 1px solid var(--frp-border);">
            <a href="{config.relative_path}/user/{categories.teaser.user.userslug}">
              <img src="{categories.teaser.user.picture}" class="avatar-sm rounded-circle me-2" style="width: 24px; height: 24px; border: 1px solid var(--frp-border);" alt="{categories.teaser.user.username}" />
            </a>
            <div style="overflow: hidden;">
              <a href="{config.relative_path}/topic/{categories.teaser.topic.slug}" style="color: #d1d5db; font-size: 0.85rem; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">{categories.teaser.topic.title}</a>
              <span style="font-size: 0.75rem; color: #6B7280;">
                by <a href="{config.relative_path}/user/{categories.teaser.user.userslug}" style="color: #9CA3AF;">{categories.teaser.user.username}</a>
                &middot; <span class="timeago" title="{categories.teaser.timestampISO}"></span>
              </span>
            </div>
          </div>
          {{{ end }}}
          <!-- Subcategories -->
          {{{ if categories.children.length }}}
          <div class="subcategories mt-2 pt-2" style="border-top: 1px solid var(--frp-border);">
            {{{ each categories.children }}}
            <a href="{config.relative_path}/category/{categories.children.slug}" class="badge me-1 mb-1" style="background: rgba(245, 158, 11, 0.1); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.2); font-size: 0.75rem; font-weight: 500; text-decoration: none;">
              <i class="fa {categories.children.icon} me-1"></i>{categories.children.name}
            </a>
            {{{ end }}}
          </div>
          {{{ end }}}
        </div>
      </div>
    </div>
    {{{ else }}}
    <!-- Section Header -->
    <div class="section-header" style="font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #F59E0B; border-bottom: 2px solid #F59E0B; padding: 12px 0 8px 0; margin: 24px 0 12px 0; font-size: 1.1rem;">
      <i class="fa {categories.icon} me-2"></i>{categories.name}
    </div>
    {{{ end }}}
    {{{ end }}}
  </div>

  <div class="col-lg-3 col-md-4" data-widget-area="sidebar">
    {{{ each widgets.sidebar }}}
    {{widgets.sidebar.html}}
    {{{ end }}}
  </div>
</div>

<div data-widget-area="footer">
  {{{ each widgets.footer }}}
  {{widgets.footer.html}}
  {{{ end }}}
</div>
