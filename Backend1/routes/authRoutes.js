import express from "express";
import { authenticate, optionalAuth } from "../middleware/authMiddleware.js";

import {
    signup,
    login,
    logout,
    me
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup);

router.post("/login", login);

router.get("/me", authenticate, me);

router.post("/logout", optionalAuth, logout);

export default router;
