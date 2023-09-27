import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import multer from "multer";

import "../utils/firebase.js";

import galleryModel from "../models/galleryModel.js";

import { validateAddPhoto, validateUpdatePhoto } from "../utils/validators.js";

const storage = getStorage();

export const upload = multer({ storage: multer.memoryStorage() }).single(
	"photo"
);

export const getPhotoController = async (req, res) => {
	const { category } = req.params;
	try {
		// Get Data Photo
		const allPhoto = await galleryModel.find({ category });

		res.status(200).json({
			message: "Get data photo successfully",
			dataPhoto: allPhoto,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const addPhotoController = async (req, res) => {
	if (!req.file) return res.status(400).json({ photo: "Must not be empty" });

	const { category, desc } = req.body;
	const { mimetype } = req.file;

	const dataPhoto = { category, desc, mimetype };
	try {
		// Data Entry Validator
		const { valid, errors } = validateAddPhoto(dataPhoto);
		if (!valid) return res.status(400).json(errors);

		// File Name
		const imageExtension =
			req.file.originalname.split(".")[
				req.file.originalname.split(".").length - 1
			];
		let imageFileName = `${Math.round(
			Math.random() * 1000000000000
		).toString()}.${imageExtension}`;

		// Storage Reference
		const storageRef = ref(storage, `photos/${imageFileName}`);

		// File Metadata
		const metadata = {
			contentType: req.file.mimetype,
		};

		// Upload File to Bucket
		const snapshot = await uploadBytesResumable(
			storageRef,
			req.file.buffer,
			metadata
		);

		// Get URL
		const URL = await getDownloadURL(snapshot.ref);

		// Save Data
		await new galleryModel({
			...dataPhoto,
			photoUrl: URL,
			photoName: imageFileName,
		}).save();

		res.status(200).json({
			message: "Photo uploaded",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const updatePhotoController = async (req, res) => {
	const { _id } = req.params;
	const { category, desc } = req.body;
	try {
		// Get Data Photo
		const photo = await galleryModel.findById(_id);

		if (req.file) {
			// File Validator
			const { valid, errors } = validateUpdatePhoto(req.file);
			if (!valid) return res.status(400).json(errors);

			// Storage Reference
			const storageRef = ref(storage, `photos/${photo.photoName}`);

			// File Metadata
			const metadata = {
				contentType: req.file.mimetype,
			};

			// Upload File to Bucket
			const snapshot = await uploadBytesResumable(
				storageRef,
				req.file.buffer,
				metadata
			);

			// Get URL
			const URL = await getDownloadURL(snapshot.ref);

			photo.photoUrl = URL;
		}

		// Update Category and Description
		photo.category = category;
		photo.desc = desc;

		// Save Updated Data
		await photo.save();

		res.status(200).json({
			message: "Photo information updated",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const deletePhotoController = async (req, res) => {
	const { _id } = req.params;
	try {
		// Get Data Photo and Delete
		const photo = await galleryModel.findOneAndDelete({ _id });

		// Storage Reference
		const storageRef = ref(storage, `photos/${photo.photoName}`);

		// Delete Photo in GCS
		await deleteObject(storageRef);

		res.status(200).json({
			message: "Photo has been deleted",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};
