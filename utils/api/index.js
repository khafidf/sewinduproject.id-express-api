import axios from "axios";

const headers = {
	accept: "application/json",
	"content-type": "application/json",
	Authorization: `Basic ${Buffer.from(process.env.SERVER_KEY + ":").toString(
		"base64"
	)}`,
};

const api = axios.create({
	baseURL: `${process.env.MIDTRANS_URL}`,
	headers,
});

export default api;
