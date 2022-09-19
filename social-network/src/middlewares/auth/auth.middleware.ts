import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";

config();
interface userRequest extends Request {
    user: JwtPayload
}
const auth = (req: userRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).send("Access denied. No token provided.");

        const decodedToken = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decodedToken as JwtPayload;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid Token.')
    }
}

export default auth;