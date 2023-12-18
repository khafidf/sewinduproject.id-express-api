import express from "express";
const router = express.Router();

import { createTransaction } from "../controllers/bookingControllers.js";

router.post("/create-transaction", createTransaction);

export default router;
