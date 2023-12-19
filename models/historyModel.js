import { Schema, Types, model } from "mongoose";

const History = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			required: true,
			ref: "user",
		},
		packageName: [
			{
				type: String,
				required: true,
			},
		],
		categoryName: [
			{
				type: String,
				required: true,
			},
		],
		statusOrder: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		orderId: {
			type: String,
			required: true,
		},
		created: {
			type: String,
			require: true,
		},
		expire: {
			type: String,
			require: true,
		},
		bank: {
			type: String,
			require: true,
		},
	},
	{
		versionKey: false,
	}
);

export default model("histories", History);
