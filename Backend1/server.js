import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import semesterRoutes from "./routes/semesterRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";

dotenv.config();

const app = express();
const __dirname = import.meta.dirname || path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, "../client/dist");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "UP" : "DOWN",
    api: "healthy",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(clientDistPath));

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
await connectDB();

// Auto-seed admin on first startup
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const exists = await User.findOne({ role: "admin" });
    if (!exists) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await User.findOneAndUpdate(
        { email: adminEmail },
        { name: "EduAdmin", email: adminEmail, password: hashed, role: "admin" },
        { upsert: true, returnDocument: "after" }
      );
      console.log(`Admin seeded: ${adminEmail} / ${adminPassword}`);
    } else {
      // Ensure admin@gmail.com always has admin role (fixes accidental student registration)
      await User.updateOne(
        { email: adminEmail, role: { $ne: "admin" } },
        { $set: { role: "admin" } }
      );
    }
  } catch (err) {
    console.error("Admin seed error:", err.message);
  }
};
await seedAdmin();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
