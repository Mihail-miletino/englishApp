import jwt from "jsonwebtoken";
import config from "config";

export function verifyTokenMiddleware(req, res, next){
    const userData = JSON.parse(req.headers.authorization);
    const {token} = userData;
    const SECRET_KEY = config.get("secretKey");
    try{
        const payload = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err){
        console.log(err);
        return res.status(400).json({
            message: "Token is incorrect",
            error: err
        });
    }
}
