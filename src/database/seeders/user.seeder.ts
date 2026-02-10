// database/seeders/user.seeder.ts
import { DataSource } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../../modules/user/user.entity";

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);

  const hashedPassword = await bcrypt.hash("password123", 10);

  const usersToSeed = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin" as const,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      first_name: "Moderator",
      last_name: "User",
      email: "moderator@example.com",
      password: hashedPassword,
      role: "moderator" as const,
      creator_id: "550e8400-e29b-41d4-a716-446655440001",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      first_name: "Regular",
      last_name: "User",
      email: "user@example.com",
      password: hashedPassword,
      role: "user" as const,
      creator_id: "550e8400-e29b-41d4-a716-446655440001",
    },
  ];

  const seededUsers: User[] = [];
  let skippedCount = 0;

  for (const userData of usersToSeed) {
    // Check if user already exists by email
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`⏭️  User ${userData.email} already exists, skipping...`);
      seededUsers.push(existingUser);
      skippedCount++;
    } else {
      const user = userRepository.create(userData);
      const savedUser = await userRepository.save(user);
      seededUsers.push(savedUser);
      console.log(`✅ Created user: ${userData.first_name} ${userData.last_name} (${userData.email}) - ${userData.role}`);
    }
  }

  if (skippedCount === usersToSeed.length) {
    console.log("⏭️  All users already exist, skipping...");
  } else {
    console.log(
      `✅ Seeded ${usersToSeed.length - skippedCount} new users (${skippedCount} skipped)`
    );
  }

  return seededUsers;
}
