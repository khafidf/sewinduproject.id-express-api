import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
app.use(
	cors({
		origin: "http://localhost:5173",
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
