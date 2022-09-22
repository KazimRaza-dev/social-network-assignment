import { commentDal, postDal } from "../dal/index.dal";
import { iComment, iPost, iResponse } from "../interfaces/index.interface";
import { responseWrapper } from "../utils/index.util";

export default {
    createPostComment: async (userId: string, postId: string, comment: string) => {
        try {
            const exists: iPost = await postDal.isPostExists(postId)
            if (!exists) {
                return responseWrapper(404, `Post with Id ${postId} does not Exists.`);
            }
            const reqComment = { userId, postId, comment };
            await commentDal.createPostComment(reqComment);
            return responseWrapper(200, `New comment added on post.`);
        } catch (error) {
            throw error;
        }
    },

    showPostComments: async (postId: string, pageno: string, pageSize: string) => {
        try {
            const exists: iPost = await postDal.isPostExists(postId)
            if (!exists) {
                const commentFailure: iResponse = responseWrapper(404, `Post with Id ${postId} does not Exists.`);
                return { commentFailure };
            }
            const pageNo = pageno && parseInt(pageno);
            const size = pageSize && parseInt(pageSize);
            const comments: iComment[] = await commentDal.showPostComments(postId, pageNo, size);
            if (comments.length > 0) {
                const commentSuccess = {
                    comments: comments
                }
                return { commentSuccess };
            }
            const commentFailure: iResponse = responseWrapper(404, `No more comments found on this post.`);
            return { commentFailure };
        } catch (error) {
            throw error;
        }
    },

    createCommentReply: async (userId: string, postId: string, parentCommentId: string, comment: string) => {
        try {
            const postExists: iPost = await postDal.isPostExists(postId)
            if (!postExists) {
                return responseWrapper(404, `Post with Id ${postId} does not Exists.`);
            }
            const postComment: iComment = await commentDal.isPostComment(parentCommentId, postId)
            if (!postComment) {
                return responseWrapper(404, `Comment with Id ${parentCommentId} does not Exists on this post.`);
            }
            const reqComment = { userId, postId, comment, parentCommentId };
            await commentDal.createPostComment(reqComment);
            return responseWrapper(200, `Replied to comment.`);
        } catch (error) {
            throw error;
        }
    },

    showCommentReplies: async (commmentId: string) => {
        try {
            const exists: iComment = await commentDal.isCommentExists(commmentId)
            if (!exists) {
                const commentFailure: iResponse = responseWrapper(404, `Comment with Id ${commmentId} does not Exists.`);
                return { commentFailure };
            }
            const commentReplies: iComment[] = await commentDal.showCommentReplies(commmentId);
            if (commentReplies.length > 0) {
                const commentSuccess = {
                    replies: commentReplies
                }
                return { commentSuccess };
            }
            const commentFailure: iResponse = responseWrapper(404, `No more replies found on this comment.`);
            return { commentFailure };
        } catch (error) {
            throw error;
        }
    },

    likeComment: async (commentId: string, userId: string) => {
        try {
            const exists: iComment = await commentDal.isCommentExists(commentId)
            if (!exists) {
                const likeFailure: iResponse = responseWrapper(404, `Comment with Id ${commentId} does not Exists.`);
                return { likeFailure };
            }
            const isLiked: iComment = await commentDal.isAlreadyLiked(commentId, userId)
            if (isLiked) {
                const likeFailure = responseWrapper(200, 'Like removed from this Comment.');
                return { likeFailure };
            }
            const commentLiked: iComment = await commentDal.likeComment(commentId, userId);
            const count = commentLiked.likes.length;
            const likeSuccess = {
                message: "You have liked this Comment.", "Total likes Count": count, "User that like": commentLiked.likes
            }
            return { likeSuccess };
        } catch (error) {
            throw error;
        }
    },

    postCommentsReplies: async (postId: string, pageno: string, pageSize: string) => {
        try {
            const exists: iPost = await postDal.isPostExists(postId)
            if (!exists) {
                const commentFailure: iResponse = responseWrapper(404, `Post with Id ${postId} does not Exists.`);
                return { commentFailure };
            }
            const pageNo = pageno && parseInt(pageno);
            const size = pageSize && parseInt(pageSize);
            const comments = await commentDal.postCommentsReplies(postId, pageNo, size);
            if (comments.length > 0) {
                const commentSuccess = {
                    comments: comments
                }
                return { commentSuccess };
            }
            const commentFailure: iResponse = responseWrapper(404, `No more comments found on this post.`);
            return { commentFailure };
        } catch (error) {
            throw error;
        }
    },
};