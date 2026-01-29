import {Schema, model, SchemaTypes} from "mongoose";

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
                type: SchemaTypes.ObjectId,
                ref: "Record"
            }
        ]
    }
});

export const User = model("User", userSchema);
