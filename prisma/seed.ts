// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { UserRole } from '@prisma/client/wasm'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create users
  const users = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin' as UserRole,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      first_name: 'Moderator',
      last_name: 'User',
      email: 'moderator@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'moderator' as UserRole,
      creator_id: '550e8400-e29b-41d4-a716-446655440001',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      first_name: 'Regular',
      last_name: 'User',
      email: 'user@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'user' as UserRole,
      creator_id: '550e8400-e29b-41d4-a716-446655440001',
    },
  ]

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!existingUser) {
      await prisma.user.create({
        data: userData
      })
      console.log(`✅ Created user: ${userData.email}`)
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`)
    }
  }

  // Create products
  const products = [
    { id: '650e8400-e29b-41d4-a716-446655440001', title: 'Wireless Bluetooth Headphones', price: 79.99, creator_id: users[0].id },
    { id: '650e8400-e29b-41d4-a716-446655440002', title: 'Ergonomic Office Chair', price: 249.50, creator_id: users[1].id },
    { id: '650e8400-e29b-41d4-a716-446655440003', title: 'Stainless Steel Water Bottle', price: 24.99, creator_id: users[2].id },
    { id: '650e8400-e29b-41d4-a716-446655440004', title: 'Mechanical Gaming Keyboard', price: 129.99, creator_id: users[0].id },
    { id: '650e8400-e29b-41d4-a716-446655440005', title: '4K Ultra HD Monitor', price: 399.00, creator_id: users[1].id },
    { id: '650e8400-e29b-41d4-a716-446655440006', title: 'Organic Cotton T-Shirt', price: 19.95, creator_id: users[2].id },
    { id: '650e8400-e29b-41d4-a716-446655440007', title: 'Smart Fitness Tracker', price: 89.99, creator_id: users[0].id },
    { id: '650e8400-e29b-41d4-a716-446655440008', title: 'Portable Phone Charger', price: 34.99, creator_id: users[1].id },
    { id: '650e8400-e29b-41d4-a716-446655440009', title: 'Noise Cancelling Earbuds', price: 159.99, creator_id: users[2].id },
    { id: '650e8400-e29b-41d4-a716-446655440010', title: 'LED Desk Lamp', price: 45.00, creator_id: users[0].id },
  ]

  for (const productData of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productData.id }
    })

    if (!existingProduct) {
      await prisma.product.create({
        data: productData
      })
      console.log(`✅ Created product: ${productData.title}`)
    } else {
      console.log(`⏭️  Product already exists: ${productData.title}`)
    }
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })