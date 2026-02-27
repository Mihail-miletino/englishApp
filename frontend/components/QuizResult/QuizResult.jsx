import {Header} from "@components/Header/Header.jsx";
import {useLocation, Link} from "react-router-dom";
import {useHttp} from "@hooks/http.hook.js";
import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../../context/authContext.js";
import classes from "./QuizResult.module.css";

export function QuizResult(){

    const location = useLocation();
    const quizTranslations = location.state;

    const [resPercent, setResPercent] = useState(null);
    const [color, setColor] = useState("");
    const [answers, setAnswers] = useState([]);

    const {token, userId} = useContext(AuthContext);

    const {request} = useHttp();

    useEffect(() => {
        async function getQuizRes(){
            const userData = {
                token: token,
                userId : userId
            };
            try{
                const quizResData = await request("/api/quiz/getRes", "POST", quizTranslations, {
                    "Authorization": JSON.stringify(userData)
                });
                const {resP, checkedAnswers} = quizResData;
                setResPercent(resP);
                setAnswers(checkedAnswers);
            } catch (err){
                console.log(`Ошибка: ${err.message}`);
            }
        }
        getQuizRes();
    }, []);

    useEffect(() => {
        setColor((color) => {
            if (resPercent > 0){
                if (resPercent >= 75){
                    return "green";
                } else if (resPercent >= 57){
                    return "orange";
                } else{
                    return "red";
                }
            }
            return "";
        });
    }, [resPercent]);

    return (
        <>
            <Header/>
            <div style={{textAlign: "center", fontSize: "18px", fontWeight: "700", margin: "25px 0 25px 0"}}>Quiz Result:</div>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div className={classes.resLine}>
                    <div style={{background: color, width: `${(resPercent === 0) ? 5 : resPercent}%`, fontSize: "16px", fontWeight: "700"}} className={classes.resLineColored}>{resPercent}%</div>
                </div>
            </div>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "25px 0 0 0"}}>
                <div className={classes.resultTable}>
                    <ul>
                        <li className={classes.tableTitle}>Word:</li>
                        {
                            answers.map((answer, index) => {
                                return (
                                    <li style={{background: (answer.isCorrect) ? "lightgreen" : "indianred"}} key={index}>{answer.correctAnswer.eng}</li>
                                );
                            })
                        }
                    </ul>
                    <ul>
                        <li className={classes.tableTitle}>Your Answer:</li>
                        {
                            answers.map((answer, index) => {
                                return (
                                    <li style={{background: (answer.isCorrect) ? "lightgreen" : "indianred"}} key={index}>{(answer.userAnswer.rus.length === 0) ? "-" : answer.userAnswer.rus}</li>
                                );
                            })
                        }
                    </ul>
                    <ul>
                        <li className={classes.tableTitle}>Correct Answer:</li>
                        {
                            answers.map((answer, index) => {
                                return (
                                    <li style={{background: (answer.isCorrect) ? "lightgreen" : "indianred"}} key={index}>{answer.correctAnswer.rus}</li>
                                );
                            })
                        }
                    </ul>
                    <ul>
                        <li className={classes.tableTitle}>Is Correct:</li>
                        {
                            answers.map((answer, index) => {
                                return (
                                    <li style={{background: (answer.isCorrect) ? "lightgreen" : "indianred"}} key={index}>{(answer.isCorrect) ? "YES" : "NO"}</li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0 0 0"}}>
                <button className="btn waves-effect waves-light" type="button"><Link to={"/"}><div style={{color: "white"}}>Back to Home Page</div></Link></button>
            </div>
        </>
    )
}
