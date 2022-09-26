import { Response, NextFunction } from "express";
import { pick } from "lodash";
import { iPostBody, iEditPostBody } from "../interfaces/index.interface";
import { postService } from "../services/index.service";
import { userAuthRequest } from "../interfaces/index.interface";

export default {
    /**
     * Add a new post in database
     * 
     * @param req The request along with the jwt token of the user passed in request header
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Success message after adding a post
     */
    addPost: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const reqPost: iPostBody = pick(req.body, ['title', 'description']);
            reqPost.userId = req.user._id;
            const { newPost } = await postService.createPost(reqPost);
            return res.status(200).send({
                message: newPost.message
            });
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Update already existing post
     * 
     * @param req The request along with the jwt token of the user passed in request header
     * @param res The reponse   
     * @param next Method to call the next middleware 
     * @returns Updated post along with the success message or the failure message
     */
    updatePost: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const tokenUserId: string = req.user._id;
            const userRole: string = req.user.role;
            const postId: string = req.params.id;
            const reqPost: iEditPostBody = req.body;
            const { post, failure } = await postService.update(postId, reqPost, tokenUserId, userRole);
            if (failure) {
                return res.status(failure.statusCode).send({ message: failure.message });
            }
            return res.status(200).send({
                message: post.message, post: post.updated
            })
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Delete an existing post
     * 
     * @param req The request along with the jwt token of the user passed in request header  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Success message after deleting the post or failure message if it does not exists
     */
    deletePost: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const tokenUserId: string = req.user._id;
            const userRole: string = req.user.role;
            const postId: string = req.params.id;

            const { post, failure } = await postService.delete(postId, tokenUserId, userRole);
            if (failure) {
                return res.status(failure.statusCode).send({ message: failure.message });
            }
            return res.status(200).json({
                message: post.message
            })
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Give a single post of a user
     * 
     * @param req The request along with the jwt token of the user passed in request header  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Single post if exists or the failure message
     */
    getSinglePost: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const tokenUserId: string = req.user._id;
            const userRole: string = req.user.role;
            const postId: string = req.params.id;
            const { post, failure } = await postService.getSinglePost(postId, tokenUserId, userRole);
            if (failure) {
                return res.status(failure.statusCode).send({ message: failure.message });
            }
            return res.status(200).json({ post: post })
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Give all the existing posts of a user
     * 
     * @param req The request along with the jwt token of the user passed in request header  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns lists of posts if exist or the failure message
     */
    getUserPosts: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const tokenUserId: string = req.user._id;
            const userId: string = req.params.userId;
            const userRole: string = req.user.role;
            const pageno = req.query.pageno as string;
            const size = req.query.size as string;
            const { failure, posts } = await postService.getUserPosts(userId, userRole, tokenUserId, pageno, size);
            if (failure) {
                return res.status(failure.statusCode).send({ message: failure.message });
            }
            return res.status(200).send({ posts: posts.userPosts });
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Like any existing post
     * 
     * @param req The request along with the jwt token of the user passed in request header  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Success message if the post is liked or the failure message if post not exists
     */
    likePost: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user._id;
            const postId: string = req.params.id;
            const { likeSuccess, likeFailure } = await postService.likePost(postId, userId);
            if (likeFailure) {
                return res.status(likeFailure.statusCode).send({ message: likeFailure.message });
            }
            return res.status(200).send(likeSuccess);
        } catch (error) {
            next(error);
        }
    },
    /**
     * Dislike any existing post
     * 
     * @param req The request along with the jwt token of the user passed in request header  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns Success message if the post if disliked or the failure message if post not exists
     */
    dislikePost: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user._id;
            const postId: string = req.params.id;
            const { dislikeSuccess, dislikeFailure } = await postService.dislikePost(postId, userId);
            if (dislikeFailure) {
                return res.status(dislikeFailure.statusCode).send({ message: dislikeFailure.message });
            }
            return res.status(200).send(dislikeSuccess);
        } catch (error) {
            next(error);
        }
    },
};