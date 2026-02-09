# TypeORM REST API

A complete REST API built with Express, TypeORM, and MySQL/PostgreSQL with full authentication, role-based access, and database seeding.

## Features

- ✅ User authentication (register/login) with JWT
- ✅ Role-based access control (admin, moderator, user)
- ✅ Product CRUD operations
- ✅ User management with creator tracking
- ✅ Soft deletes
- ✅ Password hashing with bcrypt
- ✅ TypeScript strict mode with full type safety
- ✅ Database migrations
- ✅ Database seeders
- ✅ Dynamic database engine support (MySQL/PostgreSQL)
- ✅ Environment configuration with validation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: MySQL (configurable to PostgreSQL)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: class-validator & class-transformer

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure your database in `.env`:**
```env
PORT=4000
NODE_ENV=development
DB_ENGINE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=sql_test_db
JWT_SECRET=your_secret_key
```

3. **Create the database:**
```sql
CREATE DATABASE sql_test_db;
```

4. **Run migrations:**
```bash
npm run migration:run
```

5. **Seed the database (optional):**
```bash
npm run seed
```

This will create:
- 3 users: admin@example.com, moderator@example.com, user@example.com (all with password: `password123`)
- 10 sample products

6. **Run the development server:**
```bash
npm run dev
```

## API Endpoints

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { "user": {...}, "token": "jwt_token" }
```

### Users (Protected)

**Get all users**
```http
GET /api/users
Authorization: Bearer <token>
```

**Get user by ID**
```http
GET /api/users/:id
Authorization: Bearer <token>
```

**Update user**
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "role": "moderator"
}
```

**Delete user**
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### Products

**Get all products**
```http
GET /api/products
```

**Get product by ID**
```http
GET /api/products/:id
```

**Create product (Protected)**
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Product Name",
  "price": 99.99
}
```

**Update product (Protected)**
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Name",
  "price": 149.99
}
```

**Delete product (Protected)**
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `role` (enum: admin, moderator, user)
- `creator_id` (Foreign Key to users, nullable)
- `created_at`, `updated_at`, `deleted_at`

### Products Table
- `id` (UUID, Primary Key)
- `title`
- `price` (Decimal)
- `creator_id` (Foreign Key to users)
- `created_at`, `updated_at`, `deleted_at`

## Project Structure

```
src/
├── common/              # Shared utilities
│   ├── base.entity.ts   # Base entity with common fields
│   ├── auth.middleware.ts
│   └── response.ts
├── config/              # Configuration
│   ├── database.ts      # TypeORM DataSource
│   └── env.ts           # Environment variables with validation
├── database/            # Database related
│   ├── migrations/      # Database migrations
│   ├── seeders/         # Database seeders
│   ├── data-source.ts   # CLI DataSource for migrations
│   └── seed.ts          # Seed runner script
├── modules/             # Feature modules
│   ├── auth/            # Authentication
│   ├── user/            # User management
│   └── product/         # Product management
├── routes/              # Route aggregation
├── types/               # TypeScript interfaces & types
│   ├── express.d.ts     # Express type extensions
│   ├── user.interface.ts
│   ├── product.interface.ts
│   └── index.ts
├── app.ts               # Express app setup
└── server.ts            # Server entry point
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run seed` - Seed database with sample data
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run migration:show` - Show migration status
- `npm run migration:generate` - Generate migration from entity changes
- `npm run migration:create` - Create empty migration file

See [MIGRATIONS.md](./MIGRATIONS.md) for detailed migration guide.

## Seeded Data

After running `npm run seed`, you'll have:

**Users:**
- admin@example.com (role: admin)
- moderator@example.com (role: moderator)
- user@example.com (role: user)

All passwords: `password123`

**Products:**
- 10 sample products created by different users

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 4000 |
| NODE_ENV | Environment | development |
| DB_ENGINE | Database type (mysql/postgres) | mysql |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_USERNAME | Database user | - |
| DB_PASSWORD | Database password | - |
| DB_NAME | Database name | - |
| JWT_SECRET | JWT secret key | - |

## Development vs Production

### Development Mode
- Set `NODE_ENV=development` in `.env`
- `synchronize: true` - TypeORM auto-creates/updates tables
- Good for rapid prototyping
- **Warning:** Can cause data loss

### Production Mode
- Set `NODE_ENV=production` in `.env`
- `synchronize: false` - Only migrations modify schema
- Safe and version-controlled
- Required for production deployments

## Testing the API

Use the provided [API_TESTING.md](./API_TESTING.md) file for curl examples, or import the endpoints into Postman/Insomnia.

## License

MIT
