import express from "express";
import {
  getPapers,
  getPaper,
  createPaper,
  updatePaper,
  deletePaper,
  ratePaper,
} from "../controllers/paperController.js";
import { authenticate, authorize, optionalAuth } from "../middleware/authMiddleware.js";
import { uploadPdf } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, getPapers);
router.get("/:id", optionalAuth, getPaper);
router.post("/", authenticate, authorize("admin", "teacher", "student"), uploadPdf.single("file"), createPaper);
router.put("/:id", authenticate, authorize("admin", "teacher", "student"), uploadPdf.single("file"), updatePaper);
router.delete("/:id", authenticate, authorize("admin", "teacher", "student"), deletePaper);
router.post("/:id/rate", authenticate, authorize(), ratePaper);

export default router;
