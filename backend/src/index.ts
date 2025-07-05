import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./routers/userRouter";
import { accountRouter } from "./routers/bankAccountRouter";
import { userProfileRouter } from "./routers/userProfileRouter";
import { transactionRouter } from "./routers/transactionRouter";
import { clerkMiddleware } from "@clerk/express";
import { designRouter } from "./routers/designRouter";
import { exchangeRouter } from "./routers/exchangeRouter";
import { emailRouter } from "./routers/emailRouter";
import { verifyRouter } from "./routers/verifyOtpRouter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
dotenv.config();
const app = express();
const port = process.env.PORT;
async function checkConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Successfully connected to database");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}

checkConnection();
app.use(cors({ origin: "*" }));
// app.use(
//   cors({
//     origin: [
//       "https://pine-bank.vercel.app",
//       "http://localhost:3000",
//       "https://pine-bank-fork.vercel.app",
//     ],
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(clerkMiddleware());
app.use("/exchange", exchangeRouter);
app.use("/users", userRouter);
app.use("/account", accountRouter);
app.use("/profile", userProfileRouter);
app.use("/transaction", transactionRouter);
app.use("/design", designRouter);
app.use("/mail", emailRouter);
app.use("/verify-otp", verifyRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
