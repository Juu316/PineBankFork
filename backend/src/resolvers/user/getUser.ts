import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/express";

const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      console.log("User ID is missing");
      res.status(400).json({ message: "User ID is missing from the token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userProfile: true,
        accounts: true,
        designs: true,
      },
    });

    if (!user) {
      // console.log("User not found");
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User data fetched successfully", user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res
      .status(500)
      .json({ message: "Error occurred while fetching user data" });
  }
};
