import { Response, NextFunction } from "express";
import { userService } from "../services/index.service";
import { userAuthRequest } from "../interfaces/index.interface";

export default {
    followUser: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const followUserId: string = req.body.userId;
            const { followSuccess, followFailure } = await userService.followUser(userId, followUserId);
            if (followFailure) {
                return res.status(followFailure.statusCode).send({ message: followFailure.message });
            }
            return res.status(200).send(followSuccess);
        } catch (error) {
            next(error);
        }
    },

    unfollowUser: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const followUserId: string = req.body.userId;
            const { unfollowSuccess, unfollowFailure } = await userService.unfollowUser(userId, followUserId);
            if (unfollowFailure) {
                return res.status(unfollowFailure.statusCode).send({ message: unfollowFailure.message });
            }
            return res.status(200).send(unfollowSuccess);
        } catch (error) {
            next(error);
        }
    }
};