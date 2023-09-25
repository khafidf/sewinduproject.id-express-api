const isEmail = (email) => {
	const regEx =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return email.match(regEx) ? true : false;
};

const isPassword = (password) => {
	const regEx = /^(?=.*[a-z])(?=.*\d).{8,}$/;
	return password.match(regEx) ? true : false;
};

const isPhoneNumber = (phoneNumber) => {
	const regEx = /^(?:\+62|62|0)(?:\d{9,13})$/;
	return phoneNumber.match(regEx) ? true : false;
};

const isEmpty = (data) => {
	return data.trim() === "" ? true : false;
};

const isPhoto = (data) => {
	return data != "image/jpeg" && data !== "image/png" ? true : false;
};

export const validateSignup = (data) => {
	let errors = {};

	isEmpty(data.email)
		? (errors.email = "Must not be empty")
		: !isEmail(data.email) && (errors.email = "Must be a valid email address");
	isEmpty(data.password)
		? (errors.password = "Must not be empty")
		: !isPassword(data.password)
		? (errors.password =
				"Password at least 8 characters and contains lowercase, and number")
		: data.password !== data.confirmPassword &&
		  (errors.confirmPassword = "Passwords must match");
	isEmpty(data.name) && (errors.name = "Must not be empty");
	isEmpty(data.phoneNumber)
		? (errors.phoneNumber = "Must not be empty")
		: !isPhoneNumber(data.phoneNumber) &&
		  (errors.phoneNumber = "Must be a valid Indonesian number");

	return {
		valid: Object.keys(errors).length === 0 ? true : false,
		errors,
	};
};

export const validateLogin = (data) => {
	let errors = {};

	isEmpty(data.identifier)
		? (errors.identifier = "Must not be empty")
		: isEmail(data.identifier) || isPhoneNumber(data.identifier)
		? null
		: (errors.identifier = "Must be a valid email address or phone number");
	isEmpty(data.password)
		? (errors.password = "Must not be empty")
		: !isPassword(data.password) &&
		  (errors.password =
				"Password at least 8 characters and contains lowercase, and number");
	return {
		valid: Object.keys(errors).length === 0 ? true : false,
		errors,
	};
};

export const validateAddPhoto = (data) => {
	let errors = {};

	isEmpty(data.category) && (errors.category = "Must not be empty");
	isEmpty(data.desc) && (errors.desc = "Must not be empty");
	isEmpty(data.mimetype)
		? (errors.mimetype = "Must not be empty")
		: isPhoto(data.mimetype) && (errors.mimetype = "Wrong file type sumbitted");
	return {
		valid: Object.keys(errors).length === 0 ? true : false,
		errors,
	};
};

export const validateAddPackage = (data) => {
	let errors = {};

	isEmpty(data.category) && (errors.category = "Must not be empty");
	isEmpty(data.desc) && (errors.desc = "Must not be empty");
	isEmpty(data.price) && (errors.price = "Must not be empty");
	isEmpty(data.mimetype)
		? (errors.mimetype = "Must not be empty")
		: isPhoto(data.mimetype) && (errors.mimetype = "Wrong file type sumbitted");
	return {
		valid: Object.keys(errors).length === 0 ? true : false,
		errors,
	};
};

export const validateUpdatePhoto = (data) => {
	let errors = {};

	isPhoto(data.mimetype) && (errors.mimetype = "Wrong file type sumbitted");
	return {
		valid: Object.keys(errors).length === 0 ? true : false,
		errors,
	};
};
