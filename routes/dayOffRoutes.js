import express from "express";
const router = express.Router();

import {
	getDayOffController,
	saveDayOffController,
} from "../controllers/dayOffControllers.js";

// Admin - Client
router.get("/", getDayOffController);
router.post("/", saveDayOffController);

export default router;
