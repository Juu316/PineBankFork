import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://pinebankbackend.onrender.com",
});
// http://localhost:8000 when testing
// https://pinebank.onrender.com when deployed (Old)
// https://pinebankbackend.onrender.com  (Current)
