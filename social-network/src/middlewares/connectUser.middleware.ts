import Joi, { Schema } from "joi";
import { NextFunction, Request, Response } from "express";

const validateConnectUserReq = (req: Request, res: Response, next: NextFunction) => {
    const joiSchema: Schema = Joi.object({
        userId: Joi.string().required(),
    })
    const { error } = joiSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateConnectUserReq;