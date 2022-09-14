import { iPost } from "../interfaces/index.interface";
import { postDal } from "../dal/index.dal";
import { responseWrapper } from "../utils/index.util";


const postService = {
    createPost: async (reqPost): Promise<iPost> => {
        try {
            const post: iPost = await postDal.create(reqPost);
            return post;
        } catch (error) {
            throw error;
        }
    },

    update: async (postId: string, reqPost: iPost, tokenUserId: string) => {
        try {
            const { failure } = await checkUserAccess(postId, tokenUserId, 'edit');
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

    delete: async (postId: string, tokenUserId: string) => {
        try {
            const { failure } = await checkUserAccess(postId, tokenUserId, 'delete');
            if (failure) {
                return { failure };
            }
            const deletedPost: iPost = await postDal.delete(postId);
            const post = {
                message: "Post successfully deleted.",
                updated: deletedPost
            }
            return { post };
        } catch (error) {
            throw error;
        }
    },

    getUserPosts: async (userId: string, userRole: string, tokenUserId: string, pageno = 1, pageSize = 5) => {
        try {
            if (userRole === "user" && tokenUserId !== userId) {
                const failure = responseWrapper(400, "You cannot view other User's tasks.")
                return { failure };
            }
            const userPosts: iPost[] = await postDal.getUserPosts(userId, pageno, pageSize);
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


}

const checkUserAccess = async (postId: string, tokenUserId: string, operation: string) => {
    try {
        const post: iPost = await postDal.isPostExists(postId);
        if (post) {
            const userId: string = post.userId.toString();
            if (tokenUserId !== userId) {
                const failure = responseWrapper(401, `You cannot ${operation} other User's Post.`)
                return { failure }
            }
        }
        else {
            const failure = responseWrapper(404, `Post with id ${postId} does not exists.`)
            return { failure }
        }
        return { validUser: true }
    } catch (error) {
        throw error;
    }
};


export default postService;