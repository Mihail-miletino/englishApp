import {Header} from "@components/Header/Header.jsx";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/authContext.js";
import {useHttp} from "@hooks/http.hook.js";
import classes from "./UserOffice.module.css";

export function UserOffice(){

    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        records: 0
    });

    const {userId, token} = useContext(AuthContext);

    const {request} = useHttp();

    useEffect(() => {
        async function getOffice(){
            const userData = {
                userId: userId,
                token: token
            };
            try{
                const data = await request("/api/auth/office", "GET", null, {"Authorization": JSON.stringify(userData)});
                console.log(data);
                setUserInfo(data.userInfo);
            } catch(err){
                console.log(`Ошибка: ${err}`);
            }
        }
        getOffice();
    }, []);

    return (
        <>
            <Header/>
            <h1>Office</h1>
            <h3>Info:</h3>
            <div className={classes.userInfoContainer}>
                <div className={classes.userInfoContainerItem}>{`Username: `}<span>{userInfo.username}</span></div>
                <div className={classes.userInfoContainerItem}>{`Email: `}<span>{userInfo.email}</span></div>
                <div className={classes.userInfoContainerItem}>{`Number of records: `}<span>{userInfo.records}</span></div>
            </div>
        </>
    )
}
