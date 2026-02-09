// database/seeders/user.seeder.ts
import { DataSource } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../../modules/user/user.entity";

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);

  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log("⏭️  Users already seeded, skipping...");
    return userRepository.find();
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin" as const,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      email: "moderator@example.com",
      password: hashedPassword,
      role: "moderator" as const,
      creator_id: "550e8400-e29b-41d4-a716-446655440001", // Created by admin
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      email: "user@example.com",
      password: hashedPassword,
      role: "user" as const,
      creator_id: "550e8400-e29b-41d4-a716-446655440001", // Created by admin
    },
  ];

  const createdUsers = userRepository.create(users);
  await userRepository.save(createdUsers);

  console.log("✅ Seeded 3 users (admin, moderator, user)");
  return createdUsers;
}
