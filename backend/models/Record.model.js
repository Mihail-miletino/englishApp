import {Schema, model} from "mongoose";

const RecordSchema = new Schema({
    eng: {
        type: String,
        required: true
    },
    rus: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    word: {
        type: Schema.Types.ObjectId,
        ref: "Word"
    }
});

export const Record = model("Record", RecordSchema);
