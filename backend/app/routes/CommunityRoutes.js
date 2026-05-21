import express from "express";
import jwt from "jsonwebtoken";
import Community from "../models/Community.js";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

dotenv.config();
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed'));
    }
  }
});

// ✅ Middleware: verify token (user authentication)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded; // attach user ID
    next();
  });
};

// Inside POST /add route
router.post("/add", verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, category, location, content } = req.body;
    
    // Get uploaded image file paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const newEntry = new Community({
      userId: req.user.id,  // 👈 logged-in user ID
      title,
      category,
      location,
      content,
      images: imagePaths,
    });

    await newEntry.save();
    res.status(201).json({ 
      message: "Contribution saved successfully!",
      images: imagePaths
    });
  } catch (error) {
    console.error("Error saving contribution:", error);
    res.status(500).json({ message: "Error saving contribution" });
  }
});


// ✅ Route: Get all community contributions
router.get("/all", async (req, res) => {
  try {
    const data = await Community.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contributions" });
  }
});

// ✅ Route: Get single contribution by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Community.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Contribution not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contribution" });
  }
});

export default router;
