import express from "express";
const router = express.Router();

import { isAdmin, requireSignIn } from "../utils/jwt.js";

import {
	addPackageController,
	deletePackageController,
	getAllPackageController,
	getPackageController,
	updatePackageController,
	getPackageDetailsController,
	upload,
} from "../controllers/packageControllers.js";

// Admin - Client
router.get("/", getAllPackageController);
router.get("/:category", getPackageController);
router.get("/details/:_id", getPackageDetailsController);

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
