# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Install tsc-alias for path resolution
RUN npm install --save-dev tsc-alias

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install only production dependencies
RUN npm ci --only=production

# Install TypeScript tooling needed for migrations and path aliases
RUN npm install --save ts-node tsconfig-paths typescript tsc-alias @types/node

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy source files needed for migrations and seeding
COPY --from=builder /app/src/database ./src/database
COPY --from=builder /app/src/modules ./src/modules
COPY --from=builder /app/src/common ./src/common
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/src/types ./src/types

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run entrypoint script
CMD ["./docker-entrypoint.sh"]
