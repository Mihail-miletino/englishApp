import {Header} from "@components/Header/Header.jsx";
import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../../context/authContext.js";
import {useHttp} from "@hooks/http.hook.js";
import classes from "./RecordsPage.module.css";
import {ModalRecords} from "@components/ModalRecords/ModalRecords.jsx";
import {useModal} from "@hooks/modal.hook.js";

export function RecordsPage(){

    const [engTrans, setEngTrans] = useState({eng: ""});
    const [rusTrans, setRusTrans] = useState({rus: ""});
    const [recordId, setRecordId] = useState(null);
    const [wordId, setWordId] = useState(null);
    const [records, setRecords] = useState([]);

    const {token, userId} = useContext(AuthContext);

    const {modal, overlay, getOverlay} = useModal("modalwords1");

    const {request} = useHttp();

    useEffect(() => {
        async function getRecords(){
            const userData = {
                token: token,
                userId: userId
            };
            try{
                const data = await request("/api/records/get", "GET", null, {
                    "Authorization": JSON.stringify(userData)
                });
                setRecords(data.records);
            } catch (err){
                console.log(`Ошибка: ${err}`);
            }
        }
        getRecords();
    }, []);

    useEffect(() => {
        if (modal){
            modal.open();
            getOverlay();
        }
    }, [engTrans, rusTrans]);

    function showTranslation(event){
        const elem = event.target;
        if (elem.dataset.record){
            setEngTrans({eng: elem.dataset.engtrans});
            setRusTrans({rus: elem.dataset.rustrans});
            setRecordId(elem.dataset.id);
            setWordId(elem.dataset.wid);
        }
    }

    return (
        <>
            <Header/>
            <h1>Records Page</h1>
            <ModalRecords display={"none"} overlay={overlay} engTrans={engTrans.eng} rusTrans={rusTrans.rus} recordId={recordId} wordId={wordId} setRecords={setRecords} modal={modal}/>
            <div className={classes.wordsContainer}>
                <ul onClick={showTranslation} className={classes.wordsList}>
                    {
                        records.map((record, index) => {
                            return (
                                <li key={index} data-record={true} data-wid={record.word} data-id={record._id} data-rustrans={record.rus} data-engtrans={record.eng} className={classes.wordsListItem}>{record.eng}</li>
                            );
                        })
                    }
                </ul>
            </div>
        </>
    )
}
