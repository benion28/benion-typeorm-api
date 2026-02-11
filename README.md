# Prisma REST API

A complete REST API built with Express, Prisma, and MySQL with full authentication, role-based access, and database seeding.

## Features

- ✅ User authentication (register/login) with JWT
- ✅ API key authentication for non-authenticated routes
- ✅ Pagination support for list endpoints
- ✅ Role-based access control (admin, moderator, user)
- ✅ Product CRUD operations
- ✅ User management with creator tracking
- ✅ Soft deletes
- ✅ Password hashing with bcrypt
- ✅ TypeScript strict mode with full type safety
- ✅ Database migrations with Prisma
- ✅ Database seeding with Prisma
- ✅ Environment configuration with validation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure your database in `.env`:**
```env
PORT=4000
NODE_ENV=development

# Database connection components (DATABASE_URL is constructed automatically)
DB_ENGINE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=sql_test_db

JWT_SECRET=your_secret_key
API_KEY=your_api_key_here_change_in_production
```

**Note:** The `DATABASE_URL` is automatically constructed from the individual database components. 

**To switch between MySQL and PostgreSQL:**
1. Change `DB_ENGINE` to either `mysql` or `postgresql`
2. Update the other DB_* variables accordingly
3. Update `DATABASE_URL` to match
4. Run `npm run schema:switch` (or any db: command which does this automatically)

3. **Create the database:**
```sql
CREATE DATABASE sql_test_db;
```

4. **Generate Prisma client and push schema:**
```bash
npx prisma generate
npx prisma db push
```

5. **Seed the database (optional):**
```bash
npm run db:seed
```

This will create:
- 3 users: admin@example.com, moderator@example.com, user@example.com (all with password: `password123`)
- 10 sample products

6. **Run the development server:**
```bash
npm run dev
```

## Database Management

### **Schema Switching:**

This project supports both MySQL and PostgreSQL. The appropriate schema is automatically selected based on your `DB_ENGINE` environment variable.

**Available schema files:**
- `prisma/schema.mysql.prisma` - MySQL configuration
- `prisma/schema.postgresql.prisma` - PostgreSQL configuration
- `prisma/schema.prisma` - Active schema (auto-generated)

**Manual schema switch:**
```bash
npm run schema:switch
```

This command reads your `DB_ENGINE` from `.env` and copies the appropriate schema file to `schema.prisma`.

### **Development Workflow:**

All database commands automatically switch to the correct schema before running:

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Create and apply migrations (production-ready)
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

**Note:** The `schema:switch` command runs automatically before most Prisma commands, so you don't need to run it manually unless you're using Prisma CLI directly.

## API Endpoints

**Note:** All non-authenticated routes require an API key in the `x-api-key` header.

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json
x-api-key: your_api_key_here_change_in_production

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json
x-api-key: your_api_key_here_change_in_production

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { 
  "user": {...}, 
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token"
}
```

**Refresh Token**
```http
POST /api/auth/refresh
Content-Type: application/json
x-api-key: your_api_key_here_change_in_production

{
  "refresh_token": "your_refresh_token"
}

Response: { 
  "access_token": "new_jwt_access_token"
}
```

**Token Details:**
- Access tokens expire in 15 minutes and are used for protected routes
- Refresh tokens expire in 7 days and are used to get new access tokens
- Only access tokens work for protected routes (not refresh tokens)

**Get Profile (Protected)**
```http
GET /api/auth/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "created_at": "2026-02-10T09:20:58.775Z",
    "updated_at": "2026-02-10T09:20:58.775Z",
    "creator": null
  }
}
```

**Change Password (Protected)**
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "oldPassword123",
  "new_password": "newSecurePassword456"
}

Requirements:
- Current password must be correct
- New password must be at least 6 characters
- Returns success message on completion
```

## API Security

This API implements two layers of security:

1. **API Key Authentication** - Required for all non-authenticated routes (register, login, refresh, public product endpoints)
   - Add `x-api-key` header with your API key
   - Prevents unauthorized access to public endpoints
   - Set in `.env` as `API_KEY`

2. **JWT Authentication** - Required for protected routes (create/update/delete operations)
   - Add `Authorization: Bearer <access_token>` header
   - Access tokens expire in 15 minutes
   - Use refresh tokens to get new access tokens

### Users (Protected)

**Get all users**
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <token>

Query Parameters:
- page (optional): Page number (default: 1)
- limit (optional): Items per page (default: 10, max: 100)

Response includes pagination metadata:
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "from": 1,
    "to": 10
  }
}
```

**Create user (Admin/Moderator only)**
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "user"
}

Role Requirements:
- Only admin and moderator roles can create users
- Only admin role can create admin users
- Moderators can only create user and moderator roles
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
  "first_name": "Updated",
  "last_name": "Name",
  "email": "newemail@example.com",
  "password": "newPassword123",
  "role": "moderator"
}

Authorization Rules:
- Admins can update any user
- Moderators can update any user except admins
- Users can only update their own profile
- Only admins can update admin users
- Only admins can change a user's role to admin
- Regular users cannot change their own role
```

**Delete user (Admin/Moderator only)**
```http
DELETE /api/users/:id
Authorization: Bearer <token>

Authorization Rules:
- Only admins and moderators can delete users
- Admins perform HARD DELETE (permanently removes from database)
- Moderators perform SOFT DELETE (sets deleted_at timestamp)
- Only admins can delete admin users
- Moderators cannot delete admin users

Response (Admin):
{
  "success": true,
  "message": "User permanently deleted successfully"
}

Response (Moderator):
{
  "success": true,
  "message": "User soft deleted successfully"
}
```

### Products

**Get all products**
```http
GET /api/products?page=1&limit=10
x-api-key: your_api_key_here_change_in_production

Query Parameters:
- page (optional): Page number (default: 1)
- limit (optional): Items per page (default: 10, max: 100)

Response includes pagination metadata:
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "from": 1,
    "to": 10
  }
}
```

**Get product by ID**
```http
GET /api/products/:id
x-api-key: your_api_key_here_change_in_production
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

Note: Product title must be unique across all products
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

Authorization Rules:
- Admins can update any product
- Moderators can update any product
- Users can only update products they created
```

**Delete product (Protected)**
```http
DELETE /api/products/:id
Authorization: Bearer <token>

Authorization Rules:
- Admins can delete any product (HARD DELETE - permanently removes from database)
- Moderators can delete any product (SOFT DELETE - sets deleted_at timestamp)
- Users can only delete products they created (SOFT DELETE - sets deleted_at timestamp)

Response (Admin):
{
  "success": true,
  "message": "Product permanently deleted successfully"
}

Response (Moderator/User):
{
  "success": true,
  "message": "Product soft deleted successfully"
}
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
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database (development)
- `npm run db:migrate` - Create and run migrations (production)
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Seeded Data

After running `npm run db:seed`, you'll have:

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
| DB_ENGINE | Database type (mysql/postgresql) | mysql |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_USERNAME | Database user | - |
| DB_PASSWORD | Database password | - |
| DB_NAME | Database name | - |
| JWT_SECRET | JWT secret key | - |
| API_KEY | API key for non-authenticated routes | - |

**Note:** `DATABASE_URL` is automatically constructed from the individual DB_* variables.

## Development vs Production

### Development Mode
- Set `NODE_ENV=development` in `.env`
- Use `npm run db:push` for rapid schema changes
- Prisma logging enabled for debugging

### Production Mode
- Set `NODE_ENV=production` in `.env`
- Use `npm run db:migrate` for version-controlled schema changes
- Deploy migrations with `npm run db:migrate:deploy`

## Testing the API

Use the provided [API_TESTING.md](./API_TESTING.md) file for curl examples, or import the endpoints into Postman/Insomnia.

## License

MIT
