// src/config/database.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/modules/user/user.entity";
import { Product } from "@/modules/product/product.entity";
import { envConfig } from "./env";

const env = envConfig;

export const AppDataSource = new DataSource({
  type: env.DB_ENGINE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: env.NODE_ENV !== "production", // Only in development
  logging: env.NODE_ENV !== "production", // Only in development
  entities: [User, Product],
  migrations: ["dist/database/migrations/*.js"],
  migrationsTableName: "migrations",
});
