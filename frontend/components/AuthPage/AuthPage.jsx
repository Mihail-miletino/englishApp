import {Header} from "@components/Header/Header.jsx";
import {useHttp} from "@hooks/http.hook.js";
import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../../context/authContext.js";
import {useMessage} from "@hooks/message.hook.js";

export function AuthPage(){

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const {login} = useContext(AuthContext);

    const {request, loading, messages} = useHttp();

    function changeHandler(event){
        setData({...data, [event.target.id]: event.target.value});
    }

    async function submitHandler(event){
        event.preventDefault();
        try{
            const res = await request("/api/auth/login", "POST", data);
            if (res.token){
                login(res.token, res.userId);
            }
        } catch (err){
            console.log(err);
        }
    }

    useEffect(() => {
        useMessage(messages);
    }, [messages]);

    return (
        <>
            <Header/>
            <div style={{width: "65%"}} className="row">
                <h3 style={{textAlign: "center"}}>Authorization</h3>
                <form onSubmit={submitHandler} className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                            <input onChange={changeHandler} disabled={loading} id="email" type="email" className="validate" value={data.email}/>
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input onChange={changeHandler} disabled={loading} id="password" type="password" className="validate" value={data.password}/>
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                    <button disabled={loading} className="btn waves-effect waves-light" type="submit" >Submit</button>
                </form>
            </div>
        </>
    )
}
