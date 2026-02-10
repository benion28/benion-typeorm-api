import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraintToProductTitle1707494900000 implements MigrationInterface {
    name = 'AddUniqueConstraintToProductTitle1707494900000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add unique constraint to product title
        await queryRunner.query(`
            ALTER TABLE \`products\` 
            ADD UNIQUE INDEX \`UQ_products_title\` (\`title\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove unique constraint from product title
        await queryRunner.query(`
            ALTER TABLE \`products\` 
            DROP INDEX \`UQ_products_title\`
        `);
    }
}
