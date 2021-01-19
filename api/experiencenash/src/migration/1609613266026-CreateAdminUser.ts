import { User } from '../entity/User';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminUser1609613266026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS user_id_seq;`);

    await queryRunner.query(
      `CREATE TABLE "public"."user" (
        "id" int4 NOT NULL DEFAULT nextval('user_id_seq'::regclass),
        "username" varchar NOT NULL,
        "password" varchar NOT NULL,
        "role" varchar NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
    
);`
    );
    queryRunner.commitTransaction();

    let user = new User();
    user.username = 'admin';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'user';
    const userRepository = getRepository(User);
    await userRepository.save(user);

    queryRunner.startTransaction();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
