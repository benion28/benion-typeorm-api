// modules/product/product.service.ts
import { ProductRepository } from "./product.repository";
import { Product } from "./product.entity";
import { ICreateProductDTO, IUpdateProductDTO } from "@/types";

export class ProductService {
  async findAll(
    page?: number,
    limit?: number
  ): Promise<{ products: Product[]; total: number }> {
    const queryOptions: any = {
      relations: ["creator"],
    };

    // Add pagination if provided
    if (page !== undefined && limit !== undefined) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    const [products, total] = await ProductRepository.findAndCount(queryOptions);

    return { products, total };
  }

  async findById(id: string): Promise<Product | null> {
    return ProductRepository.findOne({ 
      where: { id },
      relations: ["creator"]
    });
  }

  async create(data: ICreateProductDTO, userId: string): Promise<Product> {
    const product = ProductRepository.create({
      ...data,
      creator_id: userId
    });
    return ProductRepository.save(product);
  }

  async update(id: string, data: IUpdateProductDTO): Promise<Product | null> {
    await ProductRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await ProductRepository.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await ProductRepository.delete(id);
  }
}

export const productService = new ProductService();
