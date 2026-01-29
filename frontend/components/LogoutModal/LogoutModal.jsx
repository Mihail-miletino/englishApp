import {AuthContext} from "../../context/authContext.js";
import {useContext} from "react";

export function LogoutModal(){

    const {logout} = useContext(AuthContext);

    function toLogout(event){
        if (event.target.dataset.ans === "yes"){
            logout();
        }
    }

    return (
        <>
            <a style={{display: "none"}} className="waves-effect waves-light btn modal-trigger" href="#logout">Modal</a>

            <div id="logout" className="modal">
                <div className="modal-content">
                    <h4 style={{color: "#000"}}>Logout</h4>
                    <p style={{color: "#000"}}>Do you really want to logout?</p>
                </div>
                <div className="modal-footer">
                    <a onClick={toLogout} href="#!" data-ans={"yes"} className="modal-close waves-effect waves-green btn-flat">YES</a>
                    <a onClick={toLogout} href="#!" data-ans={"no"} className="modal-close waves-effect waves-green btn-flat">NO</a>
                </div>
            </div>
        </>
    );
}
