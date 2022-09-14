import Joi, { Schema } from "joi";
import { NextFunction, Request, Response } from "express";
import { iPost } from "../interfaces/index.interface";

const validateNewPost = (req: Request, res: Response, next: NextFunction) => {
    const postSchema: Schema<iPost> = Joi.object({
        title: Joi.string().min(5).max(15).required(),
        description: Joi.string().min(5).max(100).required(),
    });
    const { error } = postSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateNewPost;