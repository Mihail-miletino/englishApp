import {Schema, model} from "mongoose";

const QuizSchema = new Schema({
    name: {
        type: String
    },
    words: [
        {
            type: Schema.Types.ObjectId,
            ref: "Record"
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

export const Quiz = model("Quiz", QuizSchema);
