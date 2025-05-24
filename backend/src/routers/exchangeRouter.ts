import express from "express";
import { getCachedRates } from "../utils/fetchExchange";

export const exchangeRouter = express.Router();

exchangeRouter.get("/", (req, res) => {
  res.json(getCachedRates());
});
