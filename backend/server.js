// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import communityRoutes from "./app/routes/CommunityRoutes.js";

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // MongoDB Connection
// mongoose.connect("mongodb://localhost:27017/culturalHub", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB connected"))
// .catch((err) => console.log("❌ MongoDB Error:", err));

// // Routes
// app.use("/api/community", communityRoutes);

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./app/routes/auth.js"; // ✅ Import auth routes
import communityRoutes from "./app/routes/CommunityRoutes.js";


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes); // ✅ Auth routes
app.use("/api/community", communityRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
