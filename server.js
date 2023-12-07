import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import "dotenv/config";

// DB config
import "./dbConfig.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";

// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(
	cors({
		origin: "https://sparkling-trifle-08bace.netlify.app/",
		credentials: true,
	})
);

// PORT
const PORT = process.env.PORT;

// Endpoints
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/package", packageRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
