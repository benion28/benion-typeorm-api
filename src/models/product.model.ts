import { IProduct, IUser } from "@/types";
import dateUtil from "@/utils/date";
import { UserModel } from "./user.model";

export class ProductModel implements IProduct {
  id: string | null;
  creator_id: string | null;
  title: string | null;
  price: number | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  deleted_at?: string | Date | null;
  creator?: IUser | null;

  constructor(data: Partial<IProduct>) {
    this.id = data.id ?? null;
    this.creator_id = data.creator_id ?? null;
    this.title = data.title ?? null;
    this.price = data.price ?? null;
    this.created_at = data.created_at ? new Date(data.created_at) : null;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : null;
    this.deleted_at = data.deleted_at ? new Date(data.deleted_at) : null;
  }

  static fromJSON(json: Partial<IProduct>): ProductModel {
    return new ProductModel(json);
  }

  static instance(): ProductModel {
    return new ProductModel({
      id: null,
      creator_id: null,
      title: null,
      price: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
    });
  }

  static toJSON(product: Partial<IProduct>): any {
    const { safeToISOString } = dateUtil;

    return {
      id: product.id ?? null,
      creator_id: product.creator_id ?? null,
      title: product.title ?? null,
      price: product.price ?? null,
      created_at: safeToISOString(
        product.created_at as Date | string | null | undefined
      ),
      updated_at: safeToISOString(
        product.updated_at as Date | string | null | undefined
      ),
      deleted_at: safeToISOString(
        product.deleted_at as Date | string | null | undefined
      ),
      creator: product.creator ? UserModel.toJSON(product.creator) : null,
    };
  }
}
