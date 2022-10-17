import express, { Router } from "express";
import { commentController } from "../controllers/index.controller";
import { userAuth, validate } from "../middlewares/index.middleware";
const commentRouter: Router = express.Router();

commentRouter.post("/:postId", userAuth, validate.commentRequest, commentController.addPostComment);

commentRouter.get("/show/:postId", userAuth, commentController.showPostComments);

commentRouter.post("/reply/:id", userAuth, validate.commentReply, commentController.addCommentReply);

commentRouter.get("/show-replies/:id", userAuth, commentController.showCommentReplies);

commentRouter.patch("/like/:id", userAuth, commentController.likeComment);

commentRouter.get("/display-all/:postId", userAuth, commentController.postCommentsReplies);

export default commentRouter;