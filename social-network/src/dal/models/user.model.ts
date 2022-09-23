import { Schema, Model, model } from "mongoose";
import { iUser } from "../../interfaces/index.interface";
import jwt from "jsonwebtoken";

const userSchema: Schema = new Schema<iUser>({
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    phoneNo: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "moderator"]
    },
    following: {
        type: [String],
        required: false,
        default: []
    }
}, {
    timestamps: {
        createdAt: '_createdAt',
        updatedAt: '_updatedAt'
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email, name: this.fname + " " + this.lname, role: this.role }, process.env.jwtPrivateKey, { expiresIn: process.env.tokenExpiryTime });
    return token;
}

const User: Model<iUser> = model<iUser>("user", userSchema);
export default User;