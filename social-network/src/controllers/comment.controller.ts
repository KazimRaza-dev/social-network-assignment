import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/index.service";
import { userAuthRequest } from "../interfaces/index.interface";

export default {
    addPostComment: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const postId = req.params.postId;
            const { comment } = req.body;
            const { commentSuccess, commentFailure } = await commentService.createPostComment(userId, postId, comment);
            if (commentFailure) {
                return res.status(commentFailure.statusCode).send(commentFailure.message);
            }
            return res.status(200).send(commentSuccess);
        } catch (error) {
            next(error);
        }
    },

    showPostComments: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const { commentSuccess, commentFailure } = await commentService.showPostComments(postId);
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
            const { commentSuccess, commentFailure } = await commentService.createCommentReply(userId, postId, commentId, comment);
            if (commentFailure) {
                return res.status(commentFailure.statusCode).send(commentFailure.message);
            }
            return res.status(200).send(commentSuccess);
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



};