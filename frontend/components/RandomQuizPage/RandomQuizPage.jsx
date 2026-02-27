import {Header} from "@components/Header/Header.jsx";
import {Slider} from "@components/Slider/Slider.jsx";
import {useLocation, Link} from "react-router-dom";
import {useHttp} from "@hooks/http.hook.js";
import {AuthContext} from "../../context/authContext.js";
import {useEffect, useContext, useState} from "react";

export function RandomQuizPage(){

    const location = useLocation();
    const {numberWords} = location.state;

    const [translations, setTranslations] = useState({});
    const [words, setWords] = useState([]);

    const {token, userId} = useContext(AuthContext);

    const {request} = useHttp();

    function getRandomNumber(max) {
        return Math.floor(Math.random() * (max + 1));
    }

    useEffect(() => {
        async function getRecords(){
            const userData = {
                token: token,
                userId: userId
            };
            const {records} = await request("/api/records/get", "GET", null, {
                "Authorization": JSON.stringify(userData)
            });
            const selectedWords = [];
            for (let i = 0; i < numberWords; i++){
                let index = getRandomNumber(records.length - 1);
                selectedWords.push(records[index]);
                records.splice(index, 1);
            }
            setWords(selectedWords);
            setTranslations((trans) => {
                const initialTranslationsState = {};
                selectedWords.forEach((word) => {
                    initialTranslationsState[word.eng] = "";
                });
                return initialTranslationsState;
            });
        }
        getRecords();
    }, []);

    return (
        <>
            <Header/>
            <h1>Quiz Page</h1>
            <Slider words={words} translations={translations} setTranslations={setTranslations}/>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0 0 0"}}>
                <button className="btn waves-effect waves-light" type="button"><Link to={"/quizResult"} state={translations}><div style={{color: "white"}}>Get Result</div></Link></button>
            </div>
        </>
    )
}
