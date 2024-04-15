import axios from "axios";

export default axios.create({
    // baseURL : "http://192.168.1.182:5000/api/",
    baseURL : "https://kanoah.onrender.com/api/",
    headers : {
        "Content-Type" : "Application/json"
    }
});