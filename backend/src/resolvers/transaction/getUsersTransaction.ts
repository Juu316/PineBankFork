import { getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getTransaction = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = getAuth(req);
    const { accountNumber } = req.body;

    if (!userId) {
      console.log("User ID is missing");
      return res
        .status(400)
        .json({ message: "User ID is missing from the token" });
    }

    if (!accountNumber) {
      return res.status(400).json({ message: "Account number is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user || !user.accounts.length) {
      return res
        .status(404)
        .json({ message: "No bank accounts found for user" });
    }

    const account = user.accounts.find(
      (acc) => acc.accountNumber === accountNumber
    );

    if (!account) {
      return res
        .status(404)
        .json({ message: "Account not found for this user" });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ fromAccountId: account.id }, { toAccountId: account.id }],
      },
      orderBy: {
        timestamp: "asc",
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
    const lastTransactions = transactions.slice(-10);
    let runningBalance = account.balance;
    const historyWithBalance = lastTransactions.map((tx) => {
      const isCredit = tx.toAccountId === account.id;
      const isDebit = tx.fromAccountId === account.id;

      const entry = {
        id: tx.id,
        amount: tx.amount,
        timestamp: tx.timestamp,
        reference: tx.reference,
        type: isCredit ? "CREDIT" : "DEBIT",
        fromAccountId: tx.fromAccountId,
        toAccountId: tx.toAccountId,
        runningBalance,
      };

      if (isCredit) runningBalance -= tx.amount;
      if (isDebit) runningBalance += tx.amount;

      return entry;
    });

    return res.json({
      currentBalance: account.balance,
      transactions: historyWithBalance.reverse(), // Return the latest transactions first
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
