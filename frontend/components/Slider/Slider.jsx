import {useSlider} from "@hooks/slider.hook.js";
import classes from "./Slider.module.css";
import {useEffect} from "react";

export function Slider({words, translations, setTranslations}){

    const {slider, setSlider} = useSlider();

    function clickNext(event){
        slider.next();
        slider.pause();
    }

    function clickPrev(event){
        slider.prev();
        slider.pause();
    }

    function inputChangeHandler(event){
        translations[event.target.dataset.word] = event.target.value;
        setTranslations(translations);
    }

    useEffect(() => {
        const sliderElem = document.querySelector(".slider");
        let sliderInstance = new M.Slider(sliderElem, {
            indicators: true,
            height: 300,
            duration: 500,
            interval: 1000
        });
        setSlider(sliderInstance);
        sliderInstance.pause();

        return () => {
            if (slider){
                slider.destroy();
            }
        }
    }, [words]);

    return (
        <div className={`slider ${classes.sliderContainer}`}>
            <ul style={{borderRadius: "10px", height: "300px"}} className="slides">{
                words.map((word, index) => {
                    return (
                        <li key={index}>
                            <div className="caption">
                                <h3>{word.eng}</h3>
                                <form action="">
                                    <input data-word={word.eng} onChange={inputChangeHandler} type="text" placeholder={"Enter russian translation:"}/>
                                </form>
                            </div>
                        </li>
                    );
                })
            }</ul>
            <div onClick={clickNext} className={`${classes.sliderButtonNext} ${classes.sliderButton}`}>{">"}</div>
            <div onClick={clickPrev} className={`${classes.sliderButtonPrev} ${classes.sliderButton}`}>{"<"}</div>
        </div>
    )
}
