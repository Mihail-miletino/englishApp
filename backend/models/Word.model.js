import {Schema, model} from "mongoose";

const wordSchema = new Schema({
    eng: {
        type: String,
        required: true,
        unique: true
    },
    rus: {
        type: String,
        required: true
    },
    users: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        validate: {
            validator: function(users){
                const uniques = new Set(users.map((userId) => String(userId)));
                return uniques.size === users.length;
            },
            message: "You already have this word"
        }
    }
});

export const Word = model("Word", wordSchema);
