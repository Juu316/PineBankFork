// End CreateUser, DeleteUser functionuud baigaa
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const Webhook = async (req: Request, res: Response) => {
  const type: String = req.body.type;
  console.log(req.body.data);
  try {
    if (type === "user.updated") {
    }
    if (type === "user.deleted") {
      const { id } = req.body.data;
      await prisma.user.delete({
        where: { id: id },
        include: {
          userProfile: true,
          accounts: true,
        },
      });
      res.status(200).json({ message: "User deleted successfully." });
    }
    if (type === "user.created") {
      const password = "Clerk_deer_baigaa";
      const { id, email_addresses, username } = req.body.data;
      const user = await prisma.user.create({
        data: {
          email: email_addresses[0].email_address,
          username: username || null,
          password: password || null,
          transactionPassword: "",
          id: id,
        },
      });
      res.status(201).json({ message: "User synced", user });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error", error });
  }
};
