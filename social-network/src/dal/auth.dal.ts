import { User } from "./models/index.model";
import { iUser, iRegisterBody } from "../interfaces/index.interface";
import { passwordHashing } from "../utils/index.util";

export default {
    /**
     * Check whether email already exists in database or not
     * 
     * @param userEmail - Email of user
     * @param  userRole - Role of user. Can be either user or moderator
     * @returns - User object from database if exists
     */
    isEmailExists: async (userEmail: string, userRole: string): Promise<iUser> => {
        try {
            const isUserExists: iUser = await User.findOne({ email: userEmail, role: userRole });
            return isUserExists;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Register a new user
     * 
     * @param reqUser user object passed in request body
     * @returns user after adding it to database
     */
    register: async (reqUser: iRegisterBody): Promise<iUser> => {
        try {
            const newUser: iUser = new User(reqUser);
            const user: iUser = await newUser.save();
            return user;
        } catch (error) {
            throw error;
        }
    },
    /**
     * check login credientials of a user
     * 
     * @param email email passed in request body    
     * @param password password of user 
     * @param userRole role of user, either user or moderator
     * @returns user if credientials are correct and null if they are not correct
     */
    login: async (email: string, password: string, userRole: string): Promise<iUser> => {
        try {
            const user: iUser = await User.findOne({ email: email, role: userRole });
            if (user) {
                const isPasswordCorrect = await passwordHashing.comparePassword(password, user.password);
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