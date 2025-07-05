import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://9184-59-153-115-109.ngrok-free.app",
});
// https://9184-59-153-115-109.ngrok-free.app  MAC DEPLOYMENT (Current)
// http://localhost:8000 when testing
// https://pinebank.onrender.com when deployed (Old)
// https://pinebankbackend.onrender.com  (Fork)
