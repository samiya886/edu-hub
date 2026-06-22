import express from "express";
import { getMyResources, getUsers, updateMe } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me/resources", authenticate, getMyResources);
router.put("/me", authenticate, updateMe);
router.get("/", authenticate, authorize("admin"), getUsers);

export default router;
