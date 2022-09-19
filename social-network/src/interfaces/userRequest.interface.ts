import { Request } from "express";

interface userAuthRequest extends Request {
    user: {
        _id: string,
        email: string,
        name: string,
        role: string
    }
}
export default userAuthRequest;
