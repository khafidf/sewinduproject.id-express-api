import { Schema, model } from "mongoose";

const DayOff = new Schema(
	{
		date: {
			type: String,
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

export default model("daysoff", DayOff);
