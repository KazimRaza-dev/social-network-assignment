import { Types } from "mongoose";

interface iPost {
    _id: Types.ObjectId,
    title: string,
    description: string,
    postDateTime: string,
    userId: {
        type: Types.ObjectId,
        ref: "users"
    },
    _createdAt: Date,
    _updatedAt: Date
}

export default iPost;