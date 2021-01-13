"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdminUser1609613266026 = void 0;
const User_1 = require("src/entity/User");
const typeorm_1 = require("typeorm");
class CreateAdminUser1609613266026 {
    async up(queryRunner) {
        let user = new User_1.User();
        user.username = 'admin';
        user.password = 'admin';
        user.hashPassword();
        user.role = 'ADMIN';
        const userRepository = typeorm_1.getRepository(User_1.User);
        await userRepository.save(user);
    }
    async down(queryRunner) { }
}
exports.CreateAdminUser1609613266026 = CreateAdminUser1609613266026;
//# sourceMappingURL=1609613266026-CreateAdminUser.js.map