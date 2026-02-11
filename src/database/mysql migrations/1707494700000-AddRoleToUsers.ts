import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUsers1707494700000 implements MigrationInterface {
  name = "AddRoleToUsers1707494700000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add role column to users table
    await queryRunner.query(`
            ALTER TABLE \`users\` 
            ADD COLUMN \`role\` enum('admin', 'moderator', 'user') NOT NULL DEFAULT 'user'
        `);

    // Create index on role for faster filtering
    await queryRunner.query(`
            CREATE INDEX \`IDX_users_role\` ON \`users\` (\`role\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX \`IDX_users_role\` ON \`users\``);

    // Drop role column
    await queryRunner.query(`
            ALTER TABLE \`users\` 
            DROP COLUMN \`role\`
        `);
  }
}
