import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const { address, phone, image } = req.body;


    const updatedProfile = await prisma.userProfile.update({
      where: { id },
      data: {
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(image !== undefined && { image }),
      },
    });

    res.status(200).json({
      message: "User profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Error occurred while updating profile data",
    });
  }
};
