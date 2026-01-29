import {RouterProvider} from "react-router-dom";
import {useRoutes} from "./routes.hook.jsx";
import {AuthContext} from "../context/authContext.js";
import {useAuth} from "@hooks/auth.hook.js";

export default function App(){

    const {login, logout, userId, token} = useAuth();

    const isAuthenticated = !!token;

    console.log(token);

    console.log(isAuthenticated);

    const router = useRoutes(isAuthenticated);

    return (
        <AuthContext value={{login, logout, token, userId, isAuthenticated}}>
            <RouterProvider router={router}/>
        </AuthContext>
    )
}
