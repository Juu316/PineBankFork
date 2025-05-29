import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { generateOTP } from "../../utils/otpGenerator";

const prisma = new PrismaClient();

interface SendOTPParams {
  email: string;
  name?: string;
  type?: "TRANSACTION_PASSWORD_RESET" | "EMAIL_VERIFICATION";
}

export const sendOTPEmail = async ({
  email,
  name,
  type = "TRANSACTION_PASSWORD_RESET",
}: SendOTPParams) => {
  // Generate 6-digit OTP
  const otp = generateOTP(6);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

  // Store OTP in database
  await prisma.oTP.create({
    data: {
      email,
      otp,
      expiresAt,
      type,
    },
  });

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: `"Pinebank" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Transaction Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Transaction Password Reset</h2>
        <p>Hello${name ? ` ${name}` : ""},</p>
        <p>Use this code to reset your transaction password:</p>
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold;">
          ${otp}
        </div>
        <p>This code expires in 15 minutes.</p>
        <p style="margin-top: 30px; color: #666;">The Pinebank Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}:`, info.messageId);
    return { success: true, expiresAt };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    // Clean up the OTP record if email fails
    await prisma.oTP.deleteMany({ where: { email, otp } });
    throw new Error("Failed to send OTP email");
  }
};

export const verifyOTP = async (otp: string, email: string) => {
  try {
    // Find the most recent valid OTP
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        otp,
        email,
        expiresAt: {
          gt: new Date(), // Check if OTP hasn't expired
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return null;
    }

    // Delete the OTP after successful verification
    await prisma.oTP.delete({ where: { id: otpRecord.id } });

    return otpRecord;
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
};
export const verifyOTPHandler = async (req: Request, res: Response) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({
      success: false,
      message: "OTP and email are required",
    });
  }

  try {
    const result = await verifyOTP(otp, email);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during OTP verification",
    });
  }
};
