import { Comment } from "./models/index.model";
import { iComment } from "../interfaces/index.interface";
import mongoose, { ObjectId } from "mongoose";

export default {
    /**
     * Add a new comment against a post
     * 
     * @param postComment New comment passed in request body
     * @returns Comment after adding it to database
     */
    createPostComment: async (postComment): Promise<iComment> => {
        try {
            const newComment = new Comment(postComment);
            const comment: iComment = await newComment.save();
            return comment;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Show all comments of a particular post
     * 
     * @param postId Id of post
     * @param pageNo Page number passed in query string for paginating records
     * @param pageSize Page size passed in query string for pagination
     * @returns Comments belong to particular post
     */
    showPostComments: async (postId: string, pageNo = 1, pageSize = 5): Promise<iComment[]> => {
        try {
            const skip: number = (pageNo - 1) * pageSize;
            const comments = await Comment.find({ postId: postId, parentCommentId: null })
                .limit(pageSize).skip(skip);
            return comments;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Check whether comment belongs to post or not
     * 
     * @param commentId Id of comment
     * @param postId Id of post
     * @returns Comment if comment Id and post Id are correct
     */
    isPostComment: async (commentId: string, postId: string): Promise<iComment> => {
        try {
            const comment = await Comment.findOne()
                .and([{ "_id": commentId }, { "postId": postId }])
            return comment;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Check whether a comment exists in database or not    
     * 
     * @param commentId Id of comment
     * @returns comment if it exists
     */
    isCommentExists: async (commentId: string): Promise<iComment> => {
        try {
            const comment = await Comment.findById(commentId);
            return comment;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Give all replies of a specific comment
     * 
     * @param commentId Id of comment
     * @returns Replies of a comment
     */
    showCommentReplies: async (commentId: string): Promise<iComment[]> => {
        try {
            const comments = await Comment.find({ parentCommentId: commentId });
            return comments;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Check whether a specific user has already liked a comment, if he already liked then remove his like from comment
     * 
     * @param commentId Id of comment
     * @param userId Id of user
     * @returns Comment if it exists
     */
    isAlreadyLiked: async (commentId: string, userId: string): Promise<iComment> => {
        const comment: iComment = await Comment.findOne()
            .and([{ _id: commentId }, { "likes": { $in: [userId] } }]);
        if (comment) {
            await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId }, });
        }
        return comment;
    },
    /**
     * Like a comment
     * 
     * @param commentId Id of comment
     * @param userId Id of user
     * @returns comment after adding the user in likes array of that comment
     */
    likeComment: async (commentId: string, userId: string): Promise<iComment> => {
        try {
            const commentLiked = await Comment.findByIdAndUpdate(commentId, {
                $push: { likes: userId }
            }, { new: true });
            return commentLiked;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Give comments and replies posted on a post
     * 
     * @param postId Id of post
     * @param pageNo page number passed in query string for paginating records
     * @param pageSize page size passed in query string for pagination
     * @returns All comments and replies of a post
     */
    postCommentsReplies: async (postId: string, pageNo = 1, pageSize = 5) => {
        try {
            const skip: number = (pageNo - 1) * pageSize;
            const id = new mongoose.Types.ObjectId(postId);
            const comments = await Comment.aggregate([
                { $match: { parentCommentId: null, postId: id } },
                {
                    $graphLookup: {
                        from: "comments",
                        startWith: "$_id",
                        connectFromField: "_id",
                        connectToField: "parentCommentId",
                        maxDepth: 5,
                        as: "Replies",
                    }
                },
                { $unwind: "$Replies" },
                {
                    $group: {
                        _id: '$Replies.parentCommentId',
                        replies_by_depth: {
                            $push: '$Replies'
                        }
                    }
                },
            ]).skip(skip).limit(pageSize);
            return comments;
        } catch (error) {
            throw error;
        }
    },
}