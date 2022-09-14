import { iPost } from "../interfaces/index.interface";
import { Post } from "../models/index.model";

const postDal = {
    create: async (reqPost): Promise<iPost> => {
        try {
            const newPost = new Post(reqPost);
            const post: iPost = await newPost.save();
            return post;
        } catch (error) {
            throw error;
        }
    },

    isPostExists: async (postId: string): Promise<iPost> => {
        try {
            const post: iPost = await Post.findById(postId).select('userId');
            return post;
        } catch (error) {
            throw error;
        }
    },

    update: async (postId: string, reqPost): Promise<iPost> => {
        try {
            const post: iPost = await Post.findByIdAndUpdate(postId, reqPost, {
                new: true
            });
            return post;
        } catch (error) {
            throw error;
        }
    },

    delete: async (postId: string): Promise<iPost> => {
        try {
            const postdeleted: iPost = await Post.findByIdAndDelete(postId);
            return postdeleted;
        } catch (error) {
            throw error;
        }
    },

    getUserPosts: async (userId: string, pageNo: number, pageSize: number): Promise<iPost[]> => {
        try {
            const skip: number = (pageNo - 1) * pageSize;
            const userPosts: iPost[] = await Post.find({ userId: userId }).select('title description _createdAt').skip(skip).limit(pageSize);
            return userPosts;
        } catch (error) {
            throw error;
        }
    },

}

export default postDal;