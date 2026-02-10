// common/response.ts
import { Response } from "express";

export interface PaginationMeta {
  limit: number;
  page: number;
  total: number;
  to: number;
  from: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: {
    field: string;
    message: string;
  }[];
  pagination?: PaginationMeta;
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200,
    pagination?: PaginationMeta
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      ...(pagination && { pagination }),
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = "Resource created successfully"
  ): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response, message: string = "Success"): Response {
    const response: ApiResponse<null> = {
      success: true,
      message,
    };
    return res.status(204).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ApiResponse<null> = {
      success: false,
      message,
      error,
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(
    res: Response,
    message: string = "Bad request",
    errors?: { field: string; message: string }[]
  ): Response {
    const response: ApiResponse<null> = {
      success: false,
      message,
      errors,
    };
    return res.status(400).json(response);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized"
  ): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = "Forbidden"): Response {
    return this.error(res, message, 403);
  }

  static notFound(
    res: Response,
    message: string = "Resource not found"
  ): Response {
    return this.error(res, message, 404);
  }

  static serverError(
    res: Response,
    message: string = "Internal server error",
    error?: string
  ): Response {
    return this.error(res, message, 500, error);
  }

  static createPaginationMeta(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return {
      page,
      limit,
      total,
      from: total > 0 ? from : 0,
      to: total > 0 ? to : 0,
    };
  }
}
