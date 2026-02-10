// modules/auth/auth.routes.ts
import { Router } from "express";
import { authController } from "./auth.controller";
import { apiKey } from "@/common/apikey.middleware";

const router = Router();

router.post("/register", apiKey, authController.register.bind(authController));
router.post("/login", apiKey, authController.login.bind(authController));
router.post("/refresh", apiKey, authController.refreshToken.bind(authController));

export default router;
