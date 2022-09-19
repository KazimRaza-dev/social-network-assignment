import { User } from "../models/index.model";
import { iUser } from "../interfaces/index.interface";
import { passwordHashing } from "../utils/index.util";

export default {
    isEmailExists: async (userEmail: string, userRole: string) => {
        try {
            const isUserExists: iUser = await User.findOne({ email: userEmail, role: userRole });
            return isUserExists;
        } catch (error) {
            throw error;
        }
    },

    register: async (reqUser) => {
        try {
            const newUser: iUser = new User(reqUser);
            const user: iUser = await newUser.save();
            return user;
        } catch (error) {
            throw error;
        }
    },

    login: async (email: string, password: string, userRole: string): Promise<iUser> => {
        try {
            const user: iUser = await User.findOne({ email: email, role: userRole });
            if (user) {
                const isPasswordCorrect = await passwordHashing.unhashPassword(password, user.password);
                if (isPasswordCorrect) {
                    return user;
                }
                return null;
            }
            return user;
        } catch (error) {
            throw error;
        }
    },

}