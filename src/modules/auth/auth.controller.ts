// modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { authService } from "./auth.service";
import { ICreateUserDTO, ILoginDTO } from "@/types";
import { ResponseHandler } from "@/common/response";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, password } =
        req.body as ICreateUserDTO;

      if (!first_name || !last_name || !email || !password) {
        return ResponseHandler.badRequest(
          res,
          "Validation failed",
          [
            !first_name && { field: "first_name", message: "First name is required" },
            !last_name && { field: "last_name", message: "Last name is required" },
            !email && { field: "email", message: "Email is required" },
            !password && { field: "password", message: "Password is required" },
          ].filter(Boolean) as { field: string; message: string }[]
        );
      }

      const result = await authService.register({
        first_name,
        last_name,
        email,
        password,
      });

      return ResponseHandler.created(res, result, "User registered successfully");
    } catch (error: any) {
      return ResponseHandler.badRequest(res, error.message || "Registration failed");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as ILoginDTO;

      if (!email || !password) {
        return ResponseHandler.badRequest(
          res,
          "Validation failed",
          [
            !email && { field: "email", message: "Email is required" },
            !password && { field: "password", message: "Password is required" },
          ].filter(Boolean) as { field: string; message: string }[]
        );
      }

      const result = await authService.login({ email, password });
      return ResponseHandler.success(res, result, "Login successful");
    } catch (error: any) {
      return ResponseHandler.unauthorized(res, error.message || "Login failed");
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return ResponseHandler.badRequest(res, "Refresh token is required");
      }

      const result = await authService.refreshToken(refresh_token);
      return ResponseHandler.success(
        res,
        result,
        "Access token refreshed successfully"
      );
    } catch (error: any) {
      return ResponseHandler.unauthorized(
        res,
        error.message || "Invalid refresh token"
      );
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?.userId;

      if (!userId) {
        return ResponseHandler.unauthorized(res, "User not authenticated");
      }

      const profile = await authService.getProfile(userId);
      return ResponseHandler.success(res, profile, "Profile retrieved successfully");
    } catch (error: any) {
      return ResponseHandler.serverError(
        res,
        "Failed to fetch profile",
        error.message
      );
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?.userId;

      if (!userId) {
        return ResponseHandler.unauthorized(res, "User not authenticated");
      }

      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        return ResponseHandler.badRequest(
          res,
          "Validation failed",
          [
            !current_password && {
              field: "current_password",
              message: "Current password is required",
            },
            !new_password && {
              field: "new_password",
              message: "New password is required",
            },
          ].filter(Boolean) as { field: string; message: string }[]
        );
      }

      if (new_password.length < 6) {
        return ResponseHandler.badRequest(
          res,
          "New password must be at least 6 characters long"
        );
      }

      await authService.changePassword(userId, current_password, new_password);
      return ResponseHandler.success(res, null, "Password changed successfully");
    } catch (error: any) {
      if (error.message === "Current password is incorrect") {
        return ResponseHandler.badRequest(res, error.message);
      }
      return ResponseHandler.serverError(
        res,
        "Failed to change password",
        error.message
      );
    }
  }
}

export const authController = new AuthController();
