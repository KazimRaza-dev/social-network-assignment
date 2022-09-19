import { Request, Response, NextFunction } from "express";
import { userService } from "../services/index.service";

interface userAuthRequest extends Request {
    user: any
}
export default {
    followUser: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const followUserId = req.body.userId;
            const { followSuccess, followFailure } = await userService.followUser(userId, followUserId);
            if (followFailure) {
                return res.status(followFailure.statusCode).send(followFailure.message);
            }
            return res.status(200).send(followSuccess);
        } catch (error) {
            next(error);
        }
    },

    unfollowUser: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const followUserId = req.body.userId;
            const { unfollowSuccess, unfollowFailure } = await userService.unfollowUser(userId, followUserId);
            if (unfollowFailure) {
                return res.status(unfollowFailure.statusCode).send(unfollowFailure.message);
            }
            return res.status(200).send(unfollowSuccess);
        } catch (error) {
            next(error);
        }
    }
};