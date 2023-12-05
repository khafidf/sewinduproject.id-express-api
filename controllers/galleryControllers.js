import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import multer from "multer";
import sharp from "sharp";

import "../utils/firebase.js";

import galleryModel from "../models/galleryModel.js";
import categoryModel from "../models/categoryModel.js";
import packageModel from "../models/packageModel.js";

import { validateAddPhoto, validateUpdatePhoto } from "../utils/validators.js";

const storage = getStorage();

export const upload = multer({ storage: multer.memoryStorage() }).single(
	"photo"
);

export const getAllPhotoController = async (req, res) => {
	try {
		// Get Data Photo
		const allPhoto = await galleryModel.find();

		res.status(200).json({
			message: "Get data photos successfully",
			data: allPhoto,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getPhotoController = async (req, res) => {
	const { category } = req.params;
	try {
		// Get Data Photo
		const categoryPhoto = await galleryModel.find({ category });

		res.status(200).json({
			message: "Get data photo successfully",
			data: categoryPhoto,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const addPhotoController = async (req, res) => {
	if (!req.file)
		return res.status(400).json({ photo: "Photo must not be empty" });

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

		// Resize Image
		const resizedImage = await sharp(req.file.buffer)
			.resize({ width: 1080 })
			.toBuffer();

		// Upload File to Bucket
		const snapshot = await uploadBytesResumable(
			storageRef,
			resizedImage,
			metadata
		);

		// Get URL
		const URL = await getDownloadURL(snapshot.ref);

		// Add Category
		const currentCategory = await categoryModel.findOne({ category });
		if (!currentCategory) {
			await new categoryModel({
				category,
			}).save();
		}

		// Save Data
		await new galleryModel({
			...dataPhoto,
			photoUrl: URL,
			photoName: imageFileName,
		}).save();

		res.status(200).json({
			message: "Upload Photo Successfully",
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

		// Add Category
		const currentCategory = await categoryModel.findOne({ category });
		if (!currentCategory) {
			await new categoryModel({
				category,
			}).save();
		}

		// Delete Category
		const categoryGallery = await galleryModel.findOne({
			category: photo.category,
		});

		const categoryPackage = await packageModel.findOne({
			category: photo.category,
		});

		if (!categoryGallery && !categoryPackage) {
			await categoryModel.findOneAndDelete({ category: photo.category });
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

		// Delete Category
		const categoryGallery = await galleryModel.findOne({
			category: photo.category,
		});

		const categoryPackage = await packageModel.findOne({
			category: photo.category,
		});

		if (!categoryGallery && !categoryPackage) {
			await categoryModel.findOneAndDelete({ category: photo.category });
		}

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
