import {useState} from "react";

export function useHttp(){

    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const request = async (url, method = "GET", body = null, headers = {}) => {
        let strBody = "";
        if (body){
            strBody = JSON.stringify(body);
            headers["Content-Type"] = "application/json";
        }
        try{
            setLoading(true);
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: (strBody) ? strBody : null
            });
            if (!response.ok){
                const dataError = await response.json();
                setLoading(false);
                if (dataError.errors){
                    const errMessages = [];
                    dataError.errors.forEach((errMessage) => {
                        errMessages.push(errMessage.msg);
                    });
                    setMessages([...errMessages, dataError.message]);
                } else{
                    setMessages([dataError.message]);
                }
                return dataError;
            }
            const data = await response.json();
            setMessages([data.message]);
            setLoading(false);
            return data;
        } catch (err){
            setLoading(false);
            setMessages(["Something went wrong"]);
            throw err;
        }
    }

    return {request, loading, messages};
}
