import express from "express";
import cors from "cors";
import "dotenv/config";

// DB config
import "./dbConfig.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());

// PORT
const PORT = process.env.PORT;

// Endpoints
app.use("/api/user", userRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/package", packageRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
