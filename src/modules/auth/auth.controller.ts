// modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { authService } from "./auth.service";
import { ICreateUserDTO, ILoginDTO } from "@/types";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body as ICreateUserDTO;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const result = await authService.register({ email, password });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as ILoginDTO;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const result = await authService.login({ email, password });
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message || "Login failed" });
    }
  }
}

export const authController = new AuthController();
