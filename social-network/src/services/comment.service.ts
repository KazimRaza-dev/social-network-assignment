import { commentDal, postDal } from "../dal/index.dal";
import { iComment, iPost } from "../interfaces/index.interface";
import { responseWrapper } from "../utils/index.util";

export default {
    createPostComment: async (userId: string, postId: string, comment: string) => {
        try {
            const exists: iPost = await postDal.isPostExists(postId)
            if (!exists) {
                const commentFailure = responseWrapper(404, `Post with Id ${postId} does not Exists.`);
                return { commentFailure };
            }
            const reqComment = { userId, postId, comment };
            const commentAdded: iComment = await commentDal.createPostComment(reqComment);
            const commentSuccess = {
                message: "New comment added on post.",
                comment: commentAdded
            }
            return { commentSuccess };
        } catch (error) {
            throw error;
        }
    },

    showPostComments: async (postId: string) => {
        try {
            const exists: iPost = await postDal.isPostExists(postId)
            if (!exists) {
                const commentFailure = responseWrapper(404, `Post with Id ${postId} does not Exists.`);
                return { commentFailure };
            }
            const comments: iComment[] = await commentDal.showPostComments(postId);
            if (comments.length > 0) {
                const commentSuccess = {
                    comments: comments
                }
                return { commentSuccess };
            }
            const commentFailure = responseWrapper(404, `No more comments found on this post.`);
            return { commentFailure };
        } catch (error) {
            throw error;
        }
    },

    createCommentReply: async (userId: string, postId: string, parentCommentId: string, comment: string) => {
        try {
            const postExists: iPost = await postDal.isPostExists(postId)
            if (!postExists) {
                const commentFailure = responseWrapper(404, `Post with Id ${postId} does not Exists.`);
                return { commentFailure };
            }
            const postComment: iComment = await commentDal.isPostComment(parentCommentId, postId)
            if (!postComment) {
                const commentFailure = responseWrapper(404, `Comment with Id ${parentCommentId} does not Exists on this post.`);
                return { commentFailure };
            }
            const reqComment = { userId, postId, comment, parentCommentId };
            const replyAdded: iComment = await commentDal.createPostComment(reqComment);
            const commentSuccess = {
                message: "Replied to comment.", comment: replyAdded
            }
            return { commentSuccess };
        } catch (error) {
            throw error;
        }
    },

    showCommentReplies: async (commmentId: string) => {
        try {
            const exists: iComment = await commentDal.isCommentExists(commmentId)
            if (!exists) {
                const commentFailure = responseWrapper(404, `Comment with Id ${commmentId} does not Exists.`);
                return { commentFailure };
            }
            const commentReplies: iComment[] = await commentDal.showCommentReplies(commmentId);
            if (commentReplies.length > 0) {
                const commentSuccess = {
                    replies: commentReplies
                }
                return { commentSuccess };
            }
            const commentFailure = responseWrapper(404, `No more replies found on this comment.`);
            return { commentFailure };
        } catch (error) {
            throw error;
        }
    },


};