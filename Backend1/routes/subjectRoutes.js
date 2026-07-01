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
router.post("/", authenticate, authorize("admin"), createSubject);
router.put("/:id", authenticate, authorize("admin"), updateSubject);
router.delete("/:id", authenticate, authorize("admin"), deleteSubject);

export default router;
