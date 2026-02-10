// modules/product/product.controller.ts
import { Request, Response } from "express";
import { productService } from "./product.service";
import { ICreateProductDTO, IUpdateProductDTO } from "@/types";
import { ResponseHandler } from "@/common/response";
import { ProductModel } from "@/models/product.model";
import { PaginationHelper } from "@/utils/pagination";

export class ProductController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = PaginationHelper.getPaginationParams(req);

      const { products, total } = await productService.findAll(page, limit);
      const sanitizedProducts = products.map((product) =>
        ProductModel.toJSON(product)
      );

      const pagination = ResponseHandler.createPaginationMeta(page, limit, total);

      ResponseHandler.success(
        res,
        sanitizedProducts,
        "Products retrieved successfully",
        200,
        pagination
      );
    } catch (error: any) {
      ResponseHandler.serverError(
        res,
        "Failed to fetch products",
        error.message
      );
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await productService.findById(id);

      if (!product) {
        ResponseHandler.notFound(res, "Product not found");
        return;
      }

      ResponseHandler.success(
        res,
        ProductModel.toJSON(product),
        "Product retrieved successfully"
      );
    } catch (error: any) {
      ResponseHandler.serverError(res, "Failed to fetch product", error.message);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.userId;
      if (!userId) {
        ResponseHandler.unauthorized(res, "User not authenticated");
        return;
      }

      const data = req.body as ICreateProductDTO;

      if (!data.title || !data.price) {
        ResponseHandler.badRequest(
          res,
          "Validation failed",
          [
            !data.title && { field: "title", message: "Title is required" },
            !data.price && { field: "price", message: "Price is required" },
          ].filter(Boolean) as { field: string; message: string }[]
        );
        return;
      }

      const product = await productService.create(data, userId);
      ResponseHandler.created(
        res,
        ProductModel.toJSON(product),
        "Product created successfully"
      );
    } catch (error: any) {
      // Check for duplicate title error
      if (error.code === "ER_DUP_ENTRY" || error.code === "23505") {
        ResponseHandler.badRequest(
          res,
          "A product with this title already exists"
        );
        return;
      }
      ResponseHandler.serverError(
        res,
        "Failed to create product",
        error.message
      );
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id as string;
      const loggedInUserId = (req.user as any)?.userId;
      const data = req.body as IUpdateProductDTO;

      if (!loggedInUserId) {
        ResponseHandler.unauthorized(res, "User not authenticated");
        return;
      }

      // Fetch the product being updated
      const product = await productService.findById(productId);
      if (!product) {
        ResponseHandler.notFound(res, "Product not found");
        return;
      }

      // Fetch the logged-in user to check their role
      const { userService } = await import("@/modules/user/user.service");
      const loggedInUser = await userService.findById(loggedInUserId);
      if (!loggedInUser) {
        ResponseHandler.unauthorized(res, "Logged in user not found");
        return;
      }

      const isAdmin = loggedInUser.role === "admin";
      const isModerator = loggedInUser.role === "moderator";
      const isCreator = product.creator_id === loggedInUserId;

      // Authorization check: admin, moderator, or creator can update
      if (!isAdmin && !isModerator && !isCreator) {
        ResponseHandler.forbidden(
          res,
          "You don't have permission to update this product"
        );
        return;
      }

      const updatedProduct = await productService.update(productId, data);

      if (!updatedProduct) {
        ResponseHandler.notFound(res, "Product not found after update");
        return;
      }

      ResponseHandler.success(
        res,
        ProductModel.toJSON(updatedProduct),
        "Product updated successfully"
      );
    } catch (error: any) {
      // Check for duplicate title error
      if (error.code === "ER_DUP_ENTRY" || error.code === "23505") {
        ResponseHandler.badRequest(
          res,
          "A product with this title already exists"
        );
        return;
      }
      ResponseHandler.serverError(
        res,
        "Failed to update product",
        error.message
      );
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id as string;
      const loggedInUserId = (req.user as any)?.userId;

      if (!loggedInUserId) {
        ResponseHandler.unauthorized(res, "User not authenticated");
        return;
      }

      // Fetch the product being deleted
      const product = await productService.findById(productId);
      if (!product) {
        ResponseHandler.notFound(res, "Product not found");
        return;
      }

      // Fetch the logged-in user to check their role
      const { userService } = await import("@/modules/user/user.service");
      const loggedInUser = await userService.findById(loggedInUserId);
      if (!loggedInUser) {
        ResponseHandler.unauthorized(res, "Logged in user not found");
        return;
      }

      const isAdmin = loggedInUser.role === "admin";
      const isModerator = loggedInUser.role === "moderator";
      const isCreator = product.creator_id === loggedInUserId;

      // Authorization check: admin, moderator, or creator can delete
      if (!isAdmin && !isModerator && !isCreator) {
        ResponseHandler.forbidden(
          res,
          "You don't have permission to delete this product"
        );
        return;
      }

      // Admins do hard delete, moderators and regular users do soft delete
      if (isAdmin) {
        await productService.hardDelete(productId);
        ResponseHandler.success(
          res,
          null,
          "Product permanently deleted successfully"
        );
      } else {
        await productService.delete(productId);
        ResponseHandler.success(
          res,
          null,
          "Product soft deleted successfully"
        );
      }
    } catch (error: any) {
      ResponseHandler.serverError(
        res,
        "Failed to delete product",
        error.message
      );
    }
  }
}

export const productController = new ProductController();
