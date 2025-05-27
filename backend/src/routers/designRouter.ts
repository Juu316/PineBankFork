import express from "express";
import { createDesign } from "../resolvers/designUser/createDesign";
import { deleteDesign } from "../resolvers/designUser/deleteDesign";

export const designRouter = express.Router();

designRouter.post("/", createDesign);
designRouter.delete("/", deleteDesign); 
