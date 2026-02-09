// modules/user/user.service.ts
import { UserRepository } from "./user.repository";
import bcrypt from "bcrypt";
import { User } from "./user.entity";
import { IUserResponse, IUpdateUserDTO, UserRole } from "@/types";

export class UserService {
  async findAll(): Promise<IUserResponse[]> {
    return UserRepository.find({
      select: ["id", "email", "role", "creator_id", "created_at", "updated_at"],
    });
  }

  async findById(id: string): Promise<IUserResponse | null> {
    return UserRepository.findOne({
      where: { id },
      select: ["id", "email", "role", "creator_id", "created_at", "updated_at"],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserRepository.findOne({ where: { email } });
  }

  async create(
    email: string,
    password: string,
    role: UserRole = "user"
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = UserRepository.create({
      email,
      password: hashedPassword,
      role,
    });
    return UserRepository.save(user);
  }

  async update(id: string, data: IUpdateUserDTO): Promise<IUserResponse | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await UserRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await UserRepository.softDelete(id);
  }
}

export const userService = new UserService();
