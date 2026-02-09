// database/seeders/index.ts
import { DataSource } from "typeorm";
import { seedUsers } from "./user.seeder";
import { seedProducts } from "./product.seeder";

export async function runSeeders(dataSource: DataSource): Promise<void> {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed users first
    const users = await seedUsers(dataSource);

    // Seed products (depends on users)
    await seedProducts(dataSource, users);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
