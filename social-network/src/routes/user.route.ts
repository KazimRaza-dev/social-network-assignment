import express, { Router } from "express";
import { userController, authController } from "../controllers/index.controller";
import { userAuth, validate } from "../middlewares/index.middleware";
const userRouter: Router = express.Router();

userRouter.post("/register", validate.registerRequest, authController.register)

userRouter.post("/login", validate.loginRequest, authController.login)

userRouter.get("/follow", userAuth, validate.connectUser, userController.followUser)

userRouter.get("/unfollow", userAuth, validate.connectUser, userController.unfollowUser)

export default userRouter;