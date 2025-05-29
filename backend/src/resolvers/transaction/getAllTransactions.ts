import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { filterByDateRange } from "../../utils/filterTransactionByDay";

const prisma = new PrismaClient();

export const getAllTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { accountNumber } = req.params;
    const { dateRange } = req.body;
    const account = await prisma.bankAccount.findUnique({
      where: {
        accountNumber: accountNumber,
      },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!account) {
      console.log("Bank account not found");
      return res.status(400).json({ message: "Bank account not found" });
    }

    const transactionsRaw = await prisma.transaction.findMany({
      where: {
        OR: [{ fromAccountId: account.id }, { toAccountId: account.id }],
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        id: true,
        amount: true,
        timestamp: true,
        reference: true,
        fromAccountId: true,
        toAccountId: true,
      },
    });

    // Add balanceAfterTransaction property as required by TransactionType
    const transactions = transactionsRaw.map((tx) => ({
      ...tx,
      balanceAfterTransaction: null,
    }));

    const filterDateTransactions = filterByDateRange(transactions, dateRange);
    let runningBalance = 0;
    const historyWithBalance = filterDateTransactions.map((tx) => {
      const isCredit = tx.toAccountId === account.id;
      const isDebit = tx.fromAccountId === account.id;

      if (isCredit) {
        runningBalance += tx.amount;
      } else if (isDebit) {
        runningBalance -= tx.amount;
      }

      return {
        id: tx.id,
        amount: tx.amount,
        timestamp: tx.timestamp,
        reference: tx.reference,
        type: isCredit ? "CREDIT" : "DEBIT",
        runningBalance,
      };
    });

    res.json({
      message: "User data fetched successfully",
      currentBalance: account.balance,
      transactions: historyWithBalance,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error occurred while fetching user data" });
  }
};
