import {createContext} from "react";

function noop(){

}

const authContext = {
    login: noop,
    logout: noop,
    token: null,
    userId: null,
    isAuthenticated: false
}

export const AuthContext = createContext(authContext);
