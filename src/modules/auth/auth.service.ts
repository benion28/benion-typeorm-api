// modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userService } from "@/modules/user/user.service";
import { IAuthResponse, ILoginDTO, ICreateUserDTO } from "@/types";
import { envConfig } from "@/config/env";
import { UserModel } from "@/models/user.model";

const env = envConfig;

export class AuthService {
  async register(data: ICreateUserDTO): Promise<IAuthResponse> {
    const existingUser = await userService.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await userService.create(
      data.first_name,
      data.last_name,
      data.email,
      data.password
    );

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: UserModel.toJSON(user),
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

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: UserModel.toJSON(user),
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      // Verify refresh token with different payload type
      const payload = jwt.verify(refreshToken, env.JWT_SECRET) as {
        userId: string;
        type: string;
      };

      // Check if it's actually a refresh token
      if (payload.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      // Verify user still exists
      const user = await userService.findById(payload.userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(payload.userId);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  private generateAccessToken(userId: string): string {
    return jwt.sign({ userId, type: "access" }, env.JWT_SECRET, {
      expiresIn: "15m", // Short-lived access token
    });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: "refresh" }, env.JWT_SECRET, {
      expiresIn: "7d", // Long-lived refresh token
    });
  }
}

export const authService = new AuthService();
