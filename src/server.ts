// src/server.ts
import app from "./app";
import { prisma } from "@/lib/prisma";
import { envConfig, validateEnv } from "@/config/env";

const env = envConfig;

const bootstrap = async () => {
  try {
    // Validate environment variables
    validateEnv();

    // Test database connection
    await prisma.$connect();
    console.log("📦 Database connected with Prisma");

    // Start server - bind to 0.0.0.0 for Docker/Render
    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
