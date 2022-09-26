import { iPost, iPostBody, iEditPostBody } from "../interfaces/index.interface";
import { postDal } from "../dal/index.dal";
import { responseWrapper } from "../utils/index.util";
import { Socket } from "../sockets/index.sockets";

export default {
    /**
     * Create a new post
     *
     * @param reqPost Post data to be added
     * @returns Succuess message after adding the post to database or throw error
     */
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

    /**
     * Update the already existing post
     *
     * @param postId Id of the post to be updated
     * @param reqPost Fields to be updated
     * @param tokenUserId Jwt token that user passed in request header
     * @param userRole Role of current user, either user or moderator
     * @returns Updated post or failure message
     */
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

    /**
     * Delete already existing post
     *
     * @param postId Id of post to be deleted
     * @param tokenUserId Jwt token that user passed in request header
     * @param userRole Role of current user, either user or moderator
     * @returns Succuess message if the post is deleted else failure message
     */
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

    /**
     * Get single post by passing its Id
     *
     * @param postId Id of post that user wants to get
     * @param tokenUserId Jwt token that user passed in request header
     * @param userRole Role of current user, either user or moderator
     * @returns Post object if it exists else failure message
     */
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

    /**
     * Get all posts of a specific user
     *
     * @param userId Id of logged in user
     * @param userRole Role of current user, either user or moderator
     * @param tokenUserId Jwt token that user passed in request header
     * @param pageno Page number to paginating the records
     * @param pageSize Page size for pagination
     * @returns Posts added by specific user if exists else return failure message
     */
    getUserPosts: async (userId: string, userRole: string, tokenUserId: string, pageno: string, pageSize: string) => {
        try {
            if (userRole === "user" && tokenUserId !== userId) {
                const failure = responseWrapper(400, "You cannot view other User's posts.")
                return { failure };
            }
            const pageNo = pageno && parseInt(pageno);
            const size = pageSize && parseInt(pageSize);
            const userPosts: iPost[] = await postDal.getUserPosts(userId, pageNo, size);
            if (userPosts.length > 0) {
                const posts = {
                    userPosts: userPosts
                }
                return { posts };
            }
            const failure = responseWrapper(404, "No Post exist for this user.")
            return { failure }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Like any existing post
     *
     * @param postId Id of post to be liked
     * @param userId Id of user liking the post
     * @returns Success message along with the likes on post or failure message
     */
    likePost: async (postId: string, userId: string) => {
        try {
            const exists: iPost = await postDal.isPostExists(postId)
            if (!exists) {
                const likeFailure = responseWrapper(404, `Post with Id ${postId} does not Exists.`);
                return { likeFailure };
            }
            const post: iPost = await postDal.isAlreadyLiked(postId, userId)
            if (post) {
                const likeFailure = responseWrapper(200, 'Like removed from this post');
                return { likeFailure };
            }

            //if user has already dislike the post, remove the dislike first then like that post.
            await postDal.isAlreadyDisliked(postId, userId);
            const postLiked: iPost = await postDal.likePost(postId, userId);
            const count = postLiked.likes.length;
            const likeSuccess = {
                message: "You have liked this post.", "likes Count": count, "Likes on Post": postLiked.likes
            }
            return { likeSuccess };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Dislike any existing post
     *
     * @param postId Id of post to be disliked
     * @param userId Id of user disliking the post
     * @returns Success message along with the dislikes on post or failure message
     */
    dislikePost: async (postId: string, userId: string) => {
        try {
            const exists: iPost = await postDal.isPostExists(postId)
            if (!exists) {
                const dislikeFailure = responseWrapper(404, `Post with Id ${postId} does not Exists.`);
                return { dislikeFailure };
            }
            const post: iPost = await postDal.isAlreadyDisliked(postId, userId)
            if (post) {
                const dislikeFailure = responseWrapper(200, 'Dislike removed from this post');
                return { dislikeFailure };
            }
            //if user has already like the post, remove the like first then dislike that post.
            await postDal.isAlreadyLiked(postId, userId);
            const postDisliked: iPost = await postDal.dislikePost(postId, userId);
            const count = postDisliked.dislikes.length;
            const dislikeSuccess = {
                message: "You have disliked this post.", "Dislikes Count": count, "Dislikes on Post": postDisliked.dislikes
            }
            return { dislikeSuccess };
        } catch (error) {
            throw error;
        }
    },
};
/**
 * Generic method to user whether user has access to perform speific operation.
 * Like a user cannot delete, edit, get other user post. And also checks if the post 
 * exists is database or not
 *
 * @param postId Id of post
 * @param tokenUserId Jwt token that user passed in request header
 * @param userRole Role of current user, either user or moderator
 * @param operation Generic parameter to show failure message, can be delete, edit, view etc 
 * @returns Failure object if user does not have access to perform specific operation, if user has acces then give true
 */
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