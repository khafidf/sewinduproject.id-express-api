import { Schema, Types, model } from "mongoose";

const Token = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			required: true,
			ref: "user",
		},
		token: {
			type: String,
			required: true,
		},
		expiredAt: {
			type: Date,
			default: Date.now,
			index: { expires: 180 },
		},
	},
	{ versionKey: false }
);

export default model("tokens", Token);
