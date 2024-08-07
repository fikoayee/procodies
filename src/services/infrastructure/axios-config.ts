import axios from "axios";

const api = axios.create({
  // baseURL: "https://postman-echo.com",
  baseURL: "https://httpbin.org",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json", //this line solved cors
  },
});

export default api;
