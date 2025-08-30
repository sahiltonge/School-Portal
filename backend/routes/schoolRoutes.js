import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "schoolImages");

// Ensure folder exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Add school
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, address, city, state, contact, email_id } = req.body;
    const image = req.file?.filename;

    if (!image) return res.status(400).json({ error: "Image is required" });

    const sql = "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [name, address, city, state, contact, image, email_id]);

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
    if (!name) return res.status(400).json({ error: "Name query is required" });

    const sql = "SELECT id, name, address, city, image FROM schools WHERE name LIKE ?";
    const [results] = await db.query(sql, [`%${name}%`]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search schools" });
  }
});

export default router;
