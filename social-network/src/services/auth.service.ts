import { authDal } from "../dal/index.dal";
import { iUser } from "../interfaces/index.interface";
import { responseWrapper, passwordHashing } from "../utils/index.util";
import { iResponse, iRegisterBody, iLoginBody } from "../interfaces/index.interface";
import { Socket } from "../sockets/index.sockets";

export default {
    register: async (userToRegister: iRegisterBody) => {
        try {
            const isUserExists: iUser = await authDal.isEmailExists(userToRegister.email, userToRegister.role)
            if (isUserExists) {
                const failure: iResponse = responseWrapper(400, "Email already Exists.");
                return { failure };
            }
            userToRegister.password = await passwordHashing.hashPassword(userToRegister.password);
            if (userToRegister.role === "user") {
                userToRegister.following = [];
            }
            const userRegister: iUser = await authDal.register(userToRegister);
            const token = userRegister.generateAuthToken();
            const id: string = userRegister._id.toString();
            Socket.join(id);
            const user = { message: "User successfully registered.", jwtToken: token }
            return { user };
        } catch (error) {
            throw error;
        }
    },

    login: async (reqUser: iLoginBody) => {
        try {
            const user: iUser = await authDal.login(reqUser.email, reqUser.password, reqUser.role);
            if (user) {
                const token = user.generateAuthToken();
                const loginSuccess = {
                    message: "User successfully logged In.", jwtToken: token
                }
                const id: string = user._id.toString();
                Socket.join(id);
                return { loginSuccess }
            }
            const loginFailure = responseWrapper(401, "Invalid Email, password or role")
            return { loginFailure };
        } catch (error) {
            throw error;
        }
    },
}