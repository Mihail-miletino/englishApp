import {Router} from "express";
import {check, validationResult} from "express-validator";
import {User} from "../models/User.model.js";
import {Word} from "../models/Word.model.js";
import {Record} from "../models/Record.model.js";

export const CreateRouter = Router();

CreateRouter.post("/record",
    [
        check("eng")
            .isLength({min: 1})
            .withMessage("Field \"English translation\" can`t be empty"),
        check("eng")
            .matches(/^(?!\s+$)[A-Za-z\s]+$/)
            .withMessage("Field \"English translation\" must contain only english symbols"),
        check("rus")
            .isLength({min: 1})
            .withMessage("Field \"Russian translation\" can`t be empty"),
        check("rus")
            .matches(/^(?!\s+$)[А-ЯЁа-яё\s]+$/)
            .withMessage("Field \"Russian translation\" must contain only russian symbols")
    ],
    async (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0){
            return res.status(400).json({
                message: "Incorrect data within creating new word",
                errors: errors
            });
        }
        next();
    },
    async (req, res, next) => {
        const {userId} = JSON.parse(req.headers.authorization);
        const {engLower, rusLower} = req.body;

        const word = await Word.findOne({eng: engLower});
        if (word){
            try{
                word.users.push(userId);
                await word.save();
            } catch (err){
                return res.status(409).json({
                    message: "You already have this word",
                    error: err
                });
            }
        } else{
            const nWord = new Word({
                eng: engLower,
                rus: rusLower,
                users: [userId]
            });
            await nWord.save();
        }
        next();
    },
    async (req, res) => {
        const {userId} = JSON.parse(req.headers.authorization);
        const {eng, rus, engLower, rusLower} = req.body;

        const word = await Word.findOne({eng: engLower});

        const record = new Record({
            eng: eng,
            rus: rus,
            author: userId,
            word: word._id
        });
        await record.save();

        const user = await User.findOne({_id: userId});

        user.records.push(record);
        await user.save();

        return res.status(200).json({
            message: "Word is created"
        });
    }
);
