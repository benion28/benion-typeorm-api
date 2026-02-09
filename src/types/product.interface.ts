// types/product.interface.ts
import { IUserResponse } from "./user.interface";

export interface IProduct {
  id: string;
  creator_id: string;
  title: string;
  price: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IProductResponse {
  id: string;
  creator_id: string;
  title: string;
  price: number;
  creator?: IUserResponse;
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
