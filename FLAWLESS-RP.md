# Flawless Roleplay — NodeBB Community Forum

A fully customized **NodeBB v4** forum for the Flawless Roleplay SA-MP server, featuring a dark "Underground Criminal Empire" theme, SSO integration with the UCP, a donation store with Stripe/PayPal, and real-time SA-MP gamemode data synchronization.

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Nginx Proxy    │────▶│  NodeBB Forum   │────▶│   MongoDB    │
│ (SSL Termination)│     │  :4567          │     │   :27017     │
└────────┬────────┘     └────────┬────────┘     └──────────────┘
         │                       │
         │              ┌────────┴────────┐     ┌──────────────┐
         │              │  Redis Cache    │     │  SA-MP Server │
         │              │  :6379          │     │  :7777        │
         │              └─────────────────┘     └──────┬───────┘
         │                                             │
         ▼                                             │
┌─────────────────┐                           ┌────────┴───────┐
│  UCP (React)    │◀──── JWT SSO Cookie ─────▶│  /scriptfiles  │
│  :3000          │                           │  (INI Files)   │
└─────────────────┘                           └────────────────┘
```

---

## Components

### Custom Theme: `nodebb-theme-flawless-rp`

The "Underground Criminal Empire" visual identity built for SA-MP RP communities.

| Feature | Description |
|---------|-------------|
| **Color Palette** | Jet Black (#0A0A0C), Gunmetal (#111114), Amber (#F59E0B) |
| **Typography** | Barlow Condensed (headings), Inter (body), JetBrains Mono (data) |
| **Layout** | Custom header with server status, recent threads on categories page |
| **Responsive** | Full mobile support with collapsible navigation |

### Plugin: `nodebb-plugin-sso-flawless`

Bridges authentication between the UCP and the forum using shared JWT cookies.

- Reads `flawless_token` cookie set by the UCP
- Validates JWT with shared `JWT_SECRET`
- Auto-creates forum accounts on first login
- Links forum UID to SA-MP player name
- Shared session across `ucp.flawlessrp.com` and `forum.flawlessrp.com`

### Plugin: `nodebb-plugin-flawless-donations`

Full donation store with Stripe and PayPal integration.

| Tier | Price | Features |
|------|-------|----------|
| Daisy VIP | €4.99/mo | Custom tag, 2 extra homes, VIP chat |
| Rose VIP | €9.99/mo | All Daisy + priority support, 5 homes, custom plate |
| Ivy VIP | €19.99/mo | All Rose + exclusive vehicles, 10 homes, name change |

Also includes one-time items (name changes, extra homes, custom plates) and bundle packages.

### Plugin: `nodebb-plugin-flawless-samp`

Real-time SA-MP gamemode integration.

- **INI File Parser**: Reads SA-MP `scriptfiles/Users/*.ini` files
- **Profile Enhancement**: Shows in-game stats (level, faction, gang, K/D, wealth) on forum profiles
- **Auto-Group Sync**: Assigns forum groups based on faction, gang, admin level, and donator rank
- **Server Status**: UDP query to display live player count
- **Periodic Sync**: Configurable interval (default 5 minutes) to update all linked players

---

## Directory Structure

```
NodeBB/
├── node_modules/
│   ├── nodebb-theme-flawless-rp/      # Custom theme
│   │   ├── package.json
│   │   ├── plugin.json
│   │   ├── library.js
│   │   ├── templates/
│   │   │   ├── categories.tpl
│   │   │   └── partials/header.tpl
│   │   └── static/
│   │       ├── styles/flawless.css
│   │       └── scripts/flawless.js
│   │
│   ├── nodebb-plugin-sso-flawless/    # SSO plugin
│   │   ├── package.json
│   │   ├── plugin.json
│   │   └── library.js
│   │
│   ├── nodebb-plugin-flawless-donations/  # Donation store
│   │   ├── package.json
│   │   ├── plugin.json
│   │   ├── library.js
│   │   ├── store-items.js
│   │   └── static/
│   │       ├── templates/
│   │       │   ├── store.tpl
│   │       │   ├── store-success.tpl
│   │       │   └── admin/donations.tpl
│   │       ├── lib/main.js
│   │       └── less/donations.less
│   │
│   └── nodebb-plugin-flawless-samp/   # SA-MP integration
│       ├── package.json
│       ├── plugin.json
│       ├── library.js
│       ├── ini-parser.js
│       └── static/
│           ├── templates/account/game-stats.tpl
│           ├── lib/game-stats.js
│           └── less/game-stats.less
│
├── scripts/
│   ├── setup-categories.js            # Creates 70+ forum categories
│   ├── setup-groups.js                # Creates all user groups
│   └── setup-widgets.js               # Widget HTML reference
│
├── deploy/
│   ├── docker-compose.yml             # Full stack deployment
│   ├── .env.example                   # Environment variable reference
│   ├── nodebb/
│   │   └── Dockerfile                 # NodeBB container build
│   └── nginx/
│       └── nginx.conf                 # Reverse proxy configuration
│
├── FLAWLESS-RP.md                     # This file
└── README.md                          # Original NodeBB README
```

---

## Deployment

### Prerequisites

- Docker and Docker Compose v2+
- Domain names configured: `forum.flawlessrp.com`, `ucp.flawlessrp.com`
- SSL certificates (use Let's Encrypt / Certbot)
- SA-MP server with `scriptfiles/` directory accessible

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/omerbeqiri1989-beep/NodeBB.git
cd NodeBB/deploy

# 2. Configure environment
cp .env.example .env
nano .env  # Fill in your values

# 3. Place SSL certificates
mkdir -p nginx/ssl
cp /path/to/fullchain.pem nginx/ssl/
cp /path/to/privkey.pem nginx/ssl/

# 4. Build and start
docker compose up -d --build

# 5. Run initial NodeBB setup
docker exec -it flawless-nodebb ./nodebb setup

# 6. Set up categories and groups
docker exec -it flawless-nodebb node scripts/setup-categories.js
docker exec -it flawless-nodebb node scripts/setup-groups.js

# 7. Activate theme and plugins via ACP
# Navigate to: https://forum.flawlessrp.com/admin
# Go to: Appearance > Themes > Select "Flawless RP"
# Go to: Extend > Plugins > Activate all flawless-* plugins
# Restart NodeBB after activation
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODEBB_URL` | Yes | Public URL of the forum |
| `NODEBB_SECRET` | Yes | NodeBB session secret |
| `MONGO_USER` | Yes | MongoDB username |
| `MONGO_PASS` | Yes | MongoDB password |
| `JWT_SECRET` | Yes | Shared JWT secret (same as UCP) |
| `STRIPE_SECRET_KEY` | No | Stripe API key for donations |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `PAYPAL_CLIENT_ID` | No | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | No | PayPal client secret |
| `SCRIPTFILES_PATH` | Yes | Path to SA-MP scriptfiles directory |
| `SAMP_SERVER_IP` | Yes | SA-MP server IP for status queries |
| `SAMP_SERVER_PORT` | No | SA-MP server port (default: 7777) |
| `COOKIE_DOMAIN` | Yes | Shared cookie domain (e.g., `.flawlessrp.com`) |

---

## Category Structure (70+ Categories)

The setup script creates the following hierarchy:

1. **Announcements & News** — Server updates, events, staff announcements
2. **Information Center** — Rules, guides, FAQ, connection guide
3. **Player Support** — Help, technical support, tutorials
4. **Ban Appeals** — Pending, accepted, denied
5. **Player Reports** — Pending, resolved, denied
6. **Staff Applications** — Open, accepted, denied
7. **Name Change Requests**
8. **Refund Requests**
9. **Law Enforcement** — LSPD, FBI, SASD, National Guard (each with roster, handbook, recruitment)
10. **Government & Services** — Government, SANEWS, ARES, Paramedics
11. **Illegal Factions** — Hitman Agency, faction applications
12. **Gang Zone** — All 6 gangs with roster, recruitment, media + unofficial gangs + turf wars
13. **In Character** — Chronicle, classifieds, character stories, court cases
14. **Out of Character** — General, introductions, suggestions, marketplace, media
15. **Other Games** — GTA V, CS, PC, console, mobile
16. **Archive** — Read-only archived content

---

## User Groups (Auto-Synced)

| Group Type | Groups |
|-----------|--------|
| **Admin** | Administrators, Moderators, Helpers |
| **Factions** | LSPD, FBI, SASD, ARES, SANEWS, Government, Hitman Agency, Paramedics, National Guard |
| **Gangs** | Ghetto Ghouls, Velvet Thugs, Baba Stars, Los Santos Rifa, Grove Street Families, La Cosa Nostra |
| **VIP** | Daisy VIP, Rose VIP, Ivy VIP |
| **Special** | Faction Leaders, Trusted Traders |

Groups are automatically assigned by the SA-MP integration plugin based on INI file data.

---

## API Endpoints

### SA-MP Integration

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flawless-samp/server-status` | Live server status |
| GET | `/api/flawless-samp/player/:name` | Player game stats |
| GET | `/api/flawless-samp/user/:uid/game-stats` | Game stats by forum UID |
| POST | `/api/flawless-samp/sync` | Trigger manual sync (admin) |

### Donation Store

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/store/items` | All store items |
| POST | `/api/donations/checkout/stripe` | Create Stripe checkout |
| POST | `/api/donations/checkout/paypal` | Create PayPal order |
| POST | `/api/donations/webhook/stripe` | Stripe webhook |
| POST | `/api/donations/webhook/paypal` | PayPal webhook |
| GET | `/api/donations/history` | User donation history |

### SSO

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/flawless` | SSO entry point |
| GET | `/api/auth/flawless/status` | Check SSO status |

---

## Post-Deployment Checklist

- [ ] SSL certificates installed and auto-renewing
- [ ] `.env` file configured with all required values
- [ ] NodeBB initial setup completed
- [ ] Theme activated in ACP
- [ ] All 3 plugins activated in ACP
- [ ] Categories created via `setup-categories.js`
- [ ] Groups created via `setup-groups.js`
- [ ] Widgets configured in ACP (use `setup-widgets.js` for HTML)
- [ ] Stripe webhook URL configured: `https://forum.flawlessrp.com/api/donations/webhook/stripe`
- [ ] PayPal webhook URL configured: `https://forum.flawlessrp.com/api/donations/webhook/paypal`
- [ ] SA-MP `scriptfiles/` directory mounted and accessible
- [ ] UCP JWT_SECRET matches forum JWT_SECRET
- [ ] Cookie domain set to `.flawlessrp.com`
- [ ] Firewall rules: only ports 80, 443, 7777 exposed

---

## License

Private — Flawless Roleplay. All rights reserved.
