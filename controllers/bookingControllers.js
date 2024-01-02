import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";
import packageModel from "../models/packageModel.js";
import historyModel from "../models/historyModel.js";
import deliveryModel from "../models/deliveryModel.js";
import { getStatusOrder, makeTransaction } from "../utils/api/services.js";

export const createTransactionController = async (req, res) => {
	const { orders, payment } = req.body;

	try {
		const customerDetails = [];
		const itemDetails = [];
		const historyData = {
			userId: "",
			packageName: [],
			categoryName: [],
			statusOrder: "",
			price: "",
			note: "",
			orderId: "",
			created: "",
			expire: "",
			bank: "",
		};

		// Midtrans
		for (const order of orders) {
			const userOrder = await userModel.findById(order.userId);
			const packageOrder = await packageModel.findById(order.packageId);

			const customer = {
				first_name: userOrder.name,
				email: userOrder.email,
				phone: userOrder.phoneNumber,
			};

			const items = {
				id: String(packageOrder._id),
				price: Number(packageOrder.price),
				name: packageOrder.name,
				quantity: Number(1),
			};

			if (customerDetails.length === 0) {
				customerDetails.push(customer);
			}

			const existingItem = itemDetails.find(
				(item) => String(item.id) === String(items.id)
			);
			if (existingItem) {
				existingItem.quantity += Number(1);
			} else {
				itemDetails.push(items);
			}

			if (customerDetails.length === 0) {
				customerDetails.push(customer);
			}
		}

		const transactionData = await makeTransaction(
			customerDetails,
			itemDetails,
			payment
		);

		// Booking data
		for (const order of orders) {
			const packageOrder = await packageModel.findById(order.packageId);
			const { day, time } = order.date;
			const {
				va_numbers,
				order_id,
				transaction_status,
				gross_amount,
				transaction_time,
				expiry_time,
			} = transactionData;

			const virtualAccounts = va_numbers.map(({ va_number }) => va_number);
			const bankAccounts = va_numbers.map(({ bank }) => bank);
			const [va_number] = virtualAccounts;
			const [bank] = bankAccounts;

			const bookingData = {
				userId: order.userId,
				packageId: order.packageId,
				packageName: packageOrder.name,
				categoryName: packageOrder.category,
				date: {
					day,
					time,
				},
				note: order.note,
				orderId: order_id,
				virtualAccount: va_number,
			};

			historyData.userId = order.userId;
			historyData.packageName.push(packageOrder.name);
			historyData.categoryName.push(packageOrder.category);
			historyData.statusOrder = transaction_status;
			historyData.price = gross_amount;
			historyData.orderId = order_id;
			historyData.created = transaction_time;
			historyData.expire = expiry_time;
			historyData.bank = bank;

			await new bookingModel(bookingData).save();
		}

		await new historyModel(historyData).save();

		res.status(200).json({
			data: transactionData,
			message: "Transaction Create",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getOrderController = async (req, res) => {
	const { orderId } = req.params;

	try {
		const orderData = await getStatusOrder(orderId);

		res.status(200).json({
			data: orderData,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getHistoryController = async (req, res) => {
	const { _id: userId } = req.user;

	try {
		const currentHistoryData = await historyModel.find({ userId });

		const allOrderId = [];

		for (const history of currentHistoryData) {
			const { orderId } = history;
			allOrderId.push(orderId);
		}

		for (const order of allOrderId) {
			const orderData = await getStatusOrder(order);

			const latestHistory = currentHistoryData.find(
				(history) => history.orderId === order
			);

			if (latestHistory) {
				latestHistory.statusOrder === orderData.transaction_status;
				await latestHistory.save();
			}
		}

		const historyData = await historyModel.find({ userId });

		res.status(200).json({
			data: historyData,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getBookingPerDayController = async (req, res) => {
	const { day } = req.params;
	try {
		const currentBookingData = await bookingModel.find({ "date.day": day });

		const allOrderId = [];

		for (const booking of currentBookingData) {
			const { orderId } = booking;
			allOrderId.push(orderId);
		}

		for (const order of allOrderId) {
			const orderData = await getStatusOrder(order);
			if (
				orderData.transaction_status === "cancel" ||
				orderData.transaction_status === "expire"
			) {
				await bookingModel.deleteMany({ orderId: orderData.order_id });
			}
		}

		const bookingData = await bookingModel.find({ "date.day": day });

		res.status(200).json({
			data: bookingData,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getAllBookingController = async (req, res) => {
	try {
		const currentBookingData = await bookingModel.find();

		const allOrderId = [];

		for (const booking of currentBookingData) {
			const { orderId } = booking;
			allOrderId.push(orderId);
		}

		for (const order of allOrderId) {
			const orderData = await getStatusOrder(order);
			if (
				orderData.transaction_status === "cancel" ||
				orderData.transaction_status === "expire"
			) {
				await bookingModel.deleteMany({ orderId: orderData.order_id });
			}
		}

		const bookingData = await bookingModel.find();

		res.status(200).json({
			data: bookingData,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getAllOrderController = async (req, res) => {
	try {
		const currentBookingData = await bookingModel.find();

		const allOrderId = [];
		const userData = [];
		const orderDatas = [];

		for (const booking of currentBookingData) {
			const { orderId } = booking;
			allOrderId.push(orderId);
		}

		for (const order of allOrderId) {
			const orderData = await getStatusOrder(order);
			if (
				orderData.transaction_status === "cancel" ||
				orderData.transaction_status === "expire"
			) {
				await bookingModel.deleteMany({ orderId: orderData.order_id });
			} else {
				orderDatas.push(orderData);
			}
		}

		const bookingData = await bookingModel.find();

		for (const order of bookingData) {
			const { userId, orderId } = order;

			const dataUser = await userModel.findById(userId);
			userData.push(dataUser);
		}

		res.status(200).json({
			data: {
				order: orderDatas,
				booking: bookingData,
				user: userData,
			},
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

//Create Transaction (Change date) Optional

export const addDeliveryFile = async (req, res) => {
	const { userId, linkFile } = req.body;

	const datas = {
		userId,
		linkFile,
	};

	try {
		await new deliveryModel(datas).save();

		res.status(200).json({
			message: "Link file delivered successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const editDeliveryFile = async (req, res) => {
	const { userId, linkFile } = req.body;
	try {
		const deliveryData = await deliveryModel.find(userId);

		deliveryData.linkFile = linkFile;

		deliveryData.save();

		res.status(200).json({
			message: "Link file delivered successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const deleteDeliveryFile = async (req, res) => {
	const { userId } = req.params;
	try {
		await deliveryModel.findOneAndDelete(userId);

		res.status(200).json({
			message: "Link file deleted successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

export const getDeliveryFile = async (req, res) => {
	const { userId } = req.params;
	try {
		const deliveryFile = await deliveryModel.find(userId);

		res.status(200).json({
			data: deliveryFile,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};
