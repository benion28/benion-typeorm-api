// src/server.ts
import app from "./app";
import { AppDataSource } from "@/config/database";
import { envConfig, validateEnv } from "@/config/env";

const env = envConfig;

const bootstrap = async () => {
  try {
    // Validate environment variables
    validateEnv();

    // Initialize database connection
    await AppDataSource.initialize();
    console.log("📦 Database connected");

    // Start server - bind to 0.0.0.0 for Docker/Render
    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
}

bootstrap();
