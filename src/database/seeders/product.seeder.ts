// database/seeders/product.seeder.ts
import { DataSource } from "typeorm";
import { Product } from "../../modules/product/product.entity";
import { User } from "../../modules/user/user.entity";

export async function seedProducts(
  dataSource: DataSource,
  users: User[]
): Promise<void> {
  const productRepository = dataSource.getRepository(Product);

  // Check if products already exist
  const existingProducts = await productRepository.count();
  if (existingProducts > 0) {
    console.log("⏭️  Products already seeded, skipping...");
    return;
  }

  const adminUser = users.find((u) => u.role === "admin");
  const moderatorUser = users.find((u) => u.role === "moderator");
  const regularUser = users.find((u) => u.role === "user");

  if (!adminUser || !moderatorUser || !regularUser) {
    throw new Error("Users must be seeded before products");
  }

  const products = [
    {
      id: "650e8400-e29b-41d4-a716-446655440001",
      title: "Laptop Pro 15",
      price: 1299.99,
      creator_id: adminUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440002",
      title: "Wireless Mouse",
      price: 29.99,
      creator_id: adminUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440003",
      title: "Mechanical Keyboard",
      price: 89.99,
      creator_id: moderatorUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440004",
      title: "USB-C Hub",
      price: 49.99,
      creator_id: moderatorUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440005",
      title: "Monitor 27 inch",
      price: 349.99,
      creator_id: regularUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440006",
      title: "Webcam HD",
      price: 79.99,
      creator_id: regularUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440007",
      title: "Desk Lamp LED",
      price: 39.99,
      creator_id: adminUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440008",
      title: "Ergonomic Chair",
      price: 299.99,
      creator_id: moderatorUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440009",
      title: "Headphones Wireless",
      price: 149.99,
      creator_id: regularUser.id,
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440010",
      title: "External SSD 1TB",
      price: 119.99,
      creator_id: adminUser.id,
    },
  ];

  const createdProducts = productRepository.create(products);
  await productRepository.save(createdProducts);

  console.log("✅ Seeded 10 products");
}
