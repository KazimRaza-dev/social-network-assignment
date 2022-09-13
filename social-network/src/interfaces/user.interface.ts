import { Types, Document } from "mongoose";

interface iUser extends Document {
    _id?: Types.ObjectId,
    email: string,
    password: string,
    fname: string,
    lname: string,
    phoneNo: string,
    role: string,
    following?: Object[],
    _createdAt?: Date,
    _updatedAt?: Date,
    generateAuthToken: Function,
}

export default iUser;
