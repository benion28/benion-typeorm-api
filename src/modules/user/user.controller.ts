// modules/user/user.controller.ts
import { Request, Response } from "express";
import { userService } from "./user.service";
import { IUpdateUserDTO } from "@/types";

export class UserController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users", error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await userService.findById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body as IUpdateUserDTO;
      const user = await userService.update(id, data);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await userService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user", error });
    }
  }
}

export const userController = new UserController();
