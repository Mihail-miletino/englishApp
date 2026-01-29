import {Router} from "express";
import {check, validationResult} from "express-validator";
import {User} from "../models/User.model.js";
import {hash, compare} from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

const SECRET_KEY = config.get("secretKey");

export const AuthRouter = Router();

AuthRouter.post("/reg",
    [
        check("email", "Incorrect email")
            .isEmail(),
        check("password")
            .isLength({min: 8})
            .withMessage("Password must have a length of 8 symbols at least")
            .matches(/[@#$%^&*]/)
            .withMessage("Incorrect password. Password must contain at least one of these symbols: \"@#$%^&*\"")
    ],
    async (req, res) => {
        console.log(req.body);
        console.log("Registration...");
        const errors = validationResult(req).array();
        if (errors.length > 0){
            return res.status(400).json({
                message: "Incorrect data within registration",
                errors: errors
            });
        }
        const {username, email, password} = req.body;
        const isUserExists = await User.findOne({email: email});
        if (isUserExists){
            return res.status(409).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await hash(password, 12);
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await user.save();
        return res.status(200).json({
            message: "Successful registration. User is created."
        });
    }
);

AuthRouter.post("/login",
    [
        check("email")
            .isEmail()
            .withMessage("Incorrect email"),
        check("password")
            .isLength({min: 8})
            .withMessage("Password must have a length of 8 symbols at least")
            .matches(/[@#$%^&*]/)
            .withMessage("Incorrect password. Password must contain at least one of these symbols: \"@#$%^&*\"")
    ],
    async (req, res) => {
    console.log("Login...");
    const errors = validationResult(req).array();
    if (errors.length > 0){
        return res.status(400).json({
            message: "Incorrect data within authorization",
            errors: errors
        });
    }
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if (!user){
        return res.status(404).json({
            message: "User does not exist"
        });
    }
    const isPassword = await compare(password, user.password);
    if (!isPassword){
        return res.status(400).json({
            message: "Incorrect password"
        });
    }
    const token = jwt.sign({
        username: user.username,
        role: "user",
        expiresIn: "24h"
    }, SECRET_KEY);
    return res.status(200).json({
        message: "Successful authorization",
        token: token,
        userId: user.id
    });
});

AuthRouter.get("/office", async (req, res) => {
    const {userId} = JSON.parse(req.headers.authorization);
    const user = await User.findOne({_id: userId});
    const userInfo = {
        username: user.username,
        email: user.email,
        records: user.records.length
    };
    return res.status(200).json({
        message: "UserInfo",
        userInfo: userInfo
    });
});
