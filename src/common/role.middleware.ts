// common/role.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "@/common/response";
import { userService } from "@/modules/user/user.service";
import { UserRole } from "@/types";

export function requireRole(...allowedRoles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req.user as any)?.userId;

      if (!userId) {
        return ResponseHandler.unauthorized(res, "User not authenticated");
      }

      // Fetch user to get their role
      const user = await userService.findById(userId);

      if (!user) {
        return ResponseHandler.unauthorized(res, "User not found");
      }

      // Check if user's role is in the allowed roles
      if (!user.role || !allowedRoles.includes(user.role)) {
        return ResponseHandler.forbidden(
          res,
          `Access denied. Required role: ${allowedRoles.join(" or ")}`
        );
      }

      // Attach user role to request for further use
      (req as any).userRole = user.role;

      next();
    } catch (error) {
      return ResponseHandler.serverError(
        res,
        "Failed to verify user role",
        (error as Error).message
      );
    }
  };
}
