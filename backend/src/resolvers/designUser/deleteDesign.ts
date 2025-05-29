import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/express";

const prisma = new PrismaClient();

export const deleteDesign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { designId } = req.body;
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(400).json({ message: "User ID is missing from the token" });
      return;
    }

    if (!designId) {
      res.status(400).json({ message: "Missing required fields: designId" });
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
    const design = await prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      res.status(404).json({ message: "Design not found" });
      return;
    }

    const deletedDesign = await prisma.design.delete({
      where: { id: designId },
    });

    res.status(201).json({
      message: "Design deleted successfully",
      design: deletedDesign,
    });
  } catch (error) {
    console.error("Design delete error:", error);
    res.status(500).json({ message: "Design delete failed" });
  }
};
