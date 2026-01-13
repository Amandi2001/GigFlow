import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend
  withCredentials: true, // for cookies if auth uses cookies
});

export default API;
