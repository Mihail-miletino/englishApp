import {Router} from "express";
import {User} from "../models/User.model.js";
import {Word} from "../models/Word.model.js";
import {Record} from "../models/Record.model.js";
import {check, validationResult} from "express-validator";

export const RecordsRouter = Router();

RecordsRouter.get("/get", async (req, res) => {
    const userData = JSON.parse(req.headers.authorization);
    const {userId} = userData;
    try{
        const user = await User.findOne({_id: userId}).populate("records");
        const records = user.records;
        return res.status(200).json({
            records: records
        });
    } catch (err){
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

RecordsRouter.patch("/update/:id",
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
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Incorrect data within updating word",
                errors: errors
            });
        }
        next();
    },
    async (req, res) => {
        const {userId} = JSON.parse(req.headers.authorization);
        const {id} = req.params;
        const {eng, rus, engLower, rusLower, wordId} = req.body;
        const record = await Record.findOne({_id: id});
        record.eng = eng;
        record.rus = rus;
        const word = await Word.findOne({_id: wordId});
        if (word.eng !== engLower){
            word.users = word.users.filter((uId) => (String(uId) !== String(userId)) ? uId : null);
            const newWord = await Word.findOne({eng: engLower});
            if (newWord){
                record.word = newWord._id;
                newWord.users.push(userId);
                try{
                    await newWord.save();
                } catch(err){
                    return res.status(409).json({
                        message: "You already have this word"
                    });
                }
            } else{
                const nWord = new Word({
                    eng: engLower,
                    rus: rusLower,
                    users: [userId]
                });
                await nWord.save();
                record.word = nWord._id;
            }
        }
        await word.save();
        await record.save();
        return res.status(200).json({
            message: "Updated",
            recordData: {
                eng: record.eng,
                rus: record.rus,
                wId: record.word
            }
        });
    }
);

RecordsRouter.delete("/delete/:id", async (req, res) => {
    const {wordId} = req.body;
    const {id} = req.params;
    const {userId} = JSON.parse(req.headers.authorization);
    await Record.deleteOne({_id: id});
    const word = await Word.findOne({_id: wordId});
    const user = await User.findOne({_id: userId});
    word.users = word.users.filter((id) => (String(id) !== String(userId)) ? id : null);
    await word.save();
    user.records = user.records.filter((recId) => (String(recId) !== String(id)) ? recId : null);
    await user.save();
    return res.status(200).json({
        message: "Delete",
        deletedRecordId: id
    });
});
