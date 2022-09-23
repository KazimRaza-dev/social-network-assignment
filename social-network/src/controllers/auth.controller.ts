import { Request, Response, NextFunction } from "express";
import { pick } from "lodash";
import { authService } from "../services/index.service";
import { iRegisterBody, iLoginBody } from "../interfaces/index.interface";

export default {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userToRegister: iRegisterBody = pick(req.body, ['email', 'password', 'fname', 'lname', 'phoneNo', 'role']);
            const { failure, user } = await authService.register(userToRegister);
            if (failure) {
                return res.status(failure.statusCode).send({
                    message: failure.message
                });
            }
            return res.header('x-auth-token', user.jwtToken).status(200).send({
                message: user.message,
            })
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: iLoginBody = pick(req.body, ["email", "password", "role"]);
            const { loginSuccess, loginFailure } = await authService.login(user);
            if (loginFailure) {
                return res.status(loginFailure.statusCode).send({
                    message: loginFailure.message
                })
            }
            return res.header('x-auth-token', loginSuccess.jwtToken).status(200).json({
                message: loginSuccess.message
            })
        }
        catch (error) {
            next(error);
        }
    },
}