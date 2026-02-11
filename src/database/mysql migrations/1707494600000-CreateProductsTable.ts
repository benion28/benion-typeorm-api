import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1707494600000 implements MigrationInterface {
    name = 'CreateProductsTable1707494600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create products table
        await queryRunner.query(`
            CREATE TABLE \`products\` (
                \`id\` varchar(36) NOT NULL,
                \`creator_id\` varchar(36) NOT NULL,
                \`title\` varchar(255) NOT NULL,
                \`price\` decimal(10,2) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // Add foreign key constraint to users table
        await queryRunner.query(`
            ALTER TABLE \`products\` 
            ADD CONSTRAINT \`FK_products_creator_id\` 
            FOREIGN KEY (\`creator_id\`) 
            REFERENCES \`users\`(\`id\`) 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION
        `);

        // Create index on creator_id for faster joins
        await queryRunner.query(`
            CREATE INDEX \`IDX_products_creator_id\` 
            ON \`products\` (\`creator_id\`)
        `);

        // Create index on title for search
        await queryRunner.query(`
            CREATE INDEX \`IDX_products_title\` 
            ON \`products\` (\`title\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX \`IDX_products_title\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_products_creator_id\` ON \`products\``);

        // Drop foreign key
        await queryRunner.query(`
            ALTER TABLE \`products\` 
            DROP FOREIGN KEY \`FK_products_creator_id\`
        `);

        // Drop table
        await queryRunner.query(`DROP TABLE \`products\``);
    }
}
