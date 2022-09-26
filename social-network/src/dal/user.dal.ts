import { User } from "./models/index.model";
import { iUser } from "../interfaces/index.interface";

export default {
    /**
     * Check whether a user exists or not   
     * 
     * @param userId Id of user to check
     * @returns User object if it exists
     */
    isUserExists: async (userId: string): Promise<iUser> => {
        try {
            const user: iUser = await User.findOne({ _id: userId });
            return user;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Check whether the logged In user is already following the other user or not
     * 
     * @param loginUserId Id of user who wants to follow other user
     * @param followUserId Id of user to be followed
     * @returns user object if it exists
     */
    isFollowing: async (loginUserId: string, followUserId: string): Promise<iUser> => {
        const user: iUser = await User.findOne()
            .and([{ _id: loginUserId }, { "following": followUserId }]);
        return user;
    },
    /**
     * Follow other user
     * 
     * @param loginUserId Id of user who wants to follow other user
     * @param followUserId Id of user to be followed
     * @returns user object from database after following the user 
     */
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
    /**
     * Unfollow already following user
     * 
     * @param loginUserId Id of user who wants to unfollow other user
     * @param followUserId Id of already following user
     * @returns user object from database after unfollowing the following user 
     */
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
    },

    /**
     * Give a list of all the users a user is following
     * 
     * @param userId Id of logged In user
     * @returns list of user Ids a user is following
     */
    getFollowedUsers: async (userId: string): Promise<string[]> => {
        try {
            const user = await User.findById(userId).select('following');
            return user.following;
        } catch (error) {
            throw error;
        }
    }
};