import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1707494400000 implements MigrationInterface {
    name = 'CreateUsersTable1707494400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`creator_id\` varchar(36) NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`UQ_users_email\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // Add self-referencing foreign key for creator
        await queryRunner.query(`
            ALTER TABLE \`users\` 
            ADD CONSTRAINT \`FK_users_creator_id\` 
            FOREIGN KEY (\`creator_id\`) 
            REFERENCES \`users\`(\`id\`) 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);

        // Create index on email for faster lookups
        await queryRunner.query(`
            CREATE INDEX \`IDX_users_email\` ON \`users\` (\`email\`)
        `);

        // Create index on creator_id
        await queryRunner.query(`
            CREATE INDEX \`IDX_users_creator_id\` ON \`users\` (\`creator_id\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX \`IDX_users_creator_id\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_users_email\` ON \`users\``);

        // Drop foreign key
        await queryRunner.query(`
            ALTER TABLE \`users\` 
            DROP FOREIGN KEY \`FK_users_creator_id\`
        `);

        // Drop table
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
