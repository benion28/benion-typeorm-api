// src/config/database.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/modules/user/user.entity";
import { Product } from "@/modules/product/product.entity";

export const AppDataSource = new DataSource({
  type: "postgres", // or "mysql"
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // ❌ disable in production
  logging: false,
  entities: [User, Product],
  migrations: ["src/database/migrations/*.ts"],
});
