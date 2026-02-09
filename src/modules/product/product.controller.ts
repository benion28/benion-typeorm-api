// modules/product/product.controller.ts
import { Request, Response } from "express";
import { productService } from "./product.service";
import { ICreateProductDTO, IUpdateProductDTO } from "@/types";

export class ProductController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products", error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await productService.findById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product", error });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const data = req.body as ICreateProductDTO;
      const product = await productService.create(data, userId);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to create product", error });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body as IUpdateProductDTO;
      const product = await productService.update(id, data);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product", error });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await productService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product", error });
    }
  }
}

export const productController = new ProductController();
