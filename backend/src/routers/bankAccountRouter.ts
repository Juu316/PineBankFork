import express from "express";
import { createAccount } from "../resolvers/account/createAccount";
import { getTransaction } from "../resolvers/transaction/getUsersTransaction";
import { deleteAccount } from "../resolvers/account/deleteAccount";
export const accountRouter = express.Router();

accountRouter.post("/", createAccount);
accountRouter.get("/statement/:accountNumber", getTransaction);
accountRouter.delete("/:accountId", deleteAccount);
