import { Schema, Types, model, Model } from "mongoose";
import { iComment } from "../../interfaces/index.interface";

const commentSchema: Schema = new Schema<iComment>({
    comment: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    postId: {
        type: Types.ObjectId,
        ref: "post",
        required: true
    },
    parentCommentId: {
        type: Types.ObjectId,
        ref: "comment",
        default: null
    }

}, {
    timestamps: {
        createdAt: 'postedAt',
        updatedAt: 'updatedAt'
    }
})

const Comment: Model<iComment> = model<iComment>("comment", commentSchema);
export default Comment;

