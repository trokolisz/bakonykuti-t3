# Use Bun as the base image
FROM oven/bun:1 AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json ./
# Check if bun.lockb exists and copy it if it does
COPY bun.lockb* ./
# Install dependencies - don't use frozen-lockfile to avoid errors
RUN bun install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV SKIP_ENV_VALIDATION=1
ENV NODE_ENV=production

# Build the application in standalone mode
RUN bun run build:standalone

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the correct permission for prerender cache
RUN mkdir -p .next/cache
RUN chown -R nextjs:nodejs .next

# Expose the port the app will run on
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application in standalone mode
CMD ["node", "server.js"]
