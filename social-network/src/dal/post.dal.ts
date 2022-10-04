import { iPost, iPostBody, iEditPostBody } from "../interfaces/index.interface";
import { Post } from "./models/index.model";

export default {
    /**
     * Create a new post
     * 
     * @param reqPost Post data passed in request body
     * @returns New post after adding to database
     */
    create: async (reqPost: iPostBody): Promise<iPost> => {
        try {
            const newPost = new Post(reqPost);
            return newPost.save();
        } catch (error) {
            throw error;
        }
    },
    /**
     * Check if the post exists in database or not
     * 
     * @param postId Id of post
     * @returns Post if it exist
     */
    isPostExists: async (postId: string): Promise<iPost> => {
        try {
            return Post.findById(postId).select('userId');
        } catch (error) {
            throw error;
        }
    },
    /**
     * Update already existing post 
     * 
     * @param postId Id of post to update
     * @param reqPost Data to be updated
     * @returns Updated post
     */
    update: async (postId: string, reqPost: iEditPostBody): Promise<iPost> => {
        try {
            return Post.findByIdAndUpdate(postId, reqPost, {
                new: true
            });
        } catch (error) {
            throw error;
        }
    },
    /**
     * Delete a post   
     * 
     * @param postId Id of post to delete
     * @returns Post after deleting it from database
     */
    delete: async (postId: string): Promise<iPost> => {
        try {
            return Post.findByIdAndDelete(postId);
        } catch (error) {
            throw error;
        }
    },
    /**
     * Give post whose Id is passed
     * 
     * @param postId Id of post
     * @returns Single post if it exists    
     */
    getSinglePost: async (postId: string): Promise<iPost> => {
        try {
            return Post.findById(postId);
        } catch (error) {
            throw error;
        }
    },
    /**
     * Give all posts belong to user    
     * 
     * @param userId Id of user
     * @param pageNo Page number for paginating the records
     * @param pageSize Page Size for pagination
     * @returns All posts belongs to user
     */
    getUserPosts: async (userId: string, pageNo = 1, pageSize = 5): Promise<iPost[]> => {
        try {
            const skip: number = (pageNo - 1) * pageSize;
            return Post.find({ userId: userId }).select('title description likes dislikes _createdAt').skip(skip).limit(pageSize);
        } catch (error) {
            throw error;
        }
    },
    /**
     * Check whether a user has already liked a post, if he already like then remove his like from post
     * 
     * @param postId Id of post
     * @param userId Id of user that is liking the post
     * @returns Post 
     */
    isAlreadyLiked: async (postId: string, userId: string): Promise<iPost> => {
        return Post.findOneAndUpdate(
            { _id: postId, "likes": { $in: [userId] } },
            { $pull: { likes: userId } }, { new: true }
        )
    },
    /**
     * Add like of user to post
     * 
     * @param postId Id of post to like
     * @param userId Id of user liking the post
     * @returns Post after adding the user like
     */
    likePost: async (postId: string, userId: string) => {
        try {
            return Post.findByIdAndUpdate(postId, {
                $push: { likes: userId }
            }, { new: true });
        } catch (error) {
            throw error;
        }
    },
    /**
     * Check whether a user has already disliked a post, if he already disliked then remove his dislike from post
     * 
     * @param postId Id of post
     * @param userId Id of user that is disliking the post
     * @returns Post 
     */
    isAlreadyDisliked: async (postId: string, userId: string): Promise<iPost> => {
        return Post.findOneAndUpdate(
            { _id: postId, "dislikes": { $in: [userId] } },
            { $pull: { dislikes: userId } }, { new: true }
        )
    },
    /**
     * Add dislike of user to post
     * 
     * @param postId Id of post to dislike
     * @param userId Id of user disliking the post
     * @returns Post after adding the user dislike
     */
    dislikePost: async (postId: string, userId: string) => {
        try {
            return Post.findByIdAndUpdate(postId, {
                $push: { dislikes: userId }
            }, { new: true });
        } catch (error) {
            throw error;
        }
    },
}