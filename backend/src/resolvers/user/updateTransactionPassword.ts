import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/express";
const prisma = new PrismaClient();

export const updateTransactionPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      console.log("User ID is missing");
      return res
        .status(400)
        .json({ message: "User ID is missing from the token" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    const { password } = req.body; // Get the new transaction password from the request body
    if (!password) {
      return res
        .status(400)
        .json({ message: "Transaction password is required" });
    }
    // Update the transaction password
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        transactionPassword: password, // Update the transactionPassword field
      },
    });
    return res.status(200).json({
      message: "Transaction password updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while updating the transaction password",
    });
    console.log("ERROR:", error);
  }
};
