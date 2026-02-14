# ---------------------
# Dependencies stage
# ---------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy yarn configuration files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies using Yarn 3
RUN corepack enable && yarn install

# ---------------------
# Build stage
# ---------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy source code first
COPY . .

# Then overlay node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the updated yarn.lock from deps (in case it was modified)
COPY --from=deps /app/yarn.lock ./yarn.lock

ENV NEXT_TELEMETRY_DISABLED=1

# Build-time env vars (NEXT_PUBLIC_* must be available at build time)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN corepack enable && yarn build

# ---------------------
# Production stage
# ---------------------
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files for standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
