import express from "express";
const router = express.Router();

import { getCategoryController } from "../controllers/categoryControllers.js";

// Admin - Client
router.get("/", getCategoryController);

export default router;
