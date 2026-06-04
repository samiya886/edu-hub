import express from "express";
import { getHomeSummary } from "../controllers/homeController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, getHomeSummary);

export default router;
