# Prisma Schema Files

This directory contains multiple Prisma schema files to support different database engines.

## Files

- **schema.mysql.prisma** - MySQL database configuration (source file)
- **schema.postgresql.prisma** - PostgreSQL database configuration (source file)
- **schema.prisma** - Active schema (auto-generated, do not edit directly)
- **seed.ts** - Database seeding script

## How It Works

The `schema.prisma` file is automatically generated based on your `DB_ENGINE` environment variable:

- When `DB_ENGINE=mysql`, the content of `schema.mysql.prisma` is copied to `schema.prisma`
- When `DB_ENGINE=postgresql`, the content of `schema.postgresql.prisma` is copied to `schema.prisma`

## Making Schema Changes

**Important:** Do not edit `schema.prisma` directly!

1. Edit the appropriate source file:
   - For MySQL: edit `schema.mysql.prisma`
   - For PostgreSQL: edit `schema.postgresql.prisma`
   - For both: edit both files to keep them in sync

2. Run the schema switch command:
   ```bash
   npm run schema:switch
   ```

3. Or run any database command (which automatically switches):
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:migrate
   ```

## Switching Databases

To switch from MySQL to PostgreSQL (or vice versa):

1. Update your `.env` file:
   ```env
   DB_ENGINE=postgresql  # or mysql
   DB_HOST=localhost
   DB_PORT=5432          # 5432 for PostgreSQL, 3306 for MySQL
   DB_USERNAME=postgres  # or root for MySQL
   DB_PASSWORD=your_password
   DB_NAME=your_database
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/your_database"
   ```

2. Run the schema switch:
   ```bash
   npm run schema:switch
   ```

3. Push the schema to your database:
   ```bash
   npm run db:push
   ```

## Git

The `schema.prisma` file is ignored by git (see `.gitignore`) because it's auto-generated. Only the source files (`schema.mysql.prisma` and `schema.postgresql.prisma`) are tracked in version control.
