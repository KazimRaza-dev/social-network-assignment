import express, { Router } from "express";
import { userController } from "../controllers/index.controller";
import { auth, registerRequest, loginRequest, connectUser } from "../middlewares/index.middleware";
const userRouter: Router = express.Router();

userRouter.post("/user/register", registerRequest, userController.register)

userRouter.post("/user/login", loginRequest, userController.login)

userRouter.get("/user/follow", auth, connectUser, userController.followUser)

userRouter.get("/user/unfollow", auth, connectUser, userController.unfollowUser)

export default userRouter;