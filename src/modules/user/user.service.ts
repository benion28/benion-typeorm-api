// modules/user/user.service.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { IUpdateUserDTO, IUser, UserRole } from "@/types";

export class UserService {
  async findAll(
    page?: number,
    limit?: number
  ): Promise<{ users: IUser[]; total: number }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          creator_id: true,
          created_at: true,
          updated_at: true,
          creator: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              role: true,
              creator_id: true,
              created_at: true,
              updated_at: true,
            }
          }
        },
        where: {
          deleted_at: null
        }
      }),
      prisma.user.count({
        where: {
          deleted_at: null
        }
      })
    ]);

    return { users, total };
  }

  async findById(id: string): Promise<IUser | null> {
    return prisma.user.findFirst({
      where: { 
        id,
        deleted_at: null
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        creator_id: true,
        created_at: true,
        updated_at: true,
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
            creator_id: true,
            created_at: true,
            updated_at: true,
          }
        }
      }
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findFirst({ 
      where: { 
        email,
        deleted_at: null
      }
    });
  }

  async create(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: UserRole = "user",
    creator_id?: string
  ): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role,
        creator_id,
      }
    });
  }

  async update(id: string, data: IUpdateUserDTO): Promise<IUser | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    await prisma.user.update({
      where: { id },
      data
    });
    
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() }
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
}

export const userService = new UserService();
