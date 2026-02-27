import {Schema, model} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    records: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Record"
            }
        ]
    },
    quizzes: {
        type: [
            {
               type: Schema.Types.ObjectId,
               ref: "Quiz"
            }
        ]
    }
});

export const User = model("User", userSchema);
