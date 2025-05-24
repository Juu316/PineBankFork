import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://pine-bank-fork-backend.vercel.app",
});
// http://localhost:8000 when testing
// https://pinebank.onrender.com when deployed
// https://pine-bank-fork-backend.vercel.app VERCEL DEPLOYMENT
