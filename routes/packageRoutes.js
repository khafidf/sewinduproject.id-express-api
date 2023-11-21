import express from "express";
const router = express.Router();

import { isAdmin, requireSignIn } from "../utils/jwt.js";

import {
	addPackageController,
	deletePackageController,
	getPackageController,
	updatePackageController,
	upload,
} from "../controllers/packageControllers.js";

// Admin - Client
router.get("/:category", getPackageController);

// Admin
router.post("/add", requireSignIn, isAdmin, upload, addPackageController);
router.put(
	"/update/:_id",
	requireSignIn,
	isAdmin,
	upload,
	updatePackageController
);
router.delete("/delete/:_id", requireSignIn, isAdmin, deletePackageController);

export default router;
