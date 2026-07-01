import express from "express";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../controllers/courseController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCourses);
router.post("/", authenticate, authorize("admin"), createCourse);
router.put("/:id", authenticate, authorize("admin"), updateCourse);
router.delete("/:id", authenticate, authorize("admin"), deleteCourse);

export default router;
