import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/express";

const prisma = new PrismaClient();

export const deleteAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = getAuth(req);
    const { accountId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the account exists and belongs to the user
    const account = await prisma.bankAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this account" });
    }

    await prisma.bankAccount.delete({
      where: { id: accountId },
    });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the account" });
  }
};
