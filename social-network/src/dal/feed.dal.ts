import { iPost, iUser } from "../interfaces/index.interface";
import { Post, User } from "./models/index.model";

export default {
    /**
     * Check if user already exists or not
     * 
     * @param userId Id of user
     * @returns User from datasbase if exists
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
     * Show posts added by all the users that the login user is following
     * 
     * @param userId Id of user
     * @param pageNo Page number passed in query string for paginating records
     * @param pageSize Page size passed in query string for pagination
     * @param sortby Field by which posts will sorted
     * @param order Order of sorting
     * @returns Posts
     */
    showFeed: async (userId: string, pageNo = 1, pageSize = 5, sortby = "_createdAt", order = "asc"): Promise<iPost[]> => {
        try {
            const sortOrder = order === "asc" ? 1 : -1;
            const skip: number = (pageNo - 1) * pageSize;
            const followingUsers = await User.findById(userId).select('following');
            const feedPosts: iPost[] = await Post.find({ "userId": { "$in": followingUsers.following } })
                .sort({ [sortby]: sortOrder }).skip(skip).limit(pageSize);
            return feedPosts;
        } catch (error) {
            throw error;
        }
    }
}
