import Joi, { Schema } from "joi";
import { NextFunction, Request, Response } from "express";
import { iUser, iPost } from "../../interfaces/index.interface";

/**
 * Enum for valid user roles allowed
 */
enum validUsers {
    user = 'user',
    moderator = 'moderator'
}
/**
 * Generic method to validate the request body
 *
 * @param req The request
 * @param res The reponse
 * @param next Method to call the next middleware
 * @param joiSchema Schema that is used to validate the request body
 * @returns Error message if the validation fail or call the next middleware
 */
const validateRequestBody = (req: Request, res: Response, next: NextFunction, joiSchema: Schema) => {
    try {
        const { error } = joiSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

/**
 * Generic method to validate the request Query
 *
 * @param req The request
 * @param res The reponse
 * @param next Method to call the next middleware
 * @param joiSchema Schema that is used to validate the request query
 * @returns Error message if the validation fail or call the next middleware
 */
const validateRequestQuery = (req: Request, res: Response, next: NextFunction, joiSchema: Schema) => {
    try {
        const { error } = joiSchema.validate(req.query);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
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

    editPost: (req: Request, res: Response, next: NextFunction) => {
        const postSchema: Schema<iPost> = Joi.object({
            title: Joi.string().min(5).max(15),
            description: Joi.string().min(5).max(100),
        });
        validateRequestBody(req, res, next, postSchema)
    },

    newPost: (req: Request, res: Response, next: NextFunction) => {
        const postSchema: Schema<iPost> = Joi.object({
            title: Joi.string().min(5).max(15).required(),
            description: Joi.string().min(5).max(100).required(),
        });
        validateRequestBody(req, res, next, postSchema)
    },

    feedQueryParams: (req: Request, res: Response, next: NextFunction) => {
        enum validSort {
            createdAt = 'createdAt',
            title = 'title',
            description = 'description',
            _id = '_id'
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
        validateRequestQuery(req, res, next, feedSchema)
    },

    commentRequest: (req: Request, res: Response, next: NextFunction) => {
        const commentSchema: Schema = Joi.object({
            comment: Joi.string().required(),
        })
        validateRequestBody(req, res, next, commentSchema)
    },

    commentReply: (req: Request, res: Response, next: NextFunction) => {
        const commentSchema: Schema = Joi.object({
            comment: Joi.string().required(),
            postId: Joi.string().required(),
        })
        validateRequestBody(req, res, next, commentSchema)
    },
}