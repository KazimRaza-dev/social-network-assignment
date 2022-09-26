import { commentDal, postDal } from "../dal/index.dal";
import { iComment, iPost, iResponse } from "../interfaces/index.interface";
import { responseWrapper } from "../utils/index.util";

export default {
    /**
     * Create a new comment on post
     *
     * @param userId Id of user adding a comment
     * @param postId Id of post where comment is adding
     * @param comment Description of comment
     * @returns Success message and status code if comment is added and failure message and status code in case of failure
     */
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

    /**
     * Show all comments of a specific post 
     *
     * @param postId Id of post
     * @param pageno Page number for paginating records
     * @param pageSize Page size for pagination
     * @returns Post comments if they exists or failure message in case of failure
     */
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

    /**
     * Create a reply to a specific comment
     *
     * @param userId Id of user
     * @param postId Id of post
     * @param parentCommentId Id of comment whose reply is adding
     * @param comment Body of comment
     * @returns Success message if reply is added or failure message
     */
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

    /**
     * Show all replies of a specific comment
     *
     * @param commmentId Id of comment
     * @returns Replies of comment if they exists else failure message
     */
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

    /**
     * Like a comment
     *
     * @param commentId Id of comment to be liked
     * @param userId Id of user liking the comment
     * @returns Sucsess message and total likes along with the users Id in case of sucess or failure message
     */
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

    /**
     * Give all the replies posted against a specific comment.
     *
     * @param postId Id of post
     * @param pageno Page number for paginating the records
     * @param pageSize Size of page for pagination
     * @returns Replies of a particular comment if they exists else failure message with status code
     */
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