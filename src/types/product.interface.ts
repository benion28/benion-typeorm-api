// types/product.interface.ts
import { Decimal } from "@prisma/client/runtime/library";
import { IUser } from "./user.interface";

export interface IProduct {
  id: string | null;
  creator_id: string | null;
  title: string | null;
  price: number | Decimal | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  deleted_at?: string | Date | null;
  creator?: IUser | null;
}

export interface IProductResponse {
  id: string;
  creator_id: string;
  title: string;
  price: number;
  creator?: IUser;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateProductDTO {
  title: string;
  price: number;
}

export interface IUpdateProductDTO {
  title?: string;
  price?: number;
}
