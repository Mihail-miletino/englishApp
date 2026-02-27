import {Header} from "@components/Header/Header.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import {useMessage} from "@hooks/message.hook.js";
import {AuthContext} from "../../context/authContext.js";
import classes from "./CreateQuizPage.module.css";
import {useHttp} from "@hooks/http.hook.js";

export function CreateQuizPage(){

    const {state} = useLocation();

    const navigate = useNavigate();

    const {recordsNumber, records, quizType} = state;

    const {request, loading, messages} = useHttp();

    const {token, userId} = useContext(AuthContext);

    const [counterWords, setCounter] = useState(0);
    const [ownQuizInfo, setOwnQuizInfo] = useState(() => {
        const initialState = {};
        const selectedWords = {};
        if (records){
            records.forEach((record) => {
                selectedWords[record.eng] = {
                    wordId: record._id,
                    selected: false
                }
            });
            initialState.name = "";
            initialState.selectedWords = selectedWords;
            return initialState;
        }
        return null;
    });

    function rangeChange(event){
        setCounter(parseInt(event.target.value));
    }

    async function handleCreateQuizClick(event){
        if (quizType === "random"){
            if (counterWords === 0){
                useMessage(["You can not create quiz with no words"]);
            } else if (counterWords === 1){
                useMessage(["You need at least two words to create quiz"]);
            } else{
                navigate("/quiz/random", {
                    state: {
                        numberWords: counterWords
                    }
                });
            }
        } else{
            let counter = 0;
            for (let key in ownQuizInfo.selectedWords){
                if (ownQuizInfo.selectedWords[key].selected){
                    counter++;
                }
            }
            if (!ownQuizInfo.name){
                useMessage(["You can not create your own quiz without name"]);
            } else if (counter === 0){
                useMessage(["You can not create quiz with no words"]);
            } else if (counter === 1){
                useMessage(["You need at least two words to create quiz"]);
            } else{
                const selectedWords = [];
                for (let key in ownQuizInfo.selectedWords){
                    if (ownQuizInfo.selectedWords[key].selected){
                        selectedWords.push(ownQuizInfo.selectedWords[key].wordId);
                    }
                }
                const {name} = ownQuizInfo;
                console.log(name);
                console.log(selectedWords);
                const quizData = {
                    name: name,
                    selectedWords: selectedWords
                };
                const userData = {
                    token: token,
                    userId: userId
                };
                const headers = {
                    "Authorization": JSON.stringify(userData)
                };
                try{
                    const createQuizData = await request("https://localhost:5173/api/create/quiz", "POST", quizData, headers);
                    console.log(createQuizData);
                } catch (err){
                    console.log(err.message);
                }
            }
        }
    }

    function selectWordForQuizHandler(event){
        if (event.target.dataset.word){
            if (!ownQuizInfo.selectedWords[event.target.dataset.word].selected){
                ownQuizInfo.selectedWords[event.target.dataset.word].selected = true;
                event.target.style.background = "green";
            } else{
                ownQuizInfo.selectedWords[event.target.dataset.word].selected = false;
                event.target.style.background = "blueviolet";
            }
            setOwnQuizInfo(ownQuizInfo);
        }
    }

    function quizNameHandler(event){
        setOwnQuizInfo({...ownQuizInfo, name: event.target.value});
    }

    useEffect(() => {
        const inputRange = document.querySelector(".quiz-input-range");
        if (inputRange){
            inputRange.value = "0";
        }
    }, []);

    useEffect(() => {
        useMessage(messages);
    }, [messages]);

    return (
        <>
            <Header/>
            {
                (quizType === "random") && (
                    <>
                        <h1>Create Random Quiz Page</h1>
                        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
                            <div style={{position: "relative", left: "8px"}}>0</div>
                            <form style={{width: "80%"}} action="#">
                                <div style={{textAlign: "center"}}>Current total words for quiz: {counterWords}</div>
                                <p className="range-field">
                                    <input className={"quiz-input-range"} onChange={rangeChange} type="range" min="0" max={recordsNumber}/>
                                </p>
                            </form>
                            <div style={{position: "relative", right: "8px"}}>{recordsNumber}</div>
                        </div>
                        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
                            <button onClick={handleCreateQuizClick} className="btn waves-effect waves-light" type="button">Create random quiz</button>
                        </div>
                    </>
                ) || (
                    <>
                        <h1>Create Own Quiz Page</h1>
                        <div style={{textAlign: "center", fontSize: "18px", fontWeight: "700", margin: "25px 0 0 0"}}>Invent the name for your quiz:</div>
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <form action="">
                                <input onChange={quizNameHandler} placeholder={"Enter the quiz name:"} type="text" value={ownQuizInfo.name}/>
                            </form>
                        </div>
                        <div style={{textAlign: "center", fontSize: "18px", fontWeight: "700", margin: "25px 0 0 0"}}>Click on the words to select them to create your quiz:</div>
                        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
                            <ul onClick={selectWordForQuizHandler} className={classes.listRecords}>{
                                records.map((record, index) => {
                                    return (
                                        <li data-word={record.eng} key={index}>{record.eng}</li>
                                    );
                                })
                            }</ul>
                        </div>
                        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
                            <button disabled={loading} onClick={handleCreateQuizClick} className="btn waves-effect waves-light" type="button">Create own quiz</button>
                        </div>
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0 0 0"}}>
                            <button className="btn waves-effect waves-light" type="button"><Link to={"/"}><div style={{color: "white"}}>Back to Home Page</div></Link></button>
                        </div>
                    </>
                )
            }
        </>
    )
}
