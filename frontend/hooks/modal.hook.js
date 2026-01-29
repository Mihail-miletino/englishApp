import {useState, useEffect} from "react";

export function useModal(modalId){

    const [modal, setModal] = useState(null);
    const [overlay, setOverlay] = useState(null);

    const getOverlay = () => {
        const overlay = document.querySelector(".modal-overlay");
        setOverlay(overlay);
    }

    useEffect(() => {
        const modalElem = document.querySelector(`#${modalId}`);
        const instance = M.Modal.init(modalElem);
        setModal(instance);
    }, []);

    return {modal, overlay, getOverlay}
}
