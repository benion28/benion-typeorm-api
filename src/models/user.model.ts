import { IUser, UserRole } from "@/types";
import dateUtil from "@/utils/date";

export class UserModel implements IUser {
    id: string | null;
    creator_id?: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    password: string | null;
    role: UserRole | null;
    created_at: string | Date | null;
    updated_at: string | Date | null;
    deleted_at?: string | Date | null;
    creator?: IUser | null;

    constructor(data: Partial<IUser>) {
        this.id = data.id ?? null;
        this.creator_id = data.creator_id ?? null;
        this.first_name = data.first_name ?? null;
        this.last_name = data.last_name ?? null;
        this.email = data.email ?? null;
        this.password = data.password ?? null;
        this.role = data.role ?? null;
        this.created_at = data.created_at ? new Date(data.created_at) : null;
        this.updated_at = data.updated_at ? new Date(data.updated_at) : null;
        this.deleted_at = data.deleted_at ? new Date(data.deleted_at) : null;
        this.creator = data.creator ?? null;
    }

    static fromJSON(user: Partial<IUser>): UserModel {
        return new UserModel(user);
    }

    static instance(): UserModel {
        return new UserModel({
            id: null,
            creator_id: null,
            first_name: null,
            last_name: null,
            email: null,
            password: null,
            role: null,
            created_at: null,
            updated_at: null,
            deleted_at: null,
            creator: null,
        })
    }

    static toJSON(user: Partial<IUser>): any {
        const { safeToISOString } = dateUtil;

        return {
            id: user.id ?? null,
            creator_id: user.creator_id ?? null,
            first_name: user.first_name ?? null,
            last_name: user.last_name ?? null,
            email: user.email ?? null,
            role: user.role ?? null,
            created_at: safeToISOString(user.created_at as Date | string | null | undefined),
            updated_at: safeToISOString(user.updated_at as Date | string | null | undefined),
            deleted_at: safeToISOString(user.deleted_at as Date | string | null | undefined),
            creator: user.creator ? this.toJSON(user.creator) : null,
        }
    }
}