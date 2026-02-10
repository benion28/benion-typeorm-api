// types/index.ts
export * from "./user.interface";
export * from "./product.interface";
export * from "./express";

export interface ApiRespons<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    errors?: {
        field: string;
        message: string;
    }[];
    pagination?: {
        limit: number;
        page: number;
        total: number;
        to: number;
        from: number;
    }
}