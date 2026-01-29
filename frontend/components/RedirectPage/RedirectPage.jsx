import {Navigate} from "react-router-dom";

export function RedirectPage(){
    return (
        <Navigate to={"/"}></Navigate>
    )
}
