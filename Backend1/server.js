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

// Ensure uploads directory exists at startup (important for ephemeral file systems)
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.set("trust proxy", 1);

// CORS Ã¢â‚¬â€ allow same origin and any configured CLIENT_URL / FRONTEND_URL
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      // If no explicit origins configured, allow all (same-origin deployment)
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o))) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsers Ã¢â‚¬â€ 10 MB limit prevents "Bad Request" on large JSON payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files with security headers
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

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "UP" : "DOWN",
    api: "healthy",
    database: dbConnected ? "connected" : "disconnected",
    databaseError: dbConnected ? undefined : app.locals.databaseError || "Database is not connected",
    timestamp: new Date().toISOString(),
  });
});

const requireDatabase = (_req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();

  return res.status(503).json({
    message: "Database is not connected. Check Railway MongoDB environment variables.",
    database: "disconnected",
    details: app.locals.databaseError || "Set MONGO_URI, MONGODB_URI, MONGO_URL, or DATABASE_URL.",
  });
};

app.use("/api", requireDatabase);

// API routes
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

// Serve React frontend static files
app.use(express.static(clientDistPath));

// SPA fallback Ã¢â‚¬â€ serve index.html for all non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  const indexPath = path.join(clientDistPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).json({
      message: "Frontend not built. Run: npm run build --prefix client",
    });
  }
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error("[server error]", err.message || err);

  if (err.type === "entity.too.large" || err.status === 413) {
    return res.status(413).json({
      message: "Request payload too large. Maximum allowed size is 10 MB.",
    });
  }

  if (err.message?.startsWith("CORS")) {
    return res.status(403).json({ message: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
const databaseReady = await connectDB();
if (!databaseReady) {
  app.locals.databaseError = "MongoDB connection failed during startup. Check Railway variables and MongoDB Atlas network access.";
}

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
if (databaseReady) {
  await seedAdmin();
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
