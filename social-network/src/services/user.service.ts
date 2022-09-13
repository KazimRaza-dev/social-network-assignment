import { userDal } from "../dal/index.dal";
import { iUser } from "../interfaces/index.interface";
import { responseWrapper, passwordHashing } from "../utils/index.util";
import { iResponse } from "../interfaces/index.interface";

const userService = {
    register: async (userToRegister) => {
        try {
            const isUserExists: iUser = await userDal.isEmailExists(userToRegister.email)
            if (isUserExists) {
                const failure: iResponse = responseWrapper(400, "Email already Exists.");
                return { failure };
            }
            userToRegister.password = await passwordHashing.hashPassword(userToRegister.password);
            const user: iUser = await userDal.register(userToRegister);
            const userRegistered = {
                message: "User successfully registered.",
                user: user
            }
            return { userRegistered };
        } catch (error) {
            throw error;
        }
    },

    login: async (reqUser) => {
        try {
            const user: iUser = await userDal.login(reqUser.email, reqUser.password, reqUser.role);
            if (user) {
                const loginSuccess = {
                    message: "User successfully logged In",
                    user: user,
                }
                return { loginSuccess }
            }
            const loginFailure = responseWrapper(401, "Invalid Email, password or role")
            return { loginFailure };
        } catch (error) {
            throw error;
        }
    },

    followUser: async (userId: string, followUserId: string) => {
        try {
            if (userId === followUserId) {
                const followFailure = responseWrapper(400, "You can't follow yourself.");
                return { followFailure };
            }
            const isFollowed = await userDal.followUser(userId, followUserId);
            if (!isFollowed) {
                const followFailure = responseWrapper(404, `User with Id ${followUserId} does not Exists.`);
                return { followFailure };
            }
            const followSuccess = {
                message: "User followed",
                user: isFollowed
            }
            return { followSuccess };
        } catch (error) {
            throw error;
        }
    }
}

export default userService;