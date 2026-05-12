<!-- Flawless Roleplay — Custom Header Partial -->
<nav class="navbar navbar-expand-lg" style="background: #111114 !important; border-bottom: 1px solid #1e1e24; box-shadow: 0 1px 3px rgba(0,0,0,0.5);">
  <div class="container">
    <a class="navbar-brand" href="{config.relative_path}/" style="font-family: 'Barlow Condensed', sans-serif; font-weight: 700; color: #F59E0B !important; text-transform: uppercase; letter-spacing: 2px; font-size: 1.3rem;">
      {{{ if config.brand:logo }}}
      <img src="{config.brand:logo}" alt="Flawless RP" style="height: 32px; margin-right: 8px;" />
      {{{ end }}}
      FLAWLESS ROLEPLAY
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style="border-color: #1e1e24;">
      <span class="navbar-toggler-icon" style="filter: invert(1);"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="{config.relative_path}/" style="color: #9CA3AF; font-weight: 500;">
            <i class="fa fa-home me-1"></i> Forums
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="{config.relative_path}/recent" style="color: #9CA3AF; font-weight: 500;">
            <i class="fa fa-clock-o me-1"></i> Recent
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="{config.relative_path}/store" style="color: #F59E0B; font-weight: 600;">
            <i class="fa fa-shopping-cart me-1"></i> Store
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="{config.relative_path}/rules" style="color: #9CA3AF; font-weight: 500;">
            <i class="fa fa-gavel me-1"></i> Rules
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="{config.relative_path}/connect" style="color: #9CA3AF; font-weight: 500;">
            <i class="fa fa-gamepad me-1"></i> Connect
          </a>
        </li>
      </ul>

      <ul class="navbar-nav">
        <!-- Search -->
        <li class="nav-item">
          <a class="nav-link" href="{config.relative_path}/search" style="color: #9CA3AF;">
            <i class="fa fa-search"></i>
          </a>
        </li>

        {{{ if config.loggedIn }}}
        <!-- Notifications -->
        <li class="nav-item">
          <a class="nav-link position-relative" href="{config.relative_path}/notifications" style="color: #9CA3AF;">
            <i class="fa fa-bell"></i>
            <span component="notifications/icon" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background: #EF4444; font-size: 0.6rem; display: none;">
              <span component="notifications/count"></span>
            </span>
          </a>
        </li>

        <!-- Chat -->
        <li class="nav-item">
          <a class="nav-link position-relative" href="{config.relative_path}/chats" style="color: #9CA3AF;">
            <i class="fa fa-comments"></i>
            <span component="chat/icon" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background: #F59E0B; font-size: 0.6rem; display: none;">
              <span component="chat/count"></span>
            </span>
          </a>
        </li>

        <!-- User Menu -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" style="color: #e5e7eb;">
            <img component="user/picture" src="{user.picture}" class="rounded-circle me-1" style="width: 28px; height: 28px; border: 1px solid #1e1e24;" alt="{user.username}" />
            <span class="d-none d-md-inline">{user.username}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" style="background: #111114; border: 1px solid #1e1e24;">
            <li><a class="dropdown-item" href="{config.relative_path}/user/{user.userslug}" style="color: #e5e7eb;"><i class="fa fa-user me-2"></i> Profile</a></li>
            <li><a class="dropdown-item" href="{config.relative_path}/user/{user.userslug}/settings" style="color: #e5e7eb;"><i class="fa fa-cog me-2"></i> Settings</a></li>
            {{{ if isAdmin }}}
            <li><hr class="dropdown-divider" style="border-color: #1e1e24;"></li>
            <li><a class="dropdown-item" href="{config.relative_path}/admin" style="color: #EF4444;"><i class="fa fa-shield me-2"></i> Admin Panel</a></li>
            {{{ end }}}
            <li><hr class="dropdown-divider" style="border-color: #1e1e24;"></li>
            <li><a class="dropdown-item" component="user/logout" href="#" style="color: #EF4444;"><i class="fa fa-sign-out me-2"></i> Logout</a></li>
          </ul>
        </li>
        {{{ else }}}
        <!-- Login / Register -->
        <li class="nav-item">
          <a class="nav-link" href="{config.relative_path}/login" style="color: #9CA3AF;">
            <i class="fa fa-sign-in me-1"></i> Login
          </a>
        </li>
        <li class="nav-item">
          <a class="btn btn-sm ms-2" href="{config.relative_path}/register" style="background: #F59E0B; color: #000; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            Register
          </a>
        </li>
        {{{ end }}}
      </ul>
    </div>
  </div>
</nav>
