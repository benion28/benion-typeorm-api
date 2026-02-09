// types/user.interface.ts

export type UserRole = "admin" | "moderator" | "user";

export interface IUser {
  id: string;
  creator_id?: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IUserResponse {
  id: string;
  creator_id?: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateUserDTO {
  email: string;
  password: string;
  role?: UserRole;
  creator_id?: string;
}

export interface IUpdateUserDTO {
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
  user: IUserResponse;
  token: string;
}
