#!/bin/sh
set -e

echo "🚀 Starting application entrypoint..."

# Wait a bit for database to be ready (simple approach)
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run Prisma migrations (Prisma will retry if database isn't ready yet)
echo "🔄 Running Prisma migrations..."
if npx prisma migrate deploy; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migration failed or no pending migrations"
    echo "   Continuing anyway..."
fi

# Run seeders (optional - only if SEED_DATABASE is set to true)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "🌱 Running database seeders..."
    if npm run db:seed; then
        echo "✅ Seeding completed successfully"
    else
        echo "⚠️  Seeding failed or data already exists"
    fi
else
    echo "⏭️  Skipping database seeding (SEED_DATABASE not set to true)"
fi

# Start the application
echo "🎯 Starting Node.js application..."
exec node dist/server.js
