import { Request, Response, NextFunction } from "express";
import { pick } from "lodash";
import { userService } from "../services/index.service";
// import { iUser } from "../interfaces/index.interface";

interface userAuthRequest extends Request {
    user: any
}

const userController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userToRegister = pick(req.body, ['email', 'password', 'fname', 'lname', 'phoneNo', 'role']);
            const { failure, userRegistered } = await userService.register(userToRegister);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            const token = userRegistered.user.generateAuthToken();
            return res.header('x-auth-token', token).status(200).send({
                message: userRegistered.message,
                user: userRegistered.user
            })
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = pick(req.body, ["email", "password", "role"]);
            const { loginSuccess, loginFailure } = await userService.login(user);
            if (loginFailure) {
                return res.status(loginFailure.statusCode).send(loginFailure.message)
            }
            const token = loginSuccess.user.generateAuthToken();
            return res.header('x-auth-token', token).status(200).json({
                "message": loginSuccess.message,
                "User": loginSuccess.user,
            })
        }
        catch (error) {
            next(error);
        }
    },

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
    }
}

export default userController;