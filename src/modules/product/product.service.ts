// modules/product/product.service.ts
import { prisma } from "@/lib/prisma";
import { ICreateProductDTO, IUpdateProductDTO } from "@/types";
import { Product } from "@prisma/client";

export class ProductService {
  async findAll(
    page?: number,
    limit?: number
  ): Promise<{ products: Product[]; total: number }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        include: {
          creator: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              role: true,
              creator_id: true,
              created_at: true,
              updated_at: true,
            }
          }
        },
        where: {
          deleted_at: null
        }
      }),
      prisma.product.count({
        where: {
          deleted_at: null
        }
      })
    ]);

    return { products, total };
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findFirst({ 
      where: { 
        id,
        deleted_at: null
      },
      include: {
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
            creator_id: true,
            created_at: true,
            updated_at: true,
          }
        }
      }
    });
  }

  async create(data: ICreateProductDTO, userId: string): Promise<Product> {
    return prisma.product.create({
      data: {
        ...data,
        creator_id: userId
      }
    });
  }

  async update(id: string, data: IUpdateProductDTO): Promise<Product | null> {
    await prisma.product.update({
      where: { id },
      data
    });
    
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() }
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id }
    });
  }
}

export const productService = new ProductService();
