import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateBankAccountNumber } from "../../utils/generateBankAccount";
import { getAuth } from "@clerk/express";
const prisma = new PrismaClient();
 
export const createAccount = async (
  req: Request,
  res: Response
) => {
  const { type = "BUSINESS", balance = 0 } = req.body;
 
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      res.status(400).json({ message: "User ID is missing from the token" });
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
 
    if (!user) {
       res.status(404).json({ error: "User not found" });
    }
 
    const createdAccount = await prisma.bankAccount.create({
      data: {
        accountNumber: generateBankAccountNumber(),
        type,
        balance,
        user: {
          connect: { id: userId },
        },
      },
    });
 
     res.status(201).json({
      message: "Account created successfully",
      account: createdAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
     res.status(500).json({ message: "An error occurred while creating the account" });
  }
};
 