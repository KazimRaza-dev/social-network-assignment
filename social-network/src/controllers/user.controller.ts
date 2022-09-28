import { Response, NextFunction } from "express";
import { userService } from "../services/index.service";
import { userAuthRequest } from "../interfaces/index.interface";

export default {
    /**
     * Follow any existing user
     * 
     * @param req The request along with the jwt token of the user passed in request header
     * @param res The response
     * @param next Method to call the next middleware
     * @returns List of followed users or the failure message
     */
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
    /**
     * Unfollow already followed user
     * 
     * @param req The request along with the jwt token of the user passed in request header
     * @param res The response
     * @param next Method to call the next middleware
     * @returns List of followed users or the failure message
     */
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
    },
};