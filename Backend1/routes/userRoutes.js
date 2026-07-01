import express from "express";
import { createUser, deleteUser, getMyResources, getUsers, updateMe, updateUserRole } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me/resources", authenticate, getMyResources);
router.put("/me", authenticate, updateMe);
router.get("/", authenticate, authorize("admin"), getUsers);
router.post("/", authenticate, authorize("admin"), createUser);
router.put("/:id/role", authenticate, authorize("admin"), updateUserRole);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

export default router;

