import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTableSetup1609772736454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS article_id_seq;`);
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS article_tag_id_seq;`
    );

    await queryRunner.query(`CREATE TABLE "public"."article" (
      "id" int4 NOT NULL DEFAULT nextval('article_id_seq'::regclass),
      "title" varchar NOT NULL DEFAULT ''::character varying,
      "subtitle" varchar NOT NULL DEFAULT ''::character varying,
      "description" varchar NOT NULL DEFAULT ''::character varying,
      "images" jsonb NOT NULL DEFAULT '[]'::JSONB,
      "authorId" int4 NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id"),
      PRIMARY KEY ("id")
  );`);

    await queryRunner.query(`CREATE TABLE "public"."article_tag" (
      "id" int4 NOT NULL DEFAULT nextval('article_tag_id_seq'::regclass),
      "name" varchar NOT NULL DEFAULT ''::character varying,
      "articleId" int4 NOT NULL,
      CONSTRAINT "FK_602d4921b27c9a7cb6c095992b4" FOREIGN KEY ("articleId") REFERENCES "public"."article"("id"),
      PRIMARY KEY ("id")
  );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
