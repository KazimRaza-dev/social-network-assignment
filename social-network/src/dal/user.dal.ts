import { User } from "../models/index.model";
import { iUser } from "../interfaces/index.interface";

export default {
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
            .and([{ _id: loginUserId }, { "following": followUserId }]);
        return user;
    },

    followUser: async (loginUserId: string, followUserId: string) => {
        try {
            const userFollowed = await User.findByIdAndUpdate(loginUserId, {
                $push: { following: followUserId }
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
                    following: [followUserId],
                },
            }, { new: true });
            return unfollowed;
        } catch (error) {
            throw error;
        }
    }
};
