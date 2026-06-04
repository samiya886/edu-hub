import express from "express";
import { getSemesters, createSemester } from "../controllers/semesterController.js";

const router = express.Router();

router.get("/", getSemesters);
router.post("/", createSemester);

export default router;
