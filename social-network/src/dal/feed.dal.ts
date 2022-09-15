import { iPost, iUser } from "../interfaces/index.interface";
import { Post, User } from "../models/index.model";

const feedDal = {
    isUserExists: async (userId: string) => {
        try {
            const user: iUser = await User.findOne({ _id: userId });
            return user;
        } catch (error) {
            throw error;
        }
    },

    showFeed: async (userId: string, pageNo: number, pageSize: number, sortby: string, order: string) => {
        try {
            let sortOrder;
            order === "asc" ? sortOrder = 1 : sortOrder = -1;
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

export default feedDal;