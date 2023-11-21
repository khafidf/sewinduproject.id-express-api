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

export const getPackageController = async (req, res) => {
	const { category } = req.params;
	try {
		const allPackage = await packageModel.find({ category });

		res.status(200).json({
			message: "Get data package successfully",
			dataPackages: allPackage,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const addPackageController = async (req, res) => {
	if (!req.file) return res.status(400).json({ photo: "Must not be empty" });

	const { category, desc, price } = req.body;
	const { mimetype } = req.file;

	const dataPackage = { category, desc, price, mimetype };
	try {
		// Data Entry Validator
		const { valid, errors } = validateAddPackage(dataPackage);
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
		const storageRef = ref(storage, `packages/${imageFileName}`);

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

		await new packageModel({
			...dataPackage,
			photoUrl: URL,
			photoName: imageFileName,
		}).save();

		res.status(200).json({
			message: "Package uploaded",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const updatePackageController = async (req, res) => {
	const { _id } = req.params;
	const { category, desc, price } = req.body;

	try {
		const packageData = await packageModel.findById(_id);

		if (req.file) {
			// File Validator
			const { valid, errors } = validateUpdatePhoto(req.file);
			if (!valid) return res.status(400).json(errors);

			// Storage Reference
			const storageRef = ref(storage, `packages/${packageData.photoName}`);

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

			packageData.photoUrl = URL;
		}

		// Update Category, Description, Price
		packageData.category = category;
		packageData.desc = desc;
		packageData.price = price;

		// Save Updated Data
		await packageData.save();

		res.status(200).json({
			message: "Package information updated",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const deletePackageController = async (req, res) => {
	const { _id } = req.params;
	try {
		// Get Data Package and Delete
		const packageData = await packageModel.findByIdAndDelete({ _id });

		// Storage Reference
		const storageRef = ref(storage, `packages/${packageData.photoName}`);

		// Delete Photo in GCS
		await deleteObject(storageRef);

		res.status(200).json({
			message: "Package has been deleted",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};
