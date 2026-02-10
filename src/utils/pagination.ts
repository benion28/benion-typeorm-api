// utils/pagination.ts
import { Request } from "express";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export class PaginationHelper {
  static getPaginationParams(req: Request): PaginationParams {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string) || 10)
    );
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  static validatePaginationParams(
    page?: number,
    limit?: number
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
      errors.push("Page must be a positive integer");
    }

    if (
      limit !== undefined &&
      (limit < 1 || limit > 100 || !Number.isInteger(limit))
    ) {
      errors.push("Limit must be a positive integer between 1 and 100");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
