// database/seed.ts
import "reflect-metadata";
import { MigrationDataSource } from "./data-source";
import { runSeeders } from "./seeders";

async function seed() {
  try {
    console.log("📦 Initializing database connection...");
    await MigrationDataSource.initialize();
    console.log("✅ Database connected");

    await runSeeders(MigrationDataSource);

    await MigrationDataSource.destroy();
    console.log("👋 Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
