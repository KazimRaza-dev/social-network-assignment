import { Response, NextFunction } from "express";
import { feedService } from "../services/index.service";
import { userAuthRequest } from "../interfaces/index.interface";

export default {
    /**
     * Show social feed to user that contains posts posted by the followed users
     * 
     * @param req The request  
     * @param res The reponse   
     * @param next Method to call the next middleware
     * @returns List of posts if exists for a user or the failure message
     */
    showFeed: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const { paymentPending } = await feedService.checkPaymentStatus(userId);
            if (paymentPending) {
                return res.status(paymentPending.statusCode).send({ message: paymentPending.message });
            }
            const pageno: string = req.query.pageno as string;
            const size: string = req.query.size as string;
            const sortby: string = req.query.sortby as string;
            const order: string = req.query.order as string;
            const { feed, feedFailure } = await feedService.showFeed(userId, pageno, size, sortby, order);
            if (feedFailure) {
                return res.status(feedFailure.statusCode).send({ message: feedFailure.message });
            }
            return res.status(200).send(feed);
        } catch (error) {
            next(error);
        }
    }
};