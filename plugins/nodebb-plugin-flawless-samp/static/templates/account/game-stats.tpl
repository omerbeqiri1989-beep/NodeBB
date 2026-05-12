<!-- Flawless Roleplay — Game Stats Profile Tab -->
<!-- IMPORT partials/breadcrumbs.tpl -->

<div class="account-page game-stats-page" style="max-width: 900px; margin: 0 auto;">
  <!-- Profile Header -->
  <div class="d-flex align-items-center mb-4 p-3" style="background: linear-gradient(135deg, #111114 0%, #1a1a1f 100%); border: 1px solid #1e1e24; border-radius: 8px;">
    <div class="me-3">
      <i class="fa fa-gamepad" style="font-size: 2rem; color: #F59E0B;"></i>
    </div>
    <div>
      <h2 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
        IN-GAME PROFILE
      </h2>
      <p style="color: #9CA3AF; margin: 0; font-size: 0.9rem;">
        {{{ if playerName }}}
        Character: <strong style="color: #e5e7eb;">{playerName}</strong>
        {{{ else }}}
        No character linked to this account
        {{{ end }}}
      </p>
    </div>
  </div>

  {{{ if gameData }}}
  <!-- Main Stats Grid -->
  <div class="row g-3 mb-4">
    <!-- Level -->
    <div class="col-md-3 col-6">
      <div class="frp-game-stats" style="text-align: center; padding: 16px;">
        <div class="stat-label">Level</div>
        <div class="stat-value" style="font-size: 1.8rem; color: #F59E0B;">{gameData.level}</div>
      </div>
    </div>
    <!-- Faction -->
    <div class="col-md-3 col-6">
      <div class="frp-game-stats" style="text-align: center; padding: 16px; border-left: 3px solid {gameData.factionColor};">
        <div class="stat-label">Faction</div>
        <div class="stat-value" style="color: {gameData.factionColor};">{gameData.factionName}</div>
        {{{ if gameData.factionRank }}}
        <div style="font-size: 0.75rem; color: #6B7280;">Rank {gameData.factionRank}</div>
        {{{ end }}}
      </div>
    </div>
    <!-- Gang -->
    <div class="col-md-3 col-6">
      <div class="frp-game-stats" style="text-align: center; padding: 16px; border-left: 3px solid {gameData.gangColor};">
        <div class="stat-label">Gang</div>
        <div class="stat-value" style="color: {gameData.gangColor};">{gameData.gangName}</div>
      </div>
    </div>
    <!-- K/D Ratio -->
    <div class="col-md-3 col-6">
      <div class="frp-game-stats" style="text-align: center; padding: 16px;">
        <div class="stat-label">K/D Ratio</div>
        <div class="stat-value">{gameData.kd}</div>
        <div style="font-size: 0.75rem; color: #6B7280;">{gameData.kills}K / {gameData.deaths}D</div>
      </div>
    </div>
  </div>

  <!-- Wealth & Time -->
  <div class="row g-3 mb-4">
    <div class="col-md-4">
      <div class="frp-game-stats" style="padding: 16px;">
        <div class="stat-label">Cash</div>
        <div class="stat-value" style="color: #22C55E;">${gameData.cash}</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="frp-game-stats" style="padding: 16px;">
        <div class="stat-label">Bank</div>
        <div class="stat-value" style="color: #22C55E;">${gameData.bank}</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="frp-game-stats" style="padding: 16px;">
        <div class="stat-label">Total Wealth</div>
        <div class="stat-value" style="color: #F59E0B; font-size: 1.2rem;">${gameData.totalWealth}</div>
      </div>
    </div>
  </div>

  <!-- Play Time & Donator -->
  <div class="row g-3 mb-4">
    <div class="col-md-6">
      <div class="frp-game-stats" style="padding: 16px;">
        <div class="stat-label">Play Time</div>
        <div class="stat-value">{gameData.playTimeHours} hours</div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="frp-game-stats" style="padding: 16px;">
        <div class="stat-label">Donator Rank</div>
        <div class="stat-value">
          {{{ if gameData.donateRank }}}
          <span class="badge {{{ if gameData.donateRank === 1 }}}badge-vip-daisy{{{ else if gameData.donateRank === 2 }}}badge-vip-rose{{{ else }}}badge-vip-ivy{{{ end }}}">{gameData.donateRankName}</span>
          {{{ else }}}
          <span style="color: #6B7280;">None</span>
          {{{ end }}}
        </div>
      </div>
    </div>
  </div>

  <!-- Skills -->
  <div class="frp-game-stats mb-4" style="padding: 16px;">
    <h4 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin-bottom: 16px; font-size: 0.95rem;">
      <i class="fa fa-bar-chart me-2"></i>SKILLS
    </h4>
    <div class="row g-2">
      <div class="col-md-3 col-6">
        <div class="d-flex justify-content-between" style="font-size: 0.85rem;">
          <span style="color: #9CA3AF;">Boxing</span>
          <span style="color: #e5e7eb; font-family: 'JetBrains Mono', monospace;">{gameData.boxingSkill}</span>
        </div>
        <div class="progress" style="height: 4px; background: #1e1e24; border-radius: 2px;">
          <div class="progress-bar" style="width: {gameData.boxingSkill}%; background: #F59E0B;"></div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex justify-content-between" style="font-size: 0.85rem;">
          <span style="color: #9CA3AF;">Pistol</span>
          <span style="color: #e5e7eb; font-family: 'JetBrains Mono', monospace;">{gameData.pistolSkill}</span>
        </div>
        <div class="progress" style="height: 4px; background: #1e1e24; border-radius: 2px;">
          <div class="progress-bar" style="width: {gameData.pistolSkill}%; background: #3B82F6;"></div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex justify-content-between" style="font-size: 0.85rem;">
          <span style="color: #9CA3AF;">SMG</span>
          <span style="color: #e5e7eb; font-family: 'JetBrains Mono', monospace;">{gameData.smgSkill}</span>
        </div>
        <div class="progress" style="height: 4px; background: #1e1e24; border-radius: 2px;">
          <div class="progress-bar" style="width: {gameData.smgSkill}%; background: #EF4444;"></div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex justify-content-between" style="font-size: 0.85rem;">
          <span style="color: #9CA3AF;">Shotgun</span>
          <span style="color: #e5e7eb; font-family: 'JetBrains Mono', monospace;">{gameData.shotgunSkill}</span>
        </div>
        <div class="progress" style="height: 4px; background: #1e1e24; border-radius: 2px;">
          <div class="progress-bar" style="width: {gameData.shotgunSkill}%; background: #22C55E;"></div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex justify-content-between" style="font-size: 0.85rem;">
          <span style="color: #9CA3AF;">AK-47</span>
          <span style="color: #e5e7eb; font-family: 'JetBrains Mono', monospace;">{gameData.ak47Skill}</span>
        </div>
        <div class="progress" style="height: 4px; background: #1e1e24; border-radius: 2px;">
          <div class="progress-bar" style="width: {gameData.ak47Skill}%; background: #DC2626;"></div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex justify-content-between" style="font-size: 0.85rem;">
          <span style="color: #9CA3AF;">M4</span>
          <span style="color: #e5e7eb; font-family: 'JetBrains Mono', monospace;">{gameData.m4Skill}</span>
        </div>
        <div class="progress" style="height: 4px; background: #1e1e24; border-radius: 2px;">
          <div class="progress-bar" style="width: {gameData.m4Skill}%; background: #7C3AED;"></div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex justify-content-between" style="font-size: 0.85rem;">
          <span style="color: #9CA3AF;">Sniper</span>
          <span style="color: #e5e7eb; font-family: 'JetBrains Mono', monospace;">{gameData.sniperSkill}</span>
        </div>
        <div class="progress" style="height: 4px; background: #1e1e24; border-radius: 2px;">
          <div class="progress-bar" style="width: {gameData.sniperSkill}%; background: #06B6D4;"></div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex justify-content-between" style="font-size: 0.85rem;">
          <span style="color: #9CA3AF;">Fishing</span>
          <span style="color: #e5e7eb; font-family: 'JetBrains Mono', monospace;">{gameData.fishingSkill}</span>
        </div>
        <div class="progress" style="height: 4px; background: #1e1e24; border-radius: 2px;">
          <div class="progress-bar" style="width: {gameData.fishingSkill}%; background: #059669;"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Licenses -->
  <div class="frp-game-stats mb-4" style="padding: 16px;">
    <h4 style="font-family: 'Barlow Condensed', sans-serif; color: #F59E0B; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin-bottom: 16px; font-size: 0.95rem;">
      <i class="fa fa-id-card me-2"></i>LICENSES
    </h4>
    <div class="d-flex flex-wrap gap-2">
      <span class="badge" style="background: {{{ if gameData.carLicense }}}rgba(34, 197, 94, 0.15); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3){{{ else }}}rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3){{{ end }}}; padding: 6px 12px;">
        <i class="fa fa-car me-1"></i> Car License
      </span>
      <span class="badge" style="background: {{{ if gameData.flyLicense }}}rgba(34, 197, 94, 0.15); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3){{{ else }}}rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3){{{ end }}}; padding: 6px 12px;">
        <i class="fa fa-plane me-1"></i> Fly License
      </span>
      <span class="badge" style="background: {{{ if gameData.boatLicense }}}rgba(34, 197, 94, 0.15); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3){{{ else }}}rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3){{{ end }}}; padding: 6px 12px;">
        <i class="fa fa-ship me-1"></i> Boat License
      </span>
      <span class="badge" style="background: {{{ if gameData.fishLicense }}}rgba(34, 197, 94, 0.15); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3){{{ else }}}rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3){{{ end }}}; padding: 6px 12px;">
        <i class="fa fa-anchor me-1"></i> Fish License
      </span>
      <span class="badge" style="background: {{{ if gameData.gunLicense }}}rgba(34, 197, 94, 0.15); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3){{{ else }}}rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3){{{ end }}}; padding: 6px 12px;">
        <i class="fa fa-crosshairs me-1"></i> Gun License
      </span>
    </div>
  </div>

  {{{ else }}}
  <!-- No Game Data -->
  <div class="text-center" style="padding: 60px 20px;">
    <i class="fa fa-gamepad" style="font-size: 3rem; color: #2a2a32; margin-bottom: 16px;"></i>
    <h3 style="color: #6B7280; font-family: 'Barlow Condensed', sans-serif;">NO GAME DATA AVAILABLE</h3>
    <p style="color: #4B5563; font-size: 0.9rem;">
      {{{ if playerName }}}
      Character <strong>{playerName}</strong> was not found in the server files.
      {{{ else }}}
      This account is not linked to any in-game character.
      {{{ end }}}
    </p>
  </div>
  {{{ end }}}
</div>
