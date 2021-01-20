import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdTable1611068126132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS ad_id_seq;`);

    await queryRunner.query(`CREATE TABLE "public"."ad" (
            "id" int4 NOT NULL DEFAULT nextval('ad_id_seq'::regclass),
            "name" varchar NOT NULL DEFAULT ''::character varying,
            "imagepath" varchar NOT NULL DEFAULT ''::character varying,
            "impressions" int4 NOT NULL DEFAULT 0,
            PRIMARY KEY ("id")
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
