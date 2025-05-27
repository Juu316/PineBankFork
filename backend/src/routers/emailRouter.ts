import express from "express";
import { sendOTPEmail, verifyOTP } from "../resolvers/otp/sendEmail";
export const emailRouter = express.Router();

emailRouter.post("/reset-transaction-password", async (req, res, next) => {
  try {
    const { email, name, type } = req.body;
    const result = await sendOTPEmail({ email, name, type });
    res.json(result);
  } catch (error) {
    next(error);
  }
});
