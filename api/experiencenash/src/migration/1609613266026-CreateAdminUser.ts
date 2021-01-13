import { User } from '../entity/User';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminUser1609613266026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User();
    user.username = 'admin';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'user';
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
