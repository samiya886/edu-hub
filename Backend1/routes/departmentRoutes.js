import express from "express";
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.post("/", authenticate, authorize("admin"), createDepartment);
router.put("/:id", authenticate, authorize("admin"), updateDepartment);
router.delete("/:id", authenticate, authorize("admin"), deleteDepartment);

export default router;
