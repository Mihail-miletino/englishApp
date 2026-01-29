import {Header} from "@components/Header/Header.jsx";
import {useHttp} from "@hooks/http.hook.js";
import {useState, useContext, useEffect} from "react";
import {AuthContext} from "../../context/authContext.js";
import {useMessage} from "@hooks/message.hook.js";

export function CreatePage(){

    const [createData, setCreateData] = useState({
        eng: "",
        rus: "",
        engLower: "",
        rusLower: ""
    });

    const {token, userId} = useContext(AuthContext);

    const {request, loading, messages} = useHttp();

    function changeHandler(event){
        setCreateData({...createData, [event.target.id]: event.target.value});
    }

    async function submitHandler(event){
        event.preventDefault();
        try{
            const userData = {
                token: token,
                userId: userId
            };
            const data = await request("/api/create/record", "POST", {...createData, engLower: createData.eng.toLowerCase().trim(), rusLower: createData.rus.toLowerCase().trim()}, {
                "Authorization": JSON.stringify(userData)
            });
            console.log(data);
        } catch (err){
            console.log(`Ошибка: ${err}`);
        }
    }

    useEffect(() => {
        useMessage(messages);
    }, [messages])

    return (
        <>
            <Header/>
            <h1>Create Page</h1>
            <div style={{width: "65%"}} className="row">
                <h3 style={{textAlign: "center"}}>Create word</h3>
                <form onSubmit={submitHandler} className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                            <input onChange={changeHandler} disabled={loading} id="eng" type={"text"} className="validate" value={createData.eng}/>
                            <label htmlFor="eng">English translation</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input onChange={changeHandler} disabled={loading} id="rus" type={"text"} className="validate" value={createData.rus}/>
                            <label htmlFor="rus">Russian translation</label>
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light" type="submit">Create</button>
                </form>
            </div>
        </>
    )
}
