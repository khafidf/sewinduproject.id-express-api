import express from "express";
const router = express.Router();

import { isAdmin, requireSignIn } from "../utils/jwt.js";

import { upload } from "../controllers/packageController.js";

router.get("/:category");
router.post("/add", requireSignIn, isAdmin, upload);
router.put("/update/:_id", requireSignIn, isAdmin, upload);
router.delete("/delete", requireSignIn, isAdmin);

export default router;
