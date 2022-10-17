import { Types } from "mongoose";

interface iPost {
    _id?: Types.ObjectId,
    title: string,
    description: string,
    userId?: {
        type: Types.ObjectId,
        ref: "users"
    },
    likes: string[],
    dislikes: string[],
    createdAt?: Date,
    updatedAt?: Date
}

export default iPost;