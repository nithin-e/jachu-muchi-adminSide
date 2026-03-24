"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../../models/User");
class UserRepository {
    async findByEmail(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User_1.UserModel.findOne({ email: normalizedEmail }).lean();
        if (!user) {
            return null;
        }
        return {
            id: user._id.toString(),
            email: user.email,
            password: user.password,
            role: user.role,
        };
    }
}
exports.UserRepository = UserRepository;
