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

    isUserExists: async (userId: string) => {
        try {
            const user: iUser = await User.findOne({ _id: userId });
            return user;
        } catch (error) {
            throw error;
        }
    },

    isFollowing: async (loginUserId: string, followUserId: string) => {
        const user: iUser = await User.findOne()
            .and([{ _id: loginUserId }, { "following": { $elemMatch: { userId: followUserId } } }]);
        return user;
    },

    followUser: async (loginUserId: string, followUserId: string) => {
        try {
            const userFollowed = await User.findByIdAndUpdate(loginUserId, {
                $push: { following: { userId: followUserId } }
            }, { new: true });
            return userFollowed;
        } catch (error) {
            throw error;
        }
    },

    unfollowUser: async (loginUserId: string, followUserId: string) => {
        try {
            const unfollowed = await User.findByIdAndUpdate(loginUserId, {
                $pullAll: {
                    following: [{ userId: followUserId }],
                },
            }, { new: true });
            return unfollowed;
        } catch (error) {
            throw error;
        }
    }
};

export default userDal;