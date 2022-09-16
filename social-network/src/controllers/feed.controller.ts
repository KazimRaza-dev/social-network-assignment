import { Request, Response, NextFunction } from "express";
import { feedServices } from "../services/index.service";

interface userAuthRequest extends Request {
    user: any
}
export default {
    showFeed: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const { pageno, size, sortby, order } = req.query as any;
            const { feed, feedFailure } = await feedServices.showFeed(userId, pageno, size, sortby, order);
            if (feedFailure) {
                return res.status(feedFailure.statusCode).send(feedFailure.message);
            }
            return res.status(200).send(feed);
        } catch (error) {
            next(error);
        }
    }
};