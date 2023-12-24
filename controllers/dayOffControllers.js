import dayOffModel from "../models/dayoffModel.js";

export const getDayOffController = async (req, res) => {
	try {
		const dataDays = await dayOffModel.find();

		res.status(200).json({
			data: dataDays,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const saveDayOffController = async (req, res) => {
	const days = req.body;
	try {
		await dayOffModel.deleteMany();

		for (const day of days) {
			await new dayOffModel({
				date: day,
			}).save();
		}

		await res.status(200).json({
			message: "Datas saved",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};
