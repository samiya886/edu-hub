import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  clearAll,
  createNotification,
  getAllNotifications,
  deleteAnyNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// ── User endpoints (any authenticated role) ─────────────────────────────────
router.get("/", authenticate, getMyNotifications);
router.patch("/read-all", authenticate, markAllRead);
router.delete("/clear", authenticate, clearAll);
router.patch("/:id/read", authenticate, markRead);
router.delete("/:id", authenticate, deleteNotification);

// ── Admin-only endpoints ─────────────────────────────────────────────────────
router.post("/", authenticate, authorize("admin"), createNotification);
router.get("/all", authenticate, authorize("admin"), getAllNotifications);
router.delete("/any/:id", authenticate, authorize("admin"), deleteAnyNotification);

export default router;
