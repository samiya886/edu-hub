import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
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
import notificationRoutes from "./routes/notificationRoutes.js";
import { logMissingFile, uploadsPath } from "./utils/fileStorage.js";

dotenv.config();

const app = express();
const __dirname = import.meta.dirname || path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, "../client/dist");

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

app.get("/uploads/:fileName", (req, res, next) => {
  const fileName = path.basename(req.params.fileName);
  const filePath = path.join(uploadsPath, fileName);
  const exists = filePath.startsWith(uploadsPath) && fs.existsSync(filePath);

  if (!exists) {
    logMissingFile(req, {
      type: "direct-upload-request",
      storedFileUrl: req.originalUrl,
      resolvedFileName: fileName,
      resolvedDiskPath: filePath,
      fileExists: false,
    });
    return res.status(404).json({
      message: "File not found",
      reason: "missing_upload_file",
      fileName,
    });
  }

  const downloadName = path.basename(String(req.query.filename || fileName));
  const disposition = req.query.download === "1" ? "attachment" : "inline";
  res.setHeader("Content-Disposition", `${disposition}; filename="${downloadName}"`);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.sendFile(filePath, (error) => {
    if (error) next(error);
  });
});

app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=86400");
  },
}));

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
app.use("/api/notifications", notificationRoutes);

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
