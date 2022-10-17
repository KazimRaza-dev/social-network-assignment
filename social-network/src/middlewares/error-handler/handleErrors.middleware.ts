import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';

/**
 * Global error handle method that takes the error object and send the error message in reponse
 *
 * @param error Error object
 * @param req The request
 * @param res The reponse 
 * @param next Method to call the next middleware function
 * @returns Error message
 */
const handleError = (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof Error)
            return res.status(400).send({
                message: error.message
            });

        res.status(500).send({
            message: "Server Error! Something went wrong."
        });
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export default handleError;