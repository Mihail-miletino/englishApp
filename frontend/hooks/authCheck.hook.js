export function useAuthCheck(){
    const userData = {
        token: localStorage.getItem("token"),
        userId: localStorage.getItem("userId")
    }
    if (userData.token && userData.userId){
        return true;
    }
    return false;
}
