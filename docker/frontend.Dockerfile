# ---------------------
# Dependencies stage
# ---------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies using npm
RUN npm ci

# ---------------------
# Build stage
# ---------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy source code first, including .env from parent directory
# Since context is ./ (root), we can copy frontend and .env
COPY frontend ./
COPY .env ../.env

# Then overlay node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the updated package-lock.json from deps (in case it was modified)
COPY --from=deps /app/package-lock.json ./package-lock.json

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---------------------
# Production stage
# ---------------------
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs &&     adduser --system --uid 1001 nextjs

ENV NODE_ENV=production     NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files for standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000     HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
