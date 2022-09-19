import Joi, { Schema } from "joi";
import { NextFunction, Request, Response } from "express";
import { iUser } from "../../interfaces/index.interface";

enum validUsers {
    user = 'user',
    moderator = 'moderator'
}

const validateRequestBody = (req: Request, res: Response, next: NextFunction, joiSchema: Schema) => {
    const { error } = joiSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

export default {
    connectUser: (req: Request, res: Response, next: NextFunction) => {
        const joiSchema: Schema = Joi.object({
            userId: Joi.string().required(),
        })
        validateRequestBody(req, res, next, joiSchema);
    },

    loginRequest: (req: Request, res: Response, next: NextFunction) => {
        const joiSchema: Schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().required().valid(...Object.values(validUsers)),
        })
        validateRequestBody(req, res, next, joiSchema)
    },

    registerRequest: (req: Request, res: Response, next: NextFunction) => {
        const userSchema: Schema<iUser> = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({ 'string.pattern.base': `Password length must be atleast 6 characters with pattern [a-zA-Z0-9]` }),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
            fname: Joi.string().required(),
            lname: Joi.string().required(),
            phoneNo: Joi.string().length(13).regex(/^[+92]{3}[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 13 digits with pattern +92XXXXXXXXX` }).required(),
            role: Joi.string().required().valid(...Object.values(validUsers)),
        });
        validateRequestBody(req, res, next, userSchema)
    },

}