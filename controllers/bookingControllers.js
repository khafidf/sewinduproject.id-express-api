import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";
import packageModel from "../models/packageModel.js";
import { makeTransaction } from "../utils/api/services.js";

// Full transaction
export const createTransaction = async (req, res) => {
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
			const { day, time } = order.date;
			const { va_numbers, order_id } = transactionData;

			const bookingData = {
				userId: order.userId,
				packageId: order.packageId,
				date: {
					day: day.map((date) => new Date(date)),
					time,
				},
				orderId: order_id,
				virtualAccount: va_numbers[0].va_number,
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
//Get Status (All)

//Create Transaction (Change date) Optional
