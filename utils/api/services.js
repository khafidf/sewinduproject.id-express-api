import api from "./index.js";

const generateRandomOrderId = () => {
	const now = new Date();
	const dateString = now.toISOString().replace(/[-T:]/g, "").slice(0, -5);
	const randomString = Math.random().toString(36).substring(2, 10);
	const orderId = `${randomString}-${dateString}`;

	return orderId;
};

export const makeTransaction = async (
	customerDetails,
	itemDetails,
	payment
) => {
	let totalPrice = 0;

	itemDetails.forEach(({ price, quantity }) => {
		totalPrice += price;
		totalPrice *= quantity;
	});

	const [firstCustomerDetail] = customerDetails;

	const { first_name, email, phone } = firstCustomerDetail;

	const { type, provider } = payment;

	const payload = {
		payment_type: type,
		transaction_details: {
			order_id: generateRandomOrderId(),
			gross_amount: totalPrice,
		},
		customer_details: {
			first_name,
			email,
			phone,
		},
		item_details: itemDetails,
		custom_expiry: {
			expiry_duration: 60,
			unit: "minute",
		},
	};

	if (type === "bank_transfer") {
		payload.bank_transfer = {
			bank: provider,
		};
	} else if (type === "qris") {
		payload.qris = "";
	} else if (type === "gopay") {
		payload.gopay = "";
	} else if ((type = "shopeepay")) {
		payload.shopeepay = "";
	}

	try {
		const response = await api.post("/v2/charge", payload);
		return response.data;
	} catch (err) {
		throw new Error(err);
	}
};

export const getStatusOrder = async (orderId) => {
	try {
		const response = await api.get(`/v2/${orderId}/status`);
		return response.data;
	} catch (error) {
		throw new Error(err);
	}
};
