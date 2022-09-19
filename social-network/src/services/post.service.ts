import { iPost, iPostBody, iEditPostBody } from "../interfaces/index.interface";
import { postDal } from "../dal/index.dal";
import { responseWrapper } from "../utils/index.util";
import { Socket } from "../sockets/index.sockets";

export default {
    createPost: async (reqPost: iPostBody) => {
        try {
            const post: iPost = await postDal.create(reqPost);
            const id: string = post.userId.toString();
            Socket.to(id).emit("updatefeed", post);
            const newPost = {
                message: "New Post Created.."
            }
            return { newPost };
        } catch (error) {
            throw error;
        }
    },

    update: async (postId: string, reqPost: iEditPostBody, tokenUserId: string, userRole: string) => {
        try {
            const { failure } = await checkUserAccess(postId, tokenUserId, userRole, 'edit');
            if (failure) {
                return { failure };
            }
            const updatedPost: iPost = await postDal.update(postId, reqPost);
            const post = {
                message: "Post successfully Edited.",
                updated: updatedPost
            }
            return { post };
        } catch (error) {
            throw error;
        }
    },

    delete: async (postId: string, tokenUserId: string, userRole: string) => {
        try {
            const { failure } = await checkUserAccess(postId, tokenUserId, userRole, 'delete');
            if (failure) {
                return { failure };
            }
            await postDal.delete(postId);
            const post = {
                message: "Post successfully deleted."
            }
            return { post };
        } catch (error) {
            throw error;
        }
    },

    getSinglePost: async (postId: string, tokenUserId: string, userRole: string) => {
        try {
            const { failure } = await checkUserAccess(postId, tokenUserId, userRole, 'view');
            if (failure) {
                return { failure };
            }
            const post: iPost = await postDal.getSinglePost(postId);
            return { post };
        } catch (error) {
            throw error;
        }
    },

    getUserPosts: async (userId: string, userRole: string, tokenUserId: string, pageno: string, pageSize: string) => {
        try {
            if (userRole === "user" && tokenUserId !== userId) {
                const failure = responseWrapper(400, "You cannot view other User's tasks.")
                return { failure };
            }
            const pageNo = pageno && parseInt(pageno);
            const size = pageSize && parseInt(pageSize);
            const userPosts: iPost[] = await postDal.getUserPosts(userId, pageNo, size);
            if (userPosts.length > 0) {
                const posts = {
                    usertasks: userPosts
                }
                return { posts };
            }
            const failure = responseWrapper(404, "No Post exist for this user.")
            return { failure }
        } catch (error) {
            throw error;
        }
    },
};

const checkUserAccess = async (postId: string, tokenUserId: string, userRole: string, operation: string) => {
    try {
        const post: iPost = await postDal.isPostExists(postId);
        if (!post) {
            const failure = responseWrapper(404, `Post with id ${postId} does not exists.`)
            return { failure }
        }
        else {
            if (userRole === "user") {
                const userId: string = post.userId.toString();
                if (tokenUserId !== userId) {
                    const failure = responseWrapper(401, `You cannot ${operation} other User's Post.`)
                    return { failure }
                }
            }
        }
        return { validUser: true }
    } catch (error) {
        throw error;
    }
};