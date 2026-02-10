// modules/user/user.service.ts
import { UserRepository } from "./user.repository";
import bcrypt from "bcrypt";
import { User } from "./user.entity";
import { IUpdateUserDTO, IUser, UserRole } from "@/types";

export class UserService {
  async findAll(
    page?: number,
    limit?: number
  ): Promise<{ users: IUser[]; total: number }> {
    const queryOptions: any = {
      select: [
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "creator_id",
        "created_at",
        "updated_at",
      ],
      relations: ["creator"],
    };

    // Add pagination if provided
    if (page !== undefined && limit !== undefined) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    const [users, total] = await UserRepository.findAndCount(queryOptions);

    return { users, total };
  }

  async findById(id: string): Promise<IUser | null> {
    return UserRepository.findOne({
      where: { id },
      select: [
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "creator_id",
        "created_at",
        "updated_at",
      ],
      relations: ["creator"],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserRepository.findOne({ where: { email } });
  }

  async create(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: UserRole = "user",
    creator_id?: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = UserRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      creator_id,
    });
    return UserRepository.save(user);
  }

  async update(id: string, data: IUpdateUserDTO): Promise<IUser | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await UserRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await UserRepository.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await UserRepository.delete(id);
  }
}

export const userService = new UserService();
