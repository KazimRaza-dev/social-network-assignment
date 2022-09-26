import { feedDal, paymentDal } from "../dal/index.dal";
import { responseWrapper } from "../utils/index.util";

export default {
    /**
     * Show social feed to user
     *
     * @param userId Id of user who wants to view the social feed
     * @param pageno Page number for paginating records 
     * @param size Size of page
     * @param sortby Field to sort the records  
     * @param order Order of sorting
     * @returns Posts of the following users or failure message along with the status code
     */
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

    /**
     * Check if the user has paid for social feed or not
     *
     * @param userId Id of user who wants to view the social feed
     * @returns Payment object if exists else the failure message
     */
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