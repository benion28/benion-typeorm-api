import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNamesToUsers1707494800000 implements MigrationInterface {
  name = "AddNamesToUsers1707494800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add first_name column
    await queryRunner.query(`
            ALTER TABLE \`users\` 
            ADD COLUMN \`first_name\` varchar(255) NOT NULL DEFAULT ''
        `);

    // Add last_name column
    await queryRunner.query(`
            ALTER TABLE \`users\` 
            ADD COLUMN \`last_name\` varchar(255) NOT NULL DEFAULT ''
        `);

    // Create index on first_name for search
    await queryRunner.query(`
            CREATE INDEX \`IDX_users_first_name\` ON \`users\` (\`first_name\`)
        `);

    // Create index on last_name for search
    await queryRunner.query(`
            CREATE INDEX \`IDX_users_last_name\` ON \`users\` (\`last_name\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX \`IDX_users_last_name\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_users_first_name\` ON \`users\``);

    // Drop columns
    await queryRunner.query(`
            ALTER TABLE \`users\` 
            DROP COLUMN \`last_name\`
        `);

    await queryRunner.query(`
            ALTER TABLE \`users\` 
            DROP COLUMN \`first_name\`
        `);
  }
}
