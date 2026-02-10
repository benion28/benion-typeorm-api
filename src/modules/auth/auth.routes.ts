// modules/auth/auth.routes.ts
import { Router } from "express";
import { authController } from "./auth.controller";
import { apiKey } from "@/common/apikey.middleware";
import { auth } from "@/common/auth.middleware";

const router = Router();

router.post("/register", apiKey, authController.register.bind(authController));
router.post("/login", apiKey, authController.login.bind(authController));
router.post("/refresh", apiKey, authController.refreshToken.bind(authController));
router.get("/profile", auth, authController.getProfile.bind(authController));
router.put("/change-password", auth, authController.changePassword.bind(authController));

export default router;
