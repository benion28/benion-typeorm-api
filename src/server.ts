// src/server.ts
import app from "./app";
import { AppDataSource } from "@/config/database";
import { env, validateEnv } from "@/config/env";

async function bootstrap() {
  try {
    // Validate environment variables
    validateEnv();

    // Initialize database connection
    await AppDataSource.initialize();
    console.log("📦 Database connected");

    // Start server
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
}

bootstrap();
