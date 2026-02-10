// modules/product/product.routes.ts
import { Router } from "express";
import { productController } from "./product.controller";
import { auth } from "@/common/auth.middleware";
import { apiKey } from "@/common/apikey.middleware";

const router = Router();

router.get("/", apiKey, productController.getAll.bind(productController));
router.get("/:id", apiKey, productController.getById.bind(productController));
router.post("/", auth, productController.create.bind(productController));
router.put("/:id", auth, productController.update.bind(productController));
router.delete("/:id", auth, productController.delete.bind(productController));

export default router;
