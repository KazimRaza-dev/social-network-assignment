import { userDal } from "../dal/index.dal";
import { iUser } from "../interfaces/index.interface";
import { responseWrapper } from "../utils/index.util";
import { Socket } from "../sockets/index.sockets";

export default {
    /**
     * Follow a new user
     *
     * @param userId Id of logged In user
     * @param followUserId Id of user to follow
     * @returns Sucess message and followed users list or if something went wrong failure message and status code
     */
    followUser: async (userId: string, followUserId: string) => {
        try {
            if (userId === followUserId) {
                const followFailure = responseWrapper(400, "You can't follow yourself.");
                return { followFailure };
            }
            const isUserExists: iUser = await userDal.isUserExists(followUserId)
            if (!isUserExists) {
                const followFailure = responseWrapper(404, `User with Id ${followUserId} does not Exists.`);
                return { followFailure };
            }
            const user: iUser = await userDal.isFollowing(userId, followUserId)
            if (user) {
                const followFailure = responseWrapper(400, `You are already following this User.`);
                return { followFailure };
            }
            const userFollowed: iUser = await userDal.followUser(userId, followUserId);
            Socket.join(followUserId);
            const followSuccess = {
                message: "You are now following this user.",
                "Users you follow:": userFollowed.following
            }
            return { followSuccess };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Unfollow a user
     *
     * @param userId Id of logged In user
     * @param followUserId Id of user to be unfollowed
     * @returns Unfollow message and followed users list if user is successfully unfollowed else failure message
     */
    unfollowUser: async (userId: string, followUserId: string) => {
        try {
            if (userId === followUserId) {
                const unfollowFailure = responseWrapper(400, "You can't unfollow yourself.");
                return { unfollowFailure };
            }
            const isUserExists: iUser = await userDal.isUserExists(followUserId)
            if (!isUserExists) {
                const unfollowFailure = responseWrapper(404, `User with Id ${followUserId} does not Exists.`);
                return { unfollowFailure };
            }
            const user: iUser = await userDal.isFollowing(userId, followUserId)
            if (!user) {
                const unfollowFailure = responseWrapper(400, `You are NOT following this User.`);
                return { unfollowFailure };
            }
            const unfollow: iUser = await userDal.unfollowUser(userId, followUserId);
            const unfollowSuccess = {
                message: "You have unfollowed this user.",
                "Users you follow:": unfollow.following
            }
            return { unfollowSuccess };
        } catch (error) {
            throw error;
        }
    }
}