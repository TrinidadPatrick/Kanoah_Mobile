import axios from "axios";

export default axios.create({
    // baseURL : "http://192.168.55.102:5000/api/",
    baseURL : "https://kanoah.onrender.com/api/",
    headers : {
        "Content-Type" : "Application/json"
    }
});