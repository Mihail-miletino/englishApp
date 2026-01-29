import {useContext} from "react";
import {Navigate} from "react-router-dom"
import {AuthContext} from "../../context/authContext.js";

export function LogoutPage(){
    const {logout} = useContext(AuthContext);

    logout();

    return (
        <Navigate to={"/"}></Navigate>
    );
}
