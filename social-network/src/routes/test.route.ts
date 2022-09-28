import express, { Router } from "express";
import { testController } from "../controllers/index.controller";
const testRouter: Router = express.Router();

testRouter.get("/", testController.getUser)

export default testRouter;