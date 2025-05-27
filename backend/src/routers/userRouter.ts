import express from "express";
import { getUser } from "../resolvers/user/getUser";
import { Webhook } from "../resolvers/user/webhook";
import { updateTransactionPassword } from "../resolvers/user/updateTransactionPassword";
export const userRouter = express.Router();
userRouter.put("/transaction-password/update", updateTransactionPassword);
userRouter.post("/webhook", Webhook);
userRouter.get("/", getUser);
