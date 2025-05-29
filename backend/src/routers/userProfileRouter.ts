import express from "express";
import { createProfile } from "../resolvers/userProfile/createProfile";
import { validate } from "../middlewares/validate";
import { userProfileSchema } from "../validators/profileSchema";
import { updateProfile } from "../resolvers/userProfile/updateProfile";
import { viewProfile } from "../resolvers/userProfile/getProfile";

export const userProfileRouter = express.Router();

userProfileRouter.post("/", validate(userProfileSchema), createProfile);
userProfileRouter.put("/:id" , validate(userProfileSchema), updateProfile);
userProfileRouter.post("/user", viewProfile);