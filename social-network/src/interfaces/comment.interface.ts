import { Types } from "mongoose";

interface iComment {
    _id?: Types.ObjectId,
    comment: string,
    likes: string[],
    userId?: {
        type: Types.ObjectId,
        ref: "users"
    },
    postId?: {
        type: Types.ObjectId,
        ref: "posts"
    },
    parentCommentId: {
        type: Types.ObjectId,
        ref: "comments"
    },
    postedAt?: Date,
    updatedAt?: Date
}

export default iComment;