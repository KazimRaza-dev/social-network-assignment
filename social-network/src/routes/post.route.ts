import express, { Router } from "express";
import { postController } from "../controllers/index.controller";
import { auth, userAuth, validate } from "../middlewares/index.middleware";
const postRouter: Router = express.Router();

postRouter.post("/add", userAuth, validate.newPost, postController.addPost);

postRouter.patch("/edit/:id", auth, validate.editPost, postController.updatePost);

postRouter.delete("/delete/:id", auth, postController.deletePost);

postRouter.get("/:id", auth, postController.getSinglePost);

postRouter.get("/userposts/:userId", auth, postController.getUserPosts);

postRouter.patch("/like/:id", userAuth, postController.likePost);

postRouter.patch("/dislike/:id", userAuth, postController.dislikePost);


export default postRouter;