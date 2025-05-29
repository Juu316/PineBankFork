// src/validators/userSchemas.ts
import { z } from "zod";

export const userSignupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  transactionPassword: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(6),
}).refine(data => data.email || data.username, {
  message: "Either email or username is required",
  path: ["email", "username"]
});

