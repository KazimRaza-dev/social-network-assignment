import userRouter from "./user.route";
import postRouter from "./post.route";
import feedRouter from "./feed.route";
import paymentRouter from "./payment.route";
import commentRouter from "./comment.route";
import testRouter from "./test.route";
import express, { Router } from "express";
const router: Router = express();

router.use("/", testRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/showfeed", feedRouter);
router.use("/payment", paymentRouter);
router.use("/comment", commentRouter);

export default router;