// src/routes/index.ts
import { Router } from "express";
import userRoutes from "@/modules/user/user.routes";
import productRoutes from "@/modules/product/product.routes";
import authRoutes from "@/modules/auth/auth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
