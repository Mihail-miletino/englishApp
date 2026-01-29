import {Link} from "react-router-dom";
import {useModal} from "@hooks/modal.hook.js";
import {LogoutModal} from "@components/LogoutModal/LogoutModal.jsx";

export function Header(){

    const {modal} = useModal("logout");

    function showLogoutModal(event){
        modal.open();
    }

    return (
        <header>
            <nav>
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo">Logo</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            <Link to={"/"}>Home</Link>
                        </li>
                        <li>
                            <Link to={"/words"}>Words</Link>
                        </li>
                        <li>
                            <Link to={"/create"}>Create</Link>
                        </li>
                        <li>
                            <Link to={"/login"}>Login</Link>
                        </li>
                        <li>
                            <Link onClick={showLogoutModal} to={""}>Logout</Link>
                        </li>
                        <li>
                            <Link to={"/reg"}>Sign up</Link>
                        </li>
                        <li>
                            <Link to={"/office"}>Office</Link>
                        </li>
                    </ul>
                </div>
                <LogoutModal/>
            </nav>
        </header>
    )
}
