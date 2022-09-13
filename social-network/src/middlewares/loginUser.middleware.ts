import Joi, { Schema } from "joi";
import { NextFunction, Request, Response } from "express";

const validateLoginRequest = (req: Request, res: Response, next: NextFunction) => {
    const joiSchema: Schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().required().valid('user', 'moderator'),
    })
    const { error } = joiSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateLoginRequest;