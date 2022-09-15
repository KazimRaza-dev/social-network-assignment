import express, { Router } from "express";
import { feedController } from "../controllers/index.controller";
import { auth, validateFeedQueryParams } from "../middlewares/index.middleware";
const feedRouter: Router = express.Router();

feedRouter.get("/showfeed", auth, validateFeedQueryParams, feedController.showFeed);

export default feedRouter;