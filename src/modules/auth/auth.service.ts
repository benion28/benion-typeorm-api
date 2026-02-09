// modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userService } from "@/modules/user/user.service";
import { IAuthResponse, ILoginDTO, ICreateUserDTO } from "@/types";
import { envConfig } from "@/config/env";

const env = envConfig;

export class AuthService {
  async register(data: ICreateUserDTO): Promise<IAuthResponse> {
    const existingUser = await userService.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await userService.create(data.email, data.password);
    const token = this.generateToken(user.id);

    return {
      user: { 
        id: user.id, 
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        role: user.role
      },
      token
    };
  }

  async login(data: ILoginDTO): Promise<IAuthResponse> {
    const user = await userService.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user.id);

    return {
      user: { 
        id: user.id, 
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        role: user.role
      },
      token
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
  }
}

export const authService = new AuthService();
