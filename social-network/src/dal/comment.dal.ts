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

    showPostComments: async (postId: string, pageNo = 1, pageSize = 5) => {
        try {
            const skip: number = (pageNo - 1) * pageSize;
            const comments = await Comment.find({ postId: postId, parentCommentId: null })
                .limit(pageSize).skip(skip);
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

    isAlreadyLiked: async (commentId: string, userId: string): Promise<iComment> => {
        const comment: iComment = await Comment.findOne()
            .and([{ _id: commentId }, { "likes": { $in: [userId] } }]);
        if (comment) {
            await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId }, });
        }
        return comment;
    },

    likeComment: async (commentId: string, userId: string) => {
        try {
            const commentLiked = await Comment.findByIdAndUpdate(commentId, {
                $push: { likes: userId }
            }, { new: true });
            return commentLiked;
        } catch (error) {
            throw error;
        }
    }
}