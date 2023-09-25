import { Schema, model } from "mongoose";

const Package = new Schema(
	{
		category: {
			type: String,
			lowercase: true,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
		photoUrl: {
			type: String,
			required: true,
		},
		photoName: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

export default model("packages", Package);
