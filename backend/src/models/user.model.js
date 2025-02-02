import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullname: {
            firstname: {
                type: String,
                required: true,
                trim: true,
                minlength: [3, "Firstname at least 3 characters"],
                maxlength: 50
            },
            lastname: {
                type: String,
                trim: true,
                minlength: [3, "Lastname at least 3 characters"],
                maxlength: 50
            }
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            match: [ /^\S+@\S+\.\S+$/, 'Please enter a valid email' ]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        socketId: {
            type: String
        },
        refreshToken: {
            type: String,
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next;
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jsonwebtoken.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = model("User", userSchema);
