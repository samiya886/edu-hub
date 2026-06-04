import express from "express";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSubjects);
router.get("/:id", getSubject);
router.post("/", createSubject);
router.put("/:id", authenticate, authorize(), updateSubject);
router.delete("/:id", authenticate, authorize(), deleteSubject);

export default router;