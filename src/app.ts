// src/app.ts
import express from "express";
import dotenv from "dotenv";
import routes from "@/routes";
import { envConfig } from "./config/env";
import { ResponseHandler } from "@/common/response";

dotenv.config();

const app = express();

const env = envConfig;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check at root (for Render health checks)
app.get("/health", (_, res) => {
  ResponseHandler.success(
    res,
    { status: "running", version: "1.0.0" },
    `${env.APP_NAME || "Prisma"} API is running`
  );
});

// Health check at /api/health (for API consumers)
app.get("/api/health", (_, res) => {
  ResponseHandler.success(
    res,
    { status: "running", version: "1.0.0" },
    `${env.APP_NAME || "Prisma"} API is running`
  );
});

export default app;
