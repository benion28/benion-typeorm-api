// common/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "@/config/env";

const env = envConfig;

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      type: string;
    };

    // Only allow access tokens for protected routes
    if (payload.type !== "access") {
      return res
        .status(401)
        .json({ message: "Invalid token type. Use access token." });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
