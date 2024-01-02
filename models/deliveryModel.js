import { Schema, model, Types } from "mongoose";

const Delivery = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			required: true,
			ref: "user",
		},
		linkFile: {
			type: String,
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

export default model("deliveries", Delivery);
