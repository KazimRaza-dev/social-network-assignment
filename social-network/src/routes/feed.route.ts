import express, { Router } from "express";
import { feedController } from "../controllers/index.controller";
import { auth, validate } from "../middlewares/index.middleware";
const feedRouter: Router = express.Router();

feedRouter.get("/", auth, validate.feedQueryParams, feedController.showFeed);

export default feedRouter;