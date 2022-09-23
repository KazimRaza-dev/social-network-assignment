import { Comment } from "./models/index.model";
import { iComment } from "../interfaces/index.interface";

export default {
    createPostComment: async (postComment): Promise<iComment> => {
        try {
            const newComment = new Comment(postComment);
            const comment: iComment = await newComment.save();
            return comment;
        } catch (error) {
            throw error;
        }
    },

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

    isPostComment: async (commentId: string, postId: string): Promise<iComment> => {
        try {
            const comment = await Comment.findOne()
                .and([{ "_id": commentId }, { "postId": postId }])
            return comment;
        } catch (error) {
            throw error;
        }
    },

    isCommentExists: async (commentId: string): Promise<iComment> => {
        try {
            const comment = await Comment.findById(commentId);
            return comment;
        } catch (error) {
            throw error;
        }
    },

    showCommentReplies: async (commentId: string): Promise<iComment[]> => {
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

    postCommentsReplies: async (postId: string, pageNo = 1, pageSize = 5) => {
        try {
            const skip: number = (pageNo - 1) * pageSize;
            const comments = await Comment.find({ postId: postId, parentCommentId: null })
                .limit(pageSize).skip(skip);
            const commentReplies = Promise.all(
                comments.map(async (single) => {
                    const singleComment = { userId: single.userId, comment: single.comment, 'Total likes': single.likes.length, 'posted At': single.postedAt, replies: [] }
                    const replies = await Comment.find({ parentCommentId: single._id }).select('userId comment likes postedAt')
                    singleComment.replies = replies;
                    return singleComment;
                })
            )
            return commentReplies;
        } catch (error) {
            throw error;
        }
    },
}