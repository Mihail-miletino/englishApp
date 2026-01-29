import {useHttp} from "@hooks/http.hook.js";
import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../../context/authContext.js";
import classes from "@components/RecordsPage/RecordsPage.module.css";
import {useMessage} from "@hooks/message.hook.js";

export function ModalRecords({display, overlay, engTrans, rusTrans, recordId, wordId, setRecords, modal}){

    const [edit, setEdit] = useState(false);
    let [editedData, setEditedData] = useState({
        eng: engTrans,
        rus: rusTrans,
        engLower: "",
        rusLower: ""
    });

    const {token, userId} = useContext(AuthContext);

    const {request, loading, messages} = useHttp();

    function editClickHandler(event){
        setEdit(!edit);
    }

    async function deleteClickHandler(event){
        const deleteData = {
            wordId: wordId
        };
        const userData = {
            token: token,
            userId: userId
        };
        try{
            const data = await request(`/api/records/delete/${recordId}`, "DELETE", deleteData, {"Authorization": JSON.stringify(userData)});
            console.log(data);
            const {deletedRecordId} = data;
            setRecords((records) => {
                const arrRecords = records.filter((record) => (record._id !== deletedRecordId) ? record : null);
                return arrRecords;
            });
            modal.close();
            setEdit(false);
        } catch (err){
            console.log(`Ошибка: ${err}`);
        }
    }

    function editChangeHandler(event){
        setEditedData({...editedData, [event.target.id]: event.target.value});
    }

    async function editSubmitHandler(event){
        event.preventDefault();
        try {
            const userData = {
                token: token,
                userId: userId
            };
            editedData = {...editedData, engLower: editedData.eng.toLowerCase().trim(), rusLower: editedData.rus.toLowerCase().trim(), wordId: wordId};
            const data = await request(`/api/records/update/${recordId}`, "PATCH", editedData, {"Authorization": JSON.stringify(userData)});
            console.log(data);
            const {eng, rus, wId} = data.recordData;
            setRecords((records) => {
                const arrRecords = records.map((record) => (record._id !== recordId) ? record : {_id: recordId, eng: eng, rus: rus, word: wId});
                return arrRecords;
            });
        } catch (err){
            console.log(`Ошибка: ${err}`);
        }
    }

    useEffect(() => {
        if (!edit){
            setEditedData({
                eng: "",
                rus: ""
            });
        } else{
            setEditedData({
                eng: engTrans,
                rus: rusTrans
            });
        }
    }, [edit]);

    useEffect(() => {
        function clickHandler(event){
            setEdit(false);
            setEditedData({
                eng: "",
                rus: ""
            });
        }
        if (overlay){
            overlay.addEventListener("click", clickHandler);
        }
        return () => {
            if (overlay){
                overlay.removeEventListener("click", clickHandler);
            }
        }
    }, [overlay]);

    useEffect(() => {
        useMessage(messages);
    }, [messages]);

    return (
        <>
            <a style={{display: display}} className="waves-effect waves-light btn modal-trigger" href="#modalwords1"></a>
            <div id="modalwords1" className="modal">
                <div style={{position: "relative"}} className="modal-content">
                    {!edit && (
                        <>
                            <h4 style={{color: "#000"}}>{engTrans}</h4>
                            <p style={{color: "#000"}}>{rusTrans}</p>
                        </>
                    ) || (
                        <>
                            <form onSubmit={editSubmitHandler} action="">
                                <div className={"input-edit-wrapper"}>
                                    <input disabled={loading} onChange={editChangeHandler} placeholder={"English word"} id={"eng"} type="text" value={editedData.eng}/>
                                </div>
                                <div className={"input-edit-wrapper"}>
                                    <input disabled={loading} onChange={editChangeHandler} placeholder={"Russian word"} id={"rus"} type="text" value={editedData.rus}/>
                                </div>
                                <button disabled={loading} className="btn waves-effect waves-light" type="submit" name="action">Submit</button>
                            </form>
                        </>
                    )}
                    <div className={classes.modalButtonsContainer}>
                        <div onClick={deleteClickHandler} style={{fontSize: "16px", cursor: "pointer", background: "#ee6e73", padding: "5px 10px 5px 10px", borderRadius: "5px", color: "white"}} className={"delete"}>Delete</div>
                        <div onClick={editClickHandler} style={{fontSize: "16px", cursor: "pointer", background: "#ee6e73", padding: "5px 10px 5px 10px", borderRadius: "5px", color: "white"}} className={"edit"}>{(!edit) ? "Edit" : "Cancel"}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
