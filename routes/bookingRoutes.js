import express from "express";
const router = express.Router();

import {
	getStatusByUserController,
	getAllBookingController,
	createTransactionController,
} from "../controllers/bookingControllers.js";

router.get("/status-order/:userId", getStatusByUserController);
router.get("/:day", getAllBookingController);
router.post("/create-transaction", createTransactionController);

export default router;
