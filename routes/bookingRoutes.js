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
	getDeliveryFile,
	addDeliveryFile,
	editDeliveryFile,
	deleteDeliveryFile,
} from "../controllers/bookingControllers.js";

// Booking
router.get("/history", requireSignIn, getHistoryController);
router.get("/pay-order/:orderId", requireSignIn, getOrderController);
router.get("/schedule", getAllBookingController);
router.get("/order", requireSignIn, isAdmin, getAllOrderController);
router.get("/:day", getBookingPerDayController);
router.post("/create-transaction", requireSignIn, createTransactionController);

// Delivery File
router.get("/delivery/:userId", requireSignIn, getDeliveryFile);
router.post("delivery", requireSignIn, isAdmin, addDeliveryFile);
router.put("/delivery", requireSignIn, isAdmin, editDeliveryFile);
router.delete("/delivery/:userId", requireSignIn, isAdmin, deleteDeliveryFile);

export default router;
