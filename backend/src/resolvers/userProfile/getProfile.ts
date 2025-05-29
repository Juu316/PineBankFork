import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const viewProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { accountNumber } = req.body;
    const userID = await prisma.bankAccount.findUnique({
      where: {
        accountNumber: accountNumber,
      },
      select: {
        userId: true,
        id: true,
      },
    });    

    if (!userID) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    const userInfo = await prisma.user.findUnique({
      where: {
        id: userID.userId,
      },
      select: {
        userProfile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        accounts: {
          where: {
            id: userID.id,
          },
          select: {
            id: true, 
          },
        },
      },
    });
    

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User data fetched successfully", userInfo });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error occurred while fetching user data" });
  }
};

