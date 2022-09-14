import express, { Router } from "express";
import { postController } from "../controllers/index.controller";
import { auth, validateNewPost, validateEditPost } from "../middlewares/index.middleware";
const postRouter: Router = express.Router();

postRouter.post("/post/add", auth, validateNewPost, postController.addPost);

postRouter.put("/post/edit/:id", auth, validateEditPost, postController.updatePost);

postRouter.delete("/post/delete/:id", auth, postController.deletePost);

postRouter.get("/post/userposts/:userId", auth, postController.getUserPosts);

export default postRouter;