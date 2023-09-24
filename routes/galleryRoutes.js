import express from "express";
const router = express.Router();

import { isAdmin, requireSignIn } from "../utils/jwt.js";
import {
	addPhotoController,
	deletePhotoController,
	getPhotoController,
	updatePhotoController,
	upload,
} from "../controllers/galleryControllers.js";

// Admin - Client
router.get("/photo/:category", getPhotoController);

// Admin
router.post("/add-photo", requireSignIn, isAdmin, upload, addPhotoController);
router.put(
	"/update-photo/:_id",
	requireSignIn,
	isAdmin,
	upload,
	updatePhotoController
);
router.delete(
	"/delete-photo/:_id",
	requireSignIn,
	isAdmin,
	deletePhotoController
);

export default router;
