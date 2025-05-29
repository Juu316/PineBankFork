import express from "express";
import { createTransaction } from "../resolvers/transaction/createTransaction";
import { getAccountIncomeOutcome } from "../resolvers/transaction/accountTransaction";
import { getTransaction } from "../resolvers/transaction/getUsersTransaction";
import { getAllTransactions } from "../resolvers/transaction/getAllTransactions";

export const transactionRouter = express.Router();
transactionRouter.post("/", async (req, res) => {
  await createTransaction(req, res);
});
transactionRouter.get("/:accountId/income-outcome", getAccountIncomeOutcome);
transactionRouter.post("/get", getTransaction);
transactionRouter.get("/all/:accountNumber", getAllTransactions);
