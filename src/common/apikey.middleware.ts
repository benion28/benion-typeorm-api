// common/apikey.middleware.ts
import { Request, Response, NextFunction } from "express";
import { envConfig } from "@/config/env";
import { ResponseHandler } from "@/common/response";

const env = envConfig;

export function apiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      return ResponseHandler.unauthorized(res, "API key is required");
    }

    if (apiKey !== env.API_KEY) {
      return ResponseHandler.unauthorized(res, "Invalid API key");
    }

    next();
  } catch (error) {
    return ResponseHandler.unauthorized(res, "API key validation failed");
  }
}
