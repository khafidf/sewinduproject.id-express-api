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
		date: {
			day: {
				type: String,
				required: true,
			},

			time: [
				{
					type: String,
					required: true,
				},
			],
		},
		orderId: {
			type: String,
			required: true,
		},
		virtualAccount: {
			type: String,
			require: true,
		},
	},
	{
		versionKey: false,
	}
);

export default model("bookings", Booking);
