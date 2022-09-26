import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/index.service";
import { userAuthRequest } from "../interfaces/index.interface";

export default {
    /**
     * Add new comment to a specific post
     * 
     * @param req The request  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Success message showing new comment is added
     */
    addPostComment: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const postId = req.params.postId;
            const { comment } = req.body;
            const commentResult = await commentService.createPostComment(userId, postId, comment);
            return res.status(commentResult.statusCode).send({ message: commentResult.message });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Show all comments belong to specific post
     * 
     * @param req The request  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Post comments if exist else failure message    
     */
    showPostComments: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const pageNo = req.query.pageNo as string;
            const size = req.query.size as string;
            const { commentSuccess, commentFailure } = await commentService.showPostComments(postId, pageNo, size);
            if (commentFailure) {
                return res.status(commentFailure.statusCode).send({ message: commentFailure.message });
            }
            return res.status(200).send({ comments: commentSuccess.comments });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Add a reply against an existing comment
     * 
     * @param req The request  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Success message showing reply is added against a comment
     */
    addCommentReply: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const commentId = req.params.id;
            const { comment, postId } = req.body;
            const replyResult = await commentService.createCommentReply(userId, postId, commentId, comment);
            return res.status(replyResult.statusCode).send({ message: replyResult.message });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Show all the replies made against a comment
     * 
     * @param req The request  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns All replies made against a comment else the failure message
     */
    showCommentReplies: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const commentId = req.params.id;
            const { commentSuccess, commentFailure } = await commentService.showCommentReplies(commentId);
            if (commentFailure) {
                return res.status(commentFailure.statusCode).send({ message: commentFailure.message });
            }
            return res.status(200).send({ Replies: commentSuccess.replies });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Like an existing comment
     * 
     * @param req The request  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Success message showing the comment is liked, likes count and users that liked the comment or the failure message
     */
    likeComment: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user._id;
            const commentId: string = req.params.id;
            const { likeSuccess, likeFailure } = await commentService.likeComment(commentId, userId);
            if (likeFailure) {
                return res.status(likeFailure.statusCode).send({ message: likeFailure.message });
            }
            return res.status(200).send(likeSuccess);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Show the comments and its replies posted against a post
     * 
     * @param req The request  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns List of comments or the failure message
     */
    postCommentsReplies: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const pageNo = req.query.pageNo as string;
            const size = req.query.size as string;
            const { commentSuccess, commentFailure } = await commentService.postCommentsReplies(postId, pageNo, size);
            if (commentFailure) {
                return res.status(commentFailure.statusCode).send({ message: commentFailure.message });
            }
            return res.status(200).send({ comments: commentSuccess.comments });
        } catch (error) {
            next(error);
        }
    },

};