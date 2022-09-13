import { User } from "../models/index.model";
import { iUser } from "../interfaces/index.interface";
import { passwordHashing } from "../utils/index.util";

const userDal = {
    isEmailExists: async (userEmail: string) => {
        try {
            const isUserExists: iUser = await User.findOne({ email: userEmail });
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

    followUser: async (loginUserId: string, followUserId: string) => {
        try {
            const isUserExists = await User.findOne({ _id: followUserId });
            if (!isUserExists) {
                return null;
            }

            const isAlreadyFollowed = await User.findOne()
                .or([{ _id: loginUserId }, { "following": { $elemMatch: { userId: followUserId } } }])
            if (isAlreadyFollowed) {
                console.log("Already followd");
                return null;
            }
            console.log(isAlreadyFollowed);


            const userFollowed = await User.findByIdAndUpdate(loginUserId, {
                $push: { following: { userId: followUserId } }
            }, { new: true });
            return userFollowed;
        } catch (error) {
            throw error;
        }
    }
};

export default userDal;