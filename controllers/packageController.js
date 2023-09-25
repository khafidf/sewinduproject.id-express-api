import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import multer from "multer";

import "../utils/firebase.js";

import packageModel from "../models/packageModel.js";

import {
	validateAddPackage,
	validateUpdatePhoto,
} from "../utils/validators.js";

const storage = getStorage();

export const upload = multer({ storage: multer.memoryStorage() }).single(
	"photo"
);

// GET Package
// POST Package
// PUT Package
// DELETE Package
