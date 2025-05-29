import express from "express";
import { resetTransactionPassword } from "../resolvers/user/resetTransactionPassword";
import { verifyOTPHandler } from "./../resolvers/otp/sendEmail";
export const verifyRouter = express.Router();
verifyRouter.post("/", (req, res, next) => {
  Promise.resolve(verifyOTPHandler(req, res)).catch(next);
});
verifyRouter.put("/reset", resetTransactionPassword);
