import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";
import packageModel from "../models/packageModel.js";
import { getStatusOrder, makeTransaction } from "../utils/api/services.js";

// Full transaction
export const createTransactionController = async (req, res) => {
	const { orders, payment } = req.body;

	try {
		const customerDetails = [];
		const itemDetails = [];

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
			const { va_numbers, order_id } = transactionData;

			const virtualAccounts = va_numbers.map(({ va_number }) => va_number);
			const [va_number] = virtualAccounts;

			const bookingData = {
				userId: order.userId,
				packageId: order.packageId,
				packageName: packageOrder.name,
				categoryName: packageOrder.category,
				date: {
					day,
					time,
				},
				orderId: order_id,
				virtualAccount: va_number,
			};

			await new bookingModel(bookingData).save();
		}

		res.status(200).json({
			data: transactionData,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

//Get Status (User > params: userId)
export const getStatusByUserController = async (req, res) => {
	const { userId } = req.params;

	try {
		const bookingData = await bookingModel.find({ userId });

		const allOrderId = [];
		const orderDatas = [];

		for (const booking of bookingData) {
			const { orderId } = booking;
			if (!allOrderId.includes(orderId)) {
				allOrderId.push(orderId);
			}
		}

		for (const order of allOrderId) {
			const orderData = await getStatusOrder(order);
			orderDatas.push(orderData);
		}

		res.status(200).json({
			data: orderDatas,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};
//Get Status (All)
export const getBookingPerDayController = async (req, res) => {
	const { day } = req.params;
	try {
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

//Create Transaction (Change date) Optional
