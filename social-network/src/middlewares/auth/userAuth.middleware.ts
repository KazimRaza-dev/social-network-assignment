import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
interface userRequest extends Request {
    user: any
}
const userAuth = (req: userRequest, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        const decodedToken = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decodedToken;
        if (req.user.role !== "user") {
            return res.status(401).send("Access denied. Moderators cannot call this API.");
        }
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid Token.')
    }
}

export default userAuth;