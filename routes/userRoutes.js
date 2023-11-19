import express from "express";
const router = express.Router();

// Controllers
import {
	loginController,
	registerController,
	sendEmailController,
	updatePasswordController,
	profileController,
	updateController,
	clientController,
	adminController,
	logoutController,
} from "../controllers/userControllers.js";

import { isAdmin, requireSignIn } from "../utils/jwt.js";

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", sendEmailController);
router.post("/reset-password/:userId/:token", updatePasswordController);
router.post("/logout", logoutController);

// Admin - Client
router.get("/", requireSignIn, profileController);
router.put("/update", requireSignIn, updateController);

// Client Proctected
router.get("/client-auth", requireSignIn, clientController);

// Admin Protected
router.get("/admin-auth", requireSignIn, isAdmin, adminController);

export default router;
