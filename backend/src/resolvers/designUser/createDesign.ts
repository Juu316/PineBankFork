import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/express";

const prisma = new PrismaClient();

export const createDesign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { toAccountNumber, designName } = req.body;
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(400).json({ message: "User ID is missing from the token" });
      return;
    }

    if (!toAccountNumber || !designName) {
      res.status(400).json({ message: "Missing required fields: toAccountNumber and/or designName" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // 🔍 Find bank account by account number
    const toAccount = await prisma.bankAccount.findUnique({
      where: { accountNumber: toAccountNumber },
    });

    if (!toAccount) {
      res.status(404).json({ message: "Account with this number not found" });
      return;
    }

    const createdDesign = await prisma.design.create({
      data: {
        toAccountId: toAccount.id,
        toAccountNumber: toAccount.accountNumber,
        designName,
        userId,
      },
    });

    res.status(201).json({
      message: "Design created successfully",
      design: createdDesign,
    });
  } catch (error) {
    console.error("Design creation error:", error);
    res.status(500).json({ message: "Design creation failed" });
  }
};


