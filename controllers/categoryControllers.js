import categoryModel from "../models/categoryModel.js";

export const getCategoryController = async (req, res) => {
	try {
		// Get Data Categories
		const categoryData = await categoryModel.find();

		res.status(200).json({
			data: categoryData,
			message: "Get data categories successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};
