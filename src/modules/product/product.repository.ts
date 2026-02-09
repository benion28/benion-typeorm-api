// modules/product/product.repository.ts
import { AppDataSource } from "@/config/database";
import { Product } from "./product.entity";

export const ProductRepository =
  AppDataSource.getRepository(Product);
