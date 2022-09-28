import { Request, Response, NextFunction } from "express";

export default {
    /**
     * Method to test the application when deployed.
     * 
     * @param req The Request
     * @param res The Response
     * @param next Method to call the next middleware
     * @returns Response with message
     */
    getUser: (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.send("Testing routes..")
        } catch (error) {
            next(error);
        }
    }
}