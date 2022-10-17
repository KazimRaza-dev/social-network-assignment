import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
config();

interface userRequest extends Request {
    user: JwtPayload
}
/**
 * Check whether the jwt token of user or moderator provided in request header is valid or not
 * if is it valid then call the next middleware function
 *
 * @param req The request
 * @param res The reponse   
 * @param next Method to call the next middleware 
 * @returns Failure message if the token is invalid or if the access is denied
 */
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