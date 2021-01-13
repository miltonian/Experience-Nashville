import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTableSetup1609772736454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE article (
        id bigint unsigned NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        subtitle varchar(255) NOT NULL,
        description longtext NOT NULL,
        images json NOT NULL,
        authorId int(11),
        createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY id (id),
        FOREIGN KEY (authorId) REFERENCES User(id)
      )`);

    await queryRunner.query(`CREATE TABLE tag (
        id bigint unsigned NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY id (id)
      )`);

    await queryRunner.query(`CREATE TABLE article_tag (
        id bigint unsigned NOT NULL AUTO_INCREMENT,
        articleId bigint unsigned NOT NULL,
        tagId bigint unsigned NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY FK_12I7346912736498_unique_article_tag (name,articleId) USING BTREE,
        CONSTRAINT FK_ArticleTag_Article FOREIGN KEY (articleId) REFERENCES article (id) ON DELETE CASCADE,
        CONSTRAINT FK_ArticleTag_Tag FOREIGN KEY (tagId) REFERENCES tag (id) ON DELETE CASCADE
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
