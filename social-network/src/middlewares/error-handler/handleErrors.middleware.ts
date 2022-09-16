import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';

const handleError = (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof Error)
        return res.status(400).send(error.message);

    res.status(500).send("Server Error! Something went wrong.");
    next();
};

export default handleError;