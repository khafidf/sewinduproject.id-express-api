import express from "express";
const router = express.Router();

import {
	getStatusByUserController,
	getAllBookingController,
	getBookingPerDayController,
	createTransactionController,
} from "../controllers/bookingControllers.js";

router.get("/status-order/:userId", getStatusByUserController);
router.get("/schedule", getAllBookingController);
router.get("/:day", getBookingPerDayController);
router.post("/create-transaction", createTransactionController);

export default router;
