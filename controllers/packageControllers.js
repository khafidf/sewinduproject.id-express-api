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
import galleryModel from "../models/galleryModel.js";
import categoryModel from "../models/categoryModel.js";

import {
	validateAddPackage,
	validateUpdatePhoto,
} from "../utils/validators.js";

const storage = getStorage();

export const upload = multer({ storage: multer.memoryStorage() }).single(
	"photo"
);

export const getAllPackageController = async (req, res) => {
	try {
		// Get Data Packages
		const allPackages = await packageModel.find();

		res.status(200).json({
			message: "Get data package successfully",
			data: allPackages,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getPackageController = async (req, res) => {
	const { category } = req.params;
	try {
		const packageByCategory = await packageModel.find({ category });

		res.status(200).json({
			message: "Get data package successfully",
			data: packageByCategory,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getPackageDetailsController = async (req, res) => {
	const { _id } = req.params;

	try {
		const packageDetails = await packageModel.findById(_id);

		res.status(200).json({
			data: packageDetails,
			message: "Details package",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const addPackageController = async (req, res) => {
	if (!req.file)
		return res.status(400).json({ photo: "Photo must not be empty" });

	const { category, desc, price, hour, name } = req.body;
	const { mimetype } = req.file;

	const dataPackage = { category, desc, price, hour, name, mimetype };
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

		// Add Category
		const currentCategory = await categoryModel.findOne({ category });
		if (!currentCategory) {
			await new categoryModel({
				category,
			}).save();
		}

		// Save Data
		await new packageModel({
			...dataPackage,
			photoUrl: URL,
			photoName: imageFileName,
		}).save();

		res.status(200).json({
			message: "Upload Package Successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const updatePackageController = async (req, res) => {
	const { _id } = req.params;
	const { category, desc, price, name } = req.body;

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

		// Add Category
		const currentCategory = await categoryModel.findOne({ category });
		if (!currentCategory) {
			await new categoryModel({
				category,
			}).save();
		}

		// Delete Category
		const categoryGallery = await galleryModel.findOne({
			category: packageData.category,
		});

		const categoryPackage = await packageModel.findOne({
			category: packageData.category,
		});

		if (!categoryGallery && !categoryPackage) {
			await categoryModel.findOneAndDelete({ category: packageData.category });
		}

		// Update Category, Description, Price
		packageData.category = category;
		packageData.desc = desc;
		packageData.price = price;
		packageData.name = name;

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

		// Delete Category
		const categoryGallery = await galleryModel.findOne({
			category: packageData.category,
		});

		const categoryPackage = await packageModel.findOne({
			category: packageData.category,
		});

		if (!categoryGallery && !categoryPackage) {
			await categoryModel.findOneAndDelete({ category: packageData.category });
		}

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
