import { iPost, iUser } from "../interfaces/index.interface";
import { Post, User } from "./models/index.model";

export default {
    isUserExists: async (userId: string): Promise<iUser> => {
        try {
            const user: iUser = await User.findOne({ _id: userId });
            return user;
        } catch (error) {
            throw error;
        }
    },

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
