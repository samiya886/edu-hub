import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
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
  res.json({ message: "EduHub backend is running" });
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
