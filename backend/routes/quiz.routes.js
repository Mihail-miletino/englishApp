import {Router} from "express";
import {Record} from "../models/Record.model.js";
import {User} from "../models/User.model.js";
import {Quiz} from "../models/Quiz.model.js";

export const QuizRouter = Router();

QuizRouter.post("/getRes", async (req, res) => {
    const quizTrans = req.body;
    const engWordsOfQuiz = Object.keys(quizTrans);
    const {userId} = JSON.parse(req.headers.authorization);
    const records = await Record.find({
        eng: {$in: engWordsOfQuiz},
        author: userId
    });
    let resP = 0;
    let counter = 0;
    const checkedAnswers = [];
    records.forEach((record) => {
        if (record.rus.toLowerCase().trim() === quizTrans[record.eng].toLowerCase().trim()){
            counter++;
            checkedAnswers.push({
                correctAnswer: record,
                userAnswer: {
                    eng: quizTrans[record.eng],
                    rus: quizTrans[record.eng]
                },
                isCorrect: true
            });
        } else{
            checkedAnswers.push({
                correctAnswer: record,
                userAnswer: {
                    eng: quizTrans[record.eng],
                    rus: quizTrans[record.eng]
                },
                isCorrect: false
            });
        }
    });
    resP = Math.ceil((counter / engWordsOfQuiz.length) * 100);
    res.status(200).json({
        resP: resP,
        checkedAnswers: checkedAnswers
    });
});

QuizRouter.get("/get/quizzes", async (req, res) => {
    const {userId} = JSON.parse(req.headers.authorization);
    let user = await User.findOne({_id: userId});
    const quizzes = await Quiz.find({author: userId});

    for (let i = 0; i < quizzes.length; i++){
        const validWords = [];
        for (let j = 0; j < quizzes[i].words.length; j++){
            if (user.records.includes(quizzes[i].words[j])){
                validWords.push(quizzes[i].words[j]);
            }
        }
        if (validWords.length > 1){
            quizzes[i].words = validWords;
            await quizzes[i].save();
        } else{
            await Quiz.deleteOne({_id: quizzes[i]._id});
            user.quizzes = user.quizzes.filter((quiz) => (String(quiz._id) !== String(quizzes[i]._id)) ? quiz._id : null);
            await user.save();
            quizzes.splice(i, 1);
        }
    }

    user = await User.findOne({_id: userId}).populate({
        path: "quizzes",
        populate: {
            path: "words",
            model: "Record"
        }
    });

    return res.status(200).json({
        quizzes: user.quizzes
    });
});

QuizRouter.post("/add/record", async (req, res) => {
    const {recordId, selectedQuiz} = req.body;
    const quiz = await Quiz.findOne({_id: selectedQuiz._id});
    for (let i = 0; i < quiz.words.length; i++){
        if (quiz.words[i] === recordId){
            return res.status(409).json({
                message: "Word already in quiz"
            });
        }
    }
    quiz.words.push(recordId);
    await quiz.save();
    return res.status(200).json({
        message: `Word is added in quiz "${quiz.name}"`
    });
});
