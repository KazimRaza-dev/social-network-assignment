import { Router } from "express";
import { paymentController } from "../controllers/index.controller";
import { userAuth } from "../middlewares/index.middleware";
const paymentRouter: Router = Router();

paymentRouter.post("/create-checkout-session", userAuth, paymentController.makePayment);

paymentRouter.get("/success", paymentController.paymentSuccess);

paymentRouter.get("/failure", paymentController.paymentFailed);

export default paymentRouter;