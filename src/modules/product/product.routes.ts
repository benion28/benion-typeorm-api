// modules/product/product.routes.ts
import { Router } from "express";
import { productController } from "./product.controller";
import { auth } from "@/common/auth.middleware";

const router = Router();

router.get("/", productController.getAll.bind(productController));
router.get("/:id", productController.getById.bind(productController));
router.post("/", auth, productController.create.bind(productController));
router.put("/:id", auth, productController.update.bind(productController));
router.delete("/:id", auth, productController.delete.bind(productController));

export default router;
