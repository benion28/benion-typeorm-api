// modules/user/user.routes.ts
import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "@/common/auth.middleware";
import { requireRole } from "@/common/role.middleware";

const router = Router();

router.get("/", auth, userController.getAll.bind(userController));
router.get("/:id", auth, userController.getById.bind(userController));
router.post(
  "/",
  auth,
  requireRole("admin", "moderator"),
  userController.create.bind(userController)
);
router.put("/:id", auth, userController.update.bind(userController));
router.delete(
  "/:id",
  auth,
  requireRole("admin", "moderator"),
  userController.delete.bind(userController)
);

export default router;
