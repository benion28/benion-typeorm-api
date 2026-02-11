// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

type DatabaseEngine = "mysql" | "postgresql";

interface EnvConfig {
  PORT: number;
  APP_NAME: string;
  NODE_ENV: string;
  DB_ENGINE: DatabaseEngine;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  API_KEY: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Construct DATABASE_URL from individual components if not provided
const constructDatabaseUrl = (): string => {
  // If DATABASE_URL is already set, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Otherwise, construct from individual components
  const engine = getEnvVariable("DB_ENGINE", "mysql");
  const username = getEnvVariable("DB_USERNAME");
  const password = getEnvVariable("DB_PASSWORD");
  const host = getEnvVariable("DB_HOST");
  const port = getEnvVariable("DB_PORT");
  const database = getEnvVariable("DB_NAME");

  // Handle different database engines
  const protocol = engine === "postgresql" ? "postgresql" : "mysql";
  
  return `${protocol}://${username}:${password}@${host}:${port}/${database}`;
};

export const envConfig: EnvConfig = {
  PORT: parseInt(getEnvVariable("PORT", "4000"), 10),
  APP_NAME: getEnvVariable("APP_NAME", "Benion Prisma API"),
  NODE_ENV: getEnvVariable("NODE_ENV", "development"),
  DB_ENGINE: getEnvVariable("DB_ENGINE", "mysql") as DatabaseEngine,
  DB_HOST: getEnvVariable("DB_HOST"),
  DB_PORT: parseInt(getEnvVariable("DB_PORT"), 10),
  DB_USERNAME: getEnvVariable("DB_USERNAME"),
  DB_PASSWORD: getEnvVariable("DB_PASSWORD"),
  DB_NAME: getEnvVariable("DB_NAME"),
  DATABASE_URL: getEnvVariable("DATABASE_URL", constructDatabaseUrl()),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  API_KEY: getEnvVariable("API_KEY"),
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
    "API_KEY",
  ];

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate DB_ENGINE
  if (!["mysql", "postgresql"].includes(envConfig.DB_ENGINE)) {
    throw new Error(
      `Invalid DB_ENGINE: ${envConfig.DB_ENGINE}. Must be 'mysql' or 'postgresql'`
    );
  }

  console.log("✅ Environment variables validated");
  console.log(`📊 Database: ${envConfig.DB_ENGINE} at ${envConfig.DB_HOST}:${envConfig.DB_PORT}`);
  console.log(`🔗 Database URL: ${envConfig.DATABASE_URL}`);
};
