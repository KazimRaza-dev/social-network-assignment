import { feedDal, paymentDal } from "../dal/index.dal";
import { responseWrapper } from "../utils/index.util";

export default {
    showFeed: async (userId: string, pageno: string, size: string, sortby: string, order: string) => {
        try {
            const pageNo = pageno && parseInt(pageno);
            const pageSize = size && parseInt(size);
            const isUserExists = await feedDal.isUserExists(userId);
            if (!isUserExists) {
                const feedFailure = responseWrapper(404, `User with Id ${userId} does not Exists.`);
                return { feedFailure };
            }
            const feedPosts = await feedDal.showFeed(userId, pageNo, pageSize, sortby, order);
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
    },

    checkPaymentStatus: async (userId: string) => {
        try {
            const payment = await paymentDal.isAlreadyPaid(userId);
            if (!payment) {
                const paymentPending = responseWrapper(400, 'Social feed is restricted to Paid users ONLY.')
                return { paymentPending };
            }
            return { payment };
        } catch (error) {
            throw error;
        }
    }
};