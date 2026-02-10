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
}

export const authController = new AuthController();
