import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
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

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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

const PORT = process.env.PORT || 5000;
await connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// mongodb+srv://samiyash:samiya786@cluster0.wzyemcx.mongodb.net/?
