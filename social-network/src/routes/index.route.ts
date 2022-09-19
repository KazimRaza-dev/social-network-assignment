import userRouter from "./user.route";
import express, { Router } from "express";
const router: Router = express();

router.use("/user", userRouter);

export default router;