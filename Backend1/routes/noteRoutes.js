import express from "express";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  rateNote,
} from "../controllers/noteController.js";
import { authenticate, authorize, optionalAuth } from "../middleware/authMiddleware.js";
import { uploadFile } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, getNotes);
router.get("/:id", optionalAuth, getNote);
router.post("/", authenticate, authorize("admin", "teacher", "student"), uploadFile.single("file"), createNote);
router.put("/:id", authenticate, authorize("admin", "teacher", "student"), uploadFile.single("file"), updateNote);
router.delete("/:id", authenticate, authorize("admin", "teacher", "student"), deleteNote);
router.post("/:id/rate", authenticate, authorize(), rateNote);

export default router;
