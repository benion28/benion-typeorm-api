// types/user.interface.ts

export type UserRole = "admin" | "moderator" | "user";

export interface IUser {
  id: string | null;
  first_name: string | null;
  last_name: string | null;
  creator_id?: string | null;
  email: string | null;
  password: string | null;
  role: UserRole | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  deleted_at?: string | Date | null;
  creator?: IUser | null;
}

export interface ICreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: UserRole;
  creator_id?: string;
}

export interface IUpdateUserDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  creator_id?: string;
}

export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  access_token: string;
  refresh_token: string;
}
