import express, { Router } from "express";
import { feedController } from "../controllers/index.controller";
import { userAuth, validate } from "../middlewares/index.middleware";
const feedRouter: Router = express.Router();


feedRouter.get("/", userAuth, validate.feedQueryParams, feedController.showFeed);

export default feedRouter;