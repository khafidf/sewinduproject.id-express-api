import express from "express";
const router = express.Router();

import { requireSignIn } from "../utils/jwt.js";
import {
	getHistoryController,
	getAllBookingController,
	getBookingPerDayController,
	createTransactionController,
} from "../controllers/bookingControllers.js";

router.get("/history", requireSignIn, getHistoryController);
router.get("/schedule", getAllBookingController);
router.get("/:day", getBookingPerDayController);
router.post("/create-transaction", requireSignIn, createTransactionController);

export default router;
