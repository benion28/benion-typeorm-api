// src/app.ts
import express from "express";
import dotenv from "dotenv";
import routes from "@/routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check
app.get("/", (_, res) => {
  res.json({ status: "API is running 🚀" });
});

export default app;
