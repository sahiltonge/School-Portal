import express from "express";
import db from "../db.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "school_images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// Add school
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, address, city, state, contact, email_id } = req.body;
    const image = req.file.path; // Cloudinary URL

    if (!image) return res.status(400).json({ error: "Image is required" });

    const sql =
      "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [
      name,
      address,
      city,
      state,
      contact,
      image,
      email_id,
    ]);

    res.json({ message: "School added successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add school" });
  }
});

// Get all schools
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM schools");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch schools" });
  }
});

// Search schools by name
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name)
      return res.status(400).json({ error: "Name query is required" });

    const sql =
      "SELECT id, name, address, city, image FROM schools WHERE name LIKE ?";
    const [results] = await db.query(sql, [`%${name}%`]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search schools" });
  }
});

export default router;
