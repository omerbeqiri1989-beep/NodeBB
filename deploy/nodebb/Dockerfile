# ============================================================
# Flawless Roleplay — NodeBB Forum Dockerfile
# Builds NodeBB with custom theme and plugins pre-installed
# ============================================================

FROM node:22-alpine AS base

# Install build dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl

WORKDIR /opt/nodebb

# ---- Stage 1: Clone and install NodeBB ----
FROM base AS builder

# Clone NodeBB v4.x
RUN git clone -b v4.x --depth 1 https://github.com/NodeBB/NodeBB.git .

# Install NodeBB dependencies
RUN npm install --production

# Install required community plugins
RUN npm install \
    nodebb-plugin-markdown \
    nodebb-plugin-emoji \
    nodebb-plugin-spam-be-gone \
    nodebb-widget-essentials \
    jsonwebtoken \
    cookie-parser \
    stripe

# ---- Stage 2: Copy custom plugins and theme ----
FROM base AS runtime

COPY --from=builder /opt/nodebb /opt/nodebb

# Copy custom theme
COPY plugins/nodebb-theme-flawless-rp /opt/nodebb/node_modules/nodebb-theme-flawless-rp

# Copy custom plugins
COPY plugins/nodebb-plugin-sso-flawless /opt/nodebb/node_modules/nodebb-plugin-sso-flawless
COPY plugins/nodebb-plugin-flawless-donations /opt/nodebb/node_modules/nodebb-plugin-flawless-donations
COPY plugins/nodebb-plugin-flawless-samp /opt/nodebb/node_modules/nodebb-plugin-flawless-samp

# Copy setup scripts
COPY scripts /opt/nodebb/scripts

# Create necessary directories
RUN mkdir -p /opt/nodebb/public/uploads /opt/nodebb/logs /scriptfiles/Users

# Set permissions
RUN chown -R node:node /opt/nodebb

# Switch to non-root user
USER node

# Expose NodeBB port
EXPOSE 4567

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=5 --start-period=60s \
    CMD curl -f http://localhost:4567/api/config || exit 1

# Start NodeBB
CMD ["./nodebb", "start"]
