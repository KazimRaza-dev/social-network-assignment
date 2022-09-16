import express, { Router } from "express";
import { postController } from "../controllers/index.controller";
import { auth, userAuth, validate } from "../middlewares/index.middleware";
const postRouter: Router = express.Router();

postRouter.post("/add", userAuth, validate.newPost, postController.addPost);

postRouter.put("/edit/:id", auth, validate.editPost, postController.updatePost);

postRouter.delete("/delete/:id", auth, postController.deletePost);

postRouter.get("/:id", auth, postController.getSinglePost);

postRouter.get("/userposts/:userId", auth, postController.getUserPosts);

export default postRouter;