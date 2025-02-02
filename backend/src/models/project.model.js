import { Schema, model } from "mongoose";

const projectSchema = new Schema(
    {
        name: {
            type: String,
            lowercase: true,
            required: [true, "Project name is required"],
            unique: true,
            trim: true
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        socketId: {
            type: String
        }
    },
    { timestamps: true }
);

export const Project = model("Project", projectSchema);
