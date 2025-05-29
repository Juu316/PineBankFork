import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAccountIncomeOutcome = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  try {
    const totalIncome = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        toAccountId: accountId,
      },
    });

    const totalOutcome = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        fromAccountId: accountId,
      },
    });

    res.status(200).json({
      totalIncome: totalIncome._sum.amount || 0,
      totalOutcome: totalOutcome._sum.amount || 0,
    });
  } catch (error) {
    console.error("Error calculating income/outcome:", error);
    res.status(500).json({ message: "Failed to calculate income/outcome" });
  }
};
