import { Schema, model } from "mongoose";

const Gallery = new Schema(
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
	},
	{
		versionKey: false,
	}
);

export default model("galleries", Gallery);
