import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Client Access
export const requireSignIn = async (req, res, next) => {
	let token = req.cookies.authToken || null;
	if (!token) return res.status(401).json({ message: "Unauthorized" });

	try {
		const decode = JWT.verify(token, process.env.JWT_SECRET);
		req.user = decode;
		next();
	} catch (error) {
		res.status(401).json({
			message: "Token not valid",
			error,
		});
	}
};

// Admin Access
export const isAdmin = async (req, res, next) => {
	try {
		const user = await userModel.findById(req.user?._id);
		if (user.role !== 1) {
			return res.status(401).json({ message: "UnAuthorized access" });
		}
		next();
	} catch (error) {
		res.status(401).json({
			message: "Error in admin middelware",
			error,
		});
	}
};
