import { Schema, Types, model, Model } from "mongoose";
import { iPost } from "../../interfaces/index.interface";

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
        ref: "user",
        required: true
    },
    likes: {
        type: [String],
        required: true,
    },
    dislikes: {
        type: [String],
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

const Post: Model<iPost> = model<iPost>("post", postSchema);
export default Post;