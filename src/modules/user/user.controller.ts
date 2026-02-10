// modules/user/user.controller.ts
import { Request, Response } from "express";
import { userService } from "./user.service";
import { IUpdateUserDTO } from "@/types";
import { ResponseHandler } from "@/common/response";
import { UserModel } from "@/models/user.model";
import { PaginationHelper } from "@/utils/pagination";

export class UserController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = PaginationHelper.getPaginationParams(req);

      const { users, total } = await userService.findAll(page, limit);
      const sanitizedUsers = users.map((user) => UserModel.toJSON(user));

      const pagination = ResponseHandler.createPaginationMeta(page, limit, total);

      ResponseHandler.success(
        res,
        sanitizedUsers,
        "Users retrieved successfully",
        200,
        pagination
      );
    } catch (error: any) {
      ResponseHandler.serverError(res, "Failed to fetch users", error.message);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await userService.findById(id);

      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      ResponseHandler.success(
        res,
        UserModel.toJSON(user),
        "User retrieved successfully"
      );
    } catch (error: any) {
      ResponseHandler.serverError(res, "Failed to fetch user", error.message);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const creatorId = (req.user as any)?.userId;
      const creatorRole = (req as any)?.userRole;

      if (!creatorId) {
        ResponseHandler.unauthorized(res, "User not authenticated");
        return;
      }

      const { first_name, last_name, email, password, role } = req.body;

      // Validation
      if (!first_name || !last_name || !email || !password) {
        ResponseHandler.badRequest(
          res,
          "Validation failed",
          [
            !first_name && {
              field: "first_name",
              message: "First name is required",
            },
            !last_name && { field: "last_name", message: "Last name is required" },
            !email && { field: "email", message: "Email is required" },
            !password && { field: "password", message: "Password is required" },
          ].filter(Boolean) as { field: string; message: string }[]
        );
        return;
      }

      // Check if trying to create admin user
      if (role === "admin" && creatorRole !== "admin") {
        ResponseHandler.forbidden(
          res,
          "Only admins can create admin users"
        );
        return;
      }

      // Check if user already exists
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        ResponseHandler.badRequest(res, "User with this email already exists");
        return;
      }

      const user = await userService.create(
        first_name,
        last_name,
        email,
        password,
        role || "user",
        creatorId
      );

      ResponseHandler.created(
        res,
        UserModel.toJSON(user),
        "User created successfully"
      );
    } catch (error: any) {
      ResponseHandler.serverError(res, "Failed to create user", error.message);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const targetUserId = req.params.id as string;
      const loggedInUserId = (req.user as any)?.userId;
      const data = req.body as IUpdateUserDTO;

      if (!loggedInUserId) {
        ResponseHandler.unauthorized(res, "User not authenticated");
        return;
      }

      // Fetch the target user being updated
      const targetUser = await userService.findById(targetUserId);
      if (!targetUser) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Fetch the logged-in user to check their role
      const loggedInUser = await userService.findById(loggedInUserId);
      if (!loggedInUser) {
        ResponseHandler.unauthorized(res, "Logged in user not found");
        return;
      }

      const isAdmin = loggedInUser.role === "admin";
      const isModerator = loggedInUser.role === "moderator";
      const isOwner = loggedInUserId === targetUserId;

      // Authorization check: admin, moderator, or owner can update
      if (!isAdmin && !isModerator && !isOwner) {
        ResponseHandler.forbidden(
          res,
          "You don't have permission to update this user"
        );
        return;
      }

      // Check if trying to update an admin user
      if (targetUser.role === "admin" && !isAdmin) {
        ResponseHandler.forbidden(
          res,
          "Only admins can update admin users"
        );
        return;
      }

      // Check if trying to change role to admin
      if (data.role === "admin" && !isAdmin) {
        ResponseHandler.forbidden(
          res,
          "Only admins can set user role to admin"
        );
        return;
      }

      // Regular users can only update their own basic info (not role)
      if (isOwner && !isAdmin && !isModerator && data.role) {
        ResponseHandler.forbidden(
          res,
          "You cannot change your own role"
        );
        return;
      }

      const updatedUser = await userService.update(targetUserId, data);

      if (!updatedUser) {
        ResponseHandler.notFound(res, "User not found after update");
        return;
      }

      ResponseHandler.success(
        res,
        UserModel.toJSON(updatedUser),
        "User updated successfully"
      );
    } catch (error: any) {
      ResponseHandler.serverError(res, "Failed to update user", error.message);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const targetUserId = req.params.id as string;
      const loggedInUserId = (req.user as any)?.userId;

      if (!loggedInUserId) {
        ResponseHandler.unauthorized(res, "User not authenticated");
        return;
      }

      // Fetch the target user being deleted
      const targetUser = await userService.findById(targetUserId);
      if (!targetUser) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Fetch the logged-in user to check their role
      const loggedInUser = await userService.findById(loggedInUserId);
      if (!loggedInUser) {
        ResponseHandler.unauthorized(res, "Logged in user not found");
        return;
      }

      const isAdmin = loggedInUser.role === "admin";
      const isModerator = loggedInUser.role === "moderator";

      // Check if trying to delete an admin user
      if (targetUser.role === "admin" && !isAdmin) {
        ResponseHandler.forbidden(
          res,
          "Only admins can delete admin users"
        );
        return;
      }

      // Admins do hard delete, moderators do soft delete
      if (isAdmin) {
        await userService.hardDelete(targetUserId);
        ResponseHandler.success(
          res,
          null,
          "User permanently deleted successfully"
        );
      } else if (isModerator) {
        await userService.delete(targetUserId);
        ResponseHandler.success(
          res,
          null,
          "User deleted successfully"
        );
      } else {
        ResponseHandler.forbidden(
          res,
          "You don't have permission to delete users"
        );
      }
    } catch (error: any) {
      ResponseHandler.serverError(res, "Failed to delete user", error.message);
    }
  }
}

export const userController = new UserController();
