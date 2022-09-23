import { Response, NextFunction } from "express";
import { pick } from "lodash";
import { iPostBody, iEditPostBody } from "../interfaces/index.interface";
import { postService } from "../services/index.service";
import { userAuthRequest } from "../interfaces/index.interface";

export default {
    addPost: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const reqPost: iPostBody = pick(req.body, ['title', 'description']);
            reqPost.userId = req.user._id;
            const { newPost } = await postService.createPost(reqPost);
            res.status(200).send({
                message: newPost.message
            });
        }
        catch (error) {
            next(error);
        }
    },

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
            return res.status(200).send({ posts: posts.usertasks });
        }
        catch (error) {
            next(error);
        }
    },

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