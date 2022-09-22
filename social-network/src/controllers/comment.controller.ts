import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/index.service";
import { userAuthRequest } from "../interfaces/index.interface";

export default {
    addPostComment: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const postId = req.params.postId;
            const { comment } = req.body;
            const commentResult = await commentService.createPostComment(userId, postId, comment);
            return res.status(commentResult.statusCode).send(commentResult.message);
        } catch (error) {
            next(error);
        }
    },

    showPostComments: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const pageNo = req.query.pageNo as string;
            const size = req.query.size as string;
            const { commentSuccess, commentFailure } = await commentService.showPostComments(postId, pageNo, size);
            if (commentFailure) {
                return res.status(commentFailure.statusCode).send(commentFailure.message);
            }
            return res.status(200).send(commentSuccess.comments);
        } catch (error) {
            next(error);
        }
    },

    addCommentReply: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const commentId = req.params.id;
            const { comment, postId } = req.body;
            const replyResult = await commentService.createCommentReply(userId, postId, commentId, comment);
            return res.status(replyResult.statusCode).send(replyResult.message);
        } catch (error) {
            next(error);
        }
    },

    showCommentReplies: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const commentId = req.params.id;
            const { commentSuccess, commentFailure } = await commentService.showCommentReplies(commentId);
            if (commentFailure) {
                return res.status(commentFailure.statusCode).send(commentFailure.message);
            }
            return res.status(200).send(commentSuccess.replies);
        } catch (error) {
            next(error);
        }
    },

    likeComment: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user._id;
            const commentId: string = req.params.id;
            const { likeSuccess, likeFailure } = await commentService.likeComment(commentId, userId);
            if (likeFailure) {
                return res.status(likeFailure.statusCode).send(likeFailure.message);
            }
            return res.status(200).send(likeSuccess);
        } catch (error) {
            next(error);
        }
    },

    postCommentsReplies: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const pageNo = req.query.pageNo as string;
            const size = req.query.size as string;
            const { commentSuccess, commentFailure } = await commentService.postCommentsReplies(postId, pageNo, size);
            if (commentFailure) {
                return res.status(commentFailure.statusCode).send(commentFailure.message);
            }
            return res.status(200).send(commentSuccess.comments);
        } catch (error) {
            next(error);
        }
    },

};