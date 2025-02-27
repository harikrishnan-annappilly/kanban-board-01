import axios from "axios";

const baseURL = `http://${location.hostname}:5000/api`;

const http = axios.create({
    baseURL,
});

export default http;
