import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBalanceTable1716087445579 implements MigrationInterface {
    name = 'AddBalanceTable1716087445579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "balance" ("id" SERIAL NOT NULL, "amount" integer NOT NULL DEFAULT '0', "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`);
        // add 50 accounts with balance = 0
        for (let i = 1; i <= 50; i++) {
            await queryRunner.query(`INSERT INTO "balance" ("amount") VALUES ($1)`, [0]);
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "balance"`);
    }

}
