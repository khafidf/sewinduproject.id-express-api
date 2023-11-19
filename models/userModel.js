import { Schema, model } from "mongoose";

const User = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		roles: {
			type: String,
			default: "0",
		},
	},
	{
		versionKey: false,
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.role;
			},
		},
	}
);

export default model("users", User);
