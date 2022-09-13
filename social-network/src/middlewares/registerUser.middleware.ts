import Joi, { Schema } from "joi";
import { NextFunction, Request, Response } from "express";
import { iUser } from "../interfaces/index.interface";

const validateRegisterRequest = (req: Request, res: Response, next: NextFunction) => {
    const userSchema: Schema<iUser> = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({ 'string.pattern.base': `Password length must be atleast 6 characters with pattern [a-zA-Z0-9]` }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
        fname: Joi.string().required(),
        lname: Joi.string().required(),
        phoneNo: Joi.string().length(13).regex(/^[+92]{3}[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 13 digits with pattern +92XXXXXXXXX` }).required(),
        role: Joi.string().required().valid('user', 'moderator'),
    });
    const { error } = userSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateRegisterRequest;