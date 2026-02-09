// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

type DatabaseEngine = "mysql" | "postgres";

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DB_ENGINE: DatabaseEngine;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const envConfig: EnvConfig = {
  PORT: parseInt(getEnvVariable("PORT", "4000"), 10),
  NODE_ENV: getEnvVariable("NODE_ENV", "development"),
  DB_ENGINE: getEnvVariable("DB_ENGINE", "postgres") as DatabaseEngine,
  DB_HOST: getEnvVariable("DB_HOST"),
  DB_PORT: parseInt(getEnvVariable("DB_PORT"), 10),
  DB_USERNAME: getEnvVariable("DB_USERNAME"),
  DB_PASSWORD: getEnvVariable("DB_PASSWORD"),
  DB_NAME: getEnvVariable("DB_NAME"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
};

// Validate environment
export const validateEnv = (): void => {
  const requiredVars = [
    "DB_ENGINE",
    "DB_HOST",
    "DB_PORT",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_NAME",
    "JWT_SECRET",
  ];

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate DB_ENGINE
  if (!["mysql", "postgres"].includes(envConfig.DB_ENGINE)) {
    throw new Error(
      `Invalid DB_ENGINE: ${envConfig.DB_ENGINE}. Must be 'mysql' or 'postgres'`
    );
  }

  console.log("✅ Environment variables validated");
  console.log(`📊 Database Engine: ${envConfig.DB_ENGINE}`);
};
