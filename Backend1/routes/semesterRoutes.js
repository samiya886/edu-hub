import express from "express";
import { getSemesters, createSemester, updateSemester, deleteSemester } from "../controllers/semesterController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSemesters);
router.post("/", authenticate, authorize("admin"), createSemester);
router.put("/:id", authenticate, authorize("admin"), updateSemester);
router.delete("/:id", authenticate, authorize("admin"), deleteSemester);

export default router;
