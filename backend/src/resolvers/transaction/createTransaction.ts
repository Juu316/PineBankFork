import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { timeStamp } from "console";

const prisma = new PrismaClient();

export const createTransaction = async (req: Request, res: Response) => {
  const { fromAccountId, toAccountId, amount, reference } = req.body;

  if (!fromAccountId || !toAccountId || !amount || isNaN(amount)) {
    res.status(400).json({ message: "Invalid transaction data" });
  }

  try {
    const fromAccount = await prisma.bankAccount.findUnique({
      where: { id: fromAccountId },
    });

    const toAccount = await prisma.bankAccount.findUnique({
      where: { id: toAccountId },
    });

    if (!fromAccount || !toAccount) {
      res.status(404).json({ message: "One or both accounts not found" });
    }

    if (fromAccount && fromAccount.balance < amount) {
      res.status(400).json({ message: "Insufficient balance" });
    } else {
      const transaction = await prisma.$transaction(async (tx) => {
        const createdTransaction = await tx.transaction.create({
          data: {
            fromAccountId,
            toAccountId,
            amount: Number(amount),
            reference,
            status: "COMPLETED",
          },
        });

        if (fromAccountId) {
          await tx.bankAccount.update({
            where: { id: fromAccountId },
            data: {
              balance: {
                decrement: Number(amount),
              },
            },
          });
        }

        if (toAccountId) {
          await tx.bankAccount.update({
            where: { id: toAccountId },
            data: {
              balance: {
                increment: Number(amount),
              },
            },
          });
        }

        await tx.transaction.update({
          where: { id: createdTransaction.id },
          data: {
            status: "COMPLETED",
          },
        });

        return createdTransaction;
      });

      res.status(201).json({
        message: "Transaction successful",
        transaction: {
          toAccountNumber: toAccount?.accountNumber,
          fromAccountNumber: fromAccount?.accountNumber,
          amount: transaction.amount,
          timestamp: transaction.timestamp,
          reference: transaction.reference,
        },
      });
    }
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ message: "Transaction failed" });
  }
};
