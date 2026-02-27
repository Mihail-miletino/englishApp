import {useEffect, useState} from "react";
import classes from "@components/Slider/Slider.module.css";

export function useSlider(){

    const [slider, setSlider] = useState(null);

    const originalHandleIndicatorClick = M.Slider.prototype._handleIndicatorClick;
    M.Slider.prototype._handleIndicatorClick = function(event){
        originalHandleIndicatorClick.apply(this, [event]);
        this.pause();
    }
    M.Slider.prototype.next = function(){
        let newIndex = this.activeIndex + 1;
        if (newIndex < this.$slides.length){
            this.set(newIndex);
        }
    }
    M.Slider.prototype.prev = function(){
        let newIndex = this.activeIndex - 1;

        if (newIndex >= 0){
            this.set(newIndex);
        }
    }

    useEffect(() => {
        if (slider){
            const buttonNext = document.querySelector(`.${classes.sliderButtonNext}`);
            const buttonPrev = document.querySelector(`.${classes.sliderButtonPrev}`);
            buttonNext.click();
            buttonPrev.click();
            buttonNext.click();
            buttonPrev.click();
        }
    }, [slider]);

    return {slider, setSlider};
}
