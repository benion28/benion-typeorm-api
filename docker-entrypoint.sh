#!/bin/sh
set -e

echo "🚀 Starting application entrypoint..."

# Function to wait for database
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if node -e "
            const dbConfig = {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            };
            
            const engine = process.env.DB_ENGINE || 'mysql';
            
            if (engine === 'mysql') {
                const mysql = require('mysql2/promise');
                mysql.createConnection(dbConfig)
                    .then(conn => { conn.end(); process.exit(0); })
                    .catch(() => process.exit(1));
            } else {
                const { Client } = require('pg');
                const client = new Client(dbConfig);
                client.connect()
                    .then(() => { client.end(); process.exit(0); })
                    .catch(() => process.exit(1));
            }
        " 2>/dev/null; then
            echo "✅ Database is ready!"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo "   Attempt $attempt/$max_attempts - Database not ready yet..."
        sleep 2
    done
    
    echo "❌ Database connection timeout after $max_attempts attempts"
    exit 1
}

# Wait for database to be ready
wait_for_db

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
if npx prisma migrate deploy; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migration failed or no pending migrations"
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
