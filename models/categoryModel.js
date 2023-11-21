import { Schema, model } from "mongoose";

const Category = new Schema(
	{
		category: {
			type: String,
			lowercase: true,
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

export default model("categories", Category);
