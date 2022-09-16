import { Request, Response, NextFunction } from "express";
import { pick } from "lodash";
import { iPost } from "../interfaces/index.interface";
import { postService } from "../services/index.service";

interface userAuthRequest extends Request {
    user: any
}
export default {
    addPost: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const reqPost: iPost = pick(req.body, ['title', 'description']);
            reqPost.userId = req.user._id;
            const post: iPost = await postService.createPost(reqPost);
            res.status(200).json({
                "message": "New post created.", "Post details": post
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
            const reqPost = req.body;

            const { post, failure } = await postService.update(postId, reqPost, tokenUserId, userRole);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).json({
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
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).json({
                message: post.message, post: post.updated
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
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).json(post)
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
            const { pageno, size } = req.query as any;

            const { failure, posts } = await postService.getUserPosts(userId, userRole, tokenUserId, pageno, size);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).send(posts.usertasks);
        }
        catch (error) {
            next(error);
        }
    },
};