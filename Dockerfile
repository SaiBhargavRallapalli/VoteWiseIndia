FROM node:20.19.4-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install production deps first for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source, owned by the non-root user
COPY --chown=node:node . .

EXPOSE 8080
USER node

# Minimal health check — Cloud Run also watches the HTTP port
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "server.js"]