import { feedDal } from "../dal/index.dal";
import { responseWrapper } from "../utils/index.util";

const feedServices = {
    showFeed: async (userId: string, pageno = 1, size = 5, sortby = "_createdAt", order = "asc") => {
        try {
            const isUserExists = await feedDal.isUserExists(userId);
            if (!isUserExists) {
                const feedFailure = responseWrapper(404, `User with Id ${userId} does not Exists.`);
                return { feedFailure };
            }
            const feedPosts = await feedDal.showFeed(userId, pageno, size, sortby, order);
            if (feedPosts.length > 0) {
                const feed = {
                    posts: feedPosts
                }
                return { feed };
            }
            const feedFailure = responseWrapper(400, `No more posts found. Follow more users to view their posts.`);
            return { feedFailure };
        } catch (error) {
            throw error;
        }
    }
}

export default feedServices;