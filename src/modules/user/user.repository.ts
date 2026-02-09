// modules/user/user.repository.ts
import { AppDataSource } from "@/config/database";
import { User } from "./user.entity";

export const UserRepository = AppDataSource.getRepository(User);
