import {useState, useCallback, useEffect} from "react";

export function useAuth(){

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = useCallback((jwtToken, id) => {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("userId", id);
        setToken(jwtToken);
        setUserId(id);
    }, [token, userId]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setToken(null);
        setUserId(null);
    }

    useEffect(() => {
        const userData = {
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId")
        }
        if (userData.token && userData.userId){
            login(userData.token, userData.userId);
        } else{
            setToken(null);
            setUserId(null);
        }
    }, [login]);

    return {login, logout, token, userId};
}
