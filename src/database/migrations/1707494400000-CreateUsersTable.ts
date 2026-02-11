import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1707494400000 implements MigrationInterface {
    name = 'CreateUsersTable1707494400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" VARCHAR(36) NOT NULL,
                "creator_id" VARCHAR(36) NULL,
                "email" VARCHAR(255) NOT NULL,
                "password" VARCHAR(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "deleted_at" TIMESTAMP NULL,
                CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email")
            )
        `);

        // Add self-referencing foreign key for creator
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD CONSTRAINT "FK_users_creator_id" 
            FOREIGN KEY ("creator_id") 
            REFERENCES "users"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);

        // Create index on email for faster lookups
        await queryRunner.query(`
            CREATE INDEX "IDX_users_email" ON "users" ("email")
        `);

        // Create index on creator_id
        await queryRunner.query(`
            CREATE INDEX "IDX_users_creator_id" ON "users" ("creator_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_users_creator_id"`);
        await queryRunner.query(`DROP INDEX "IDX_users_email"`);

        // Drop foreign key
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP CONSTRAINT "FK_users_creator_id"
        `);

        // Drop table
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
