import { Schema, Types, model } from "mongoose";

const Booking = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			required: true,
			ref: "user",
		},
		packageId: {
			type: Types.ObjectId,
			required: true,
			ref: "package",
		},
		date: [
			{
				type: Date,
				required: true,
			},
			{
				type: Date,
				default: null,
			},
		],
		status: {
			type: Number,
			default: 0,
		},
	},
	{
		versionKey: false,
	}
);

export default model("bookings", Booking);
