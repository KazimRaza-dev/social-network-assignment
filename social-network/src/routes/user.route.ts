import express, { Router } from "express";
import { userController, authController } from "../controllers/index.controller";
import { auth, validate } from "../middlewares/index.middleware";
const userRouter: Router = express.Router();

userRouter.post("/user/register", validate.registerRequest, authController.register)

userRouter.post("/user/login", validate.loginRequest, authController.login)

userRouter.get("/user/follow", auth, validate.connectUser, userController.followUser)

userRouter.get("/user/unfollow", auth, validate.connectUser, userController.unfollowUser)

export default userRouter;