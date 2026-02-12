# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy schema switching script and Prisma schemas
COPY scripts ./scripts
COPY prisma ./prisma

# Set default DB_ENGINE to postgres for production (Render uses PostgreSQL)
ENV DB_ENGINE=postgres

# Generate schema.prisma from source schemas based on DB_ENGINE
RUN node scripts/switch-schema.js || echo "Schema switch failed, using existing schema"

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage - Use Debian for better Prisma compatibility
FROM node:20-slim

# Install dumb-init and OpenSSL for Prisma
RUN apt-get update && apt-get install -y \
    dumb-init \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Install tsx for running TypeScript seed files
RUN npm install tsx

# Copy schema switching script and Prisma schemas
COPY scripts ./scripts
COPY prisma ./prisma

# Set default DB_ENGINE to postgres for production (Render uses PostgreSQL)
ENV DB_ENGINE=postgres

# Generate schema.prisma from source schemas based on DB_ENGINE
RUN node scripts/switch-schema.js || echo "Schema switch failed, using existing schema"

# Generate Prisma Client
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

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
