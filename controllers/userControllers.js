import JWT from "jsonwebtoken";
import crypto from "crypto";

import userModel from "../models/userModel.js";
import tokenModel from "../models/tokenModel.js";

import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { validateLogin, validateSignup } from "../utils/validators.js";
import { sendEmail } from "../utils/sendEmail.js";

export const registerController = async (req, res) => {
	const { name, email, phoneNumber, password, confirmPassword } = req.body;
	const user = {
		name,
		email,
		phoneNumber,
		password,
		confirmPassword,
	};
	try {
		// Data Entry Validator
		const { valid, errors } = validateSignup(user);
		if (!valid) return res.status(400).json(errors);

		// Check Data Exist
		const checkData = await userModel.findOne({
			$or: [{ email }, { phoneNumber }],
		});
		if (checkData)
			return res
				.status(400)
				.json({ message: "Email or phone number already exist" });

		// Hashed Password
		const hashedPassword = await hashPassword(password);

		// Save Data
		const newUser = await new userModel({
			...user,
			password: hashedPassword,
		}).save();

		res.status(200).json({
			message: "Add new user successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const loginController = async (req, res) => {
	const { identifier, password } = req.body;
	const user = {
		identifier,
		password,
	};
	try {
		// Data Entry Validator
		const { valid, errors } = validateLogin(user);
		if (!valid) return res.status(400).json(errors);

		// Check User Exist
		const currentUser = await userModel.findOne({
			$or: [{ email: identifier }, { phoneNumber: identifier }],
		});
		if (!currentUser)
			return res.status(400).json({ message: "Register account first" });

		// Compare Password
		const compare = await comparePassword(password, currentUser.password);
		if (!compare) return res.status(401).json({ message: "Unauthorized" });

		// Token
		const token = await JWT.sign(
			{ _id: currentUser._id },
			process.env.JWT_SECRET,
			{
				expiresIn: "7d",
			}
		);

		res
			.cookie("authToken", token, { maxAge: 1000 * 60 * 60 * 24 * 7 })
			.cookie("user", currentUser.name, { maxAge: 1000 * 60 * 60 * 24 * 7 })
			.status(200)
			.json({
				name: currentUser.name,
				id: currentUser._id,
				role: currentUser.roles,
				message: "Login successfully",
				token,
			});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const logoutController = async (req, res) => {
	res.clearCookie("authToken").clearCookie("user");

	res.status(200).json({ message: "Logout berhasil" });
};

export const sendEmailController = async (req, res) => {
	if (!req.body) return res.status(400).json({ Email: "Must not be empty" });

	const { email } = req.body;
	try {
		// Check User
		const user = await userModel.findOne({ email });
		if (!user) return res.status(400).json({ Email: "User not found" });

		// Generate Token
		let expToken = await tokenModel.findOne({ userId: user._id });
		if (!expToken) {
			expToken = await new tokenModel({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		// Send Link
		const link = `Reset Password \n\nLink for reset password : ${process.env.BASE_URL}/user/reset-password/${user._id}/${expToken.token}. \n\nExpired at 3 minutes`;
		await sendEmail(user.email, "Password reset", link);

		res.status(200).json({
			message: "Reset password link sent to your email account",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const updatePasswordController = async (req, res) => {
	if (!req.body) return res.status(400).json({ Password: "Must not be empty" });

	const { password } = req.body;
	const { userId, token } = req.params;
	try {
		// Check User
		const user = await userModel.findOne({ _id: userId });
		if (!user) return res.status(400).json({ user: "Invalid link or expired" });

		// Check Token
		const expToken = await tokenModel.findOne({
			userId: user._id,
			token: token,
		});
		if (!expToken)
			return res.status(400).json({ token: "Invalid link or expired" });

		// Update Password
		const hashedPassword = await hashPassword(password);
		user.password = hashedPassword;
		await user.save();

		// Delete Token
		await tokenModel.deleteOne({ _id: expToken._id });

		res.status(200).json({
			message: "Reset password successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const profileController = async (req, res) => {
	const { _id } = req.user;
	try {
		// Get Data
		const user = await userModel.findById(_id);

		res.status(200).json({
			message: "Get data profile successfully",
			data: user,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const updateController = async (req, res) => {
	const { name, email, phoneNumber, newPassword, password } = req.body;
	try {
		// Check User
		const user = await userModel.findOne({ email });

		// Compare Current Password
		const compare = await comparePassword(password, user.password);
		if (!compare) return res.status(401).json({ message: "Wrong password" });

		// Hashed Password
		const hashed = await hashPassword(newPassword);

		// Update Data
		user.name = name;
		user.email = email;
		user.phoneNumber = phoneNumber;
		user.password = hashed;

		// Save to DB
		await user.save();

		res.status(200).json({
			message: "Update data profile successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const clientController = (req, res) => {
	res.status(200).json({ ok: true });
};

export const adminController = (req, res) => {
	res.status(200).json({ ok: true });
};
