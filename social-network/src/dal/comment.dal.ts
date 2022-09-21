import { Comment } from "../models/index.model";
import { iComment } from "../interfaces/index.interface";

export default {
    createPostComment: async (postComment) => {
        try {
            const newComment = new Comment(postComment);
            const comment: iComment = await newComment.save();
            return comment;
        } catch (error) {
            throw error;
        }
    },

    showPostComments: async (postId: string) => {
        try {
            const comments = await Comment.find({ postId: postId, parentCommentId: null });
            return comments;
        } catch (error) {
            throw error;
        }
    },

    isPostComment: async (commentId: string, postId: string) => {
        try {
            const comment = await Comment.findOne()
                .and([{ "_id": commentId }, { "postId": postId }])

            return comment;
        } catch (error) {
            throw error;
        }
    },

    isCommentExists: async (commentId: string) => {
        try {
            const comment = await Comment.findById(commentId);
            return comment;
        } catch (error) {
            throw error;
        }
    },

    showCommentReplies: async (commentId: string) => {
        try {
            const comments = await Comment.find({ parentCommentId: commentId });
            return comments;
        } catch (error) {
            throw error;
        }
    },
}