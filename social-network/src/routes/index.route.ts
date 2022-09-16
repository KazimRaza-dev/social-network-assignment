import userRouter from "./user.route";
import postRouter from "./post.route";
import feedRouter from "./feed.route";
import express, { Router } from "express";
const router: Router = express();

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/showfeed", feedRouter);

export default router;