import {Header} from "@components/Header/Header.jsx";
import {AuthContext} from "../../context/authContext.js";
import {useState, useEffect, useContext} from "react";
import {useHttp} from "@hooks/http.hook.js";
import {useMessage} from "@hooks/message.hook.js";
import {Link} from "react-router-dom";
import classes from "./QuizzesPage.module.css";

export function QuizzesPage(){

    const [quizzes, setQuizzes] = useState([]);

    const {token, userId} = useContext(AuthContext);

    const {request, messages} = useHttp();

    useEffect(() => {
        async function getQuizzes(){
            try{
                const userData = {
                    token: token,
                    userId: userId
                };
                const headers = {
                    "Authorization": JSON.stringify(userData)
                };
                const quizzesData = await request("api/quiz/get/quizzes", "GET", null, headers);
                console.log(quizzesData);
                setQuizzes(quizzesData.quizzes);
            } catch(err){
                console.log(err.message);
            }
        }
        getQuizzes();
    }, []);

    useEffect(() => {
        useMessage(messages);
    }, [messages]);

    return (
        <>
            <Header/>
            <h1>Quizzes Page</h1>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <ul className={classes.quizzesList}>{
                    quizzes.map((quiz, index) => {
                        return (
                            <li key={index}>
                                <div className={classes.quizName}>{quiz.name}</div>
                                <button className="btn waves-effect waves-light" type="button"><Link to={"/quiz/own"} state={{ownQuizWords: quiz.words}}><div style={{color: "white"}}>Start Quiz</div></Link></button>
                            </li>
                        );
                    })
                }</ul>
            </div>
        </>
    );
}
