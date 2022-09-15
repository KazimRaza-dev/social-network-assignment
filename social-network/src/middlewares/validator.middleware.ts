import Joi, { Schema } from "joi";
import { NextFunction, Request, Response } from "express";

const validateFeedQueryParams = (req: Request, res: Response, next: NextFunction) => {
    enum validSort {
        _createdAt = '_createdAt',
        title = 'title',
        description = 'description',
        _id = "_id"
    }
    enum validOrder {
        asc = 'asc',
        desc = 'desc'
    }
    const feedSchema: Schema = Joi.object({
        pageno: Joi.string(),
        size: Joi.string(),
        sortby: Joi.string().valid(...Object.values(validSort)),
        order: Joi.string().valid(...Object.values(validOrder)),
    });
    const { error } = feedSchema.validate(req.query)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateFeedQueryParams;