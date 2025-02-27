import axios from "axios";

const baseURL = "http://localhost:5000/api";

const http = axios.create({
  baseURL,
});

export default http;
