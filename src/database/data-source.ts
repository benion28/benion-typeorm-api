// src/database/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "../modules/user/user.entity";
import { Product } from "../modules/product/product.entity";

dotenv.config();

const dbEngine = (process.env.DB_ENGINE || "mysql") as "mysql" | "postgres";

// This DataSource is used for running migrations via CLI
export const MigrationDataSource = new DataSource({
  type: dbEngine,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== "production", // Only in development
  logging: process.env.NODE_ENV !== "production", // Only in development
  entities: [User, Product],
  migrations: ["src/database/migrations/*.ts"],
  migrationsTableName: "migrations",
});
