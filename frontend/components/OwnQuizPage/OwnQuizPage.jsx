import {Header} from "@components/Header/Header.jsx";
import {useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {Slider} from "@components/Slider/Slider.jsx";

export function OwnQuizPage(){

    const location = useLocation();

    const {ownQuizWords} = location.state;

    const [words, setWords] = useState(ownQuizWords);
    const [translations, setTranslations] = useState(() => {
        const initialState = {};
        ownQuizWords.forEach((word) => {
            initialState[word.eng] = "";
        });
        return initialState;
    });

    return (
        <>
            <Header/>
            <h1>Own Quiz Page</h1>
            <Slider words={words} translations={translations} setTranslations={setTranslations}/>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0 0 0"}}>
                <button className="btn waves-effect waves-light" type="button"><Link to={"/quizResult"} state={translations}><div style={{color: "white"}}>Get Result</div></Link></button>
            </div>
        </>
    )
}
