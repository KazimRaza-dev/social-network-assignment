import { Schema, Types, model, Model } from "mongoose";
import { iPost } from "../interfaces/index.interface";

const postSchema: Schema = new Schema<iPost>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: {
        createdAt: '_createdAt',
        updatedAt: '_updatedAt'
    }
})

const Post: Model<iPost> = model<iPost>("post", postSchema);
export default Post;