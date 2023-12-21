import express from "express";
const router = express.Router();

import { requireSignIn, isAdmin } from "../utils/jwt.js";
import {
	getHistoryController,
	getAllBookingController,
	getBookingPerDayController,
	getOrderController,
	getAllOrderController,
	createTransactionController,
} from "../controllers/bookingControllers.js";

router.get("/history", requireSignIn, getHistoryController);
router.get("/pay-order/:orderId", requireSignIn, getOrderController);
router.get("/schedule", getAllBookingController);
router.get("/order", requireSignIn, isAdmin, getAllOrderController);
router.get("/:day", getBookingPerDayController);
router.post("/create-transaction", requireSignIn, createTransactionController);

export default router;
