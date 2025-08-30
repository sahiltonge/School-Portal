import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import schoolRoutes from "./routes/schoolRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve school images
app.use("/schoolImages", express.static(path.join(process.cwd(), "schoolImages")));

// Routes
app.use("/api/schools", schoolRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
