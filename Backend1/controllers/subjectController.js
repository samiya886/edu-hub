import Subject from "../models/Subject.js";
import { validateSemesterBelongsToCourse } from "../utils/academicValidation.js";

// Get all subjects
export const getSubjects = async (req, res) => {
  try {
    const { department, course, semester } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (course) filter.course = course;
    if (semester) filter.semester = semester;

    const subjects = await Subject.find(filter)
      .populate("department", "name")
      .populate("course", "name")
      .populate("semester", "name")
      .sort({ createdAt: -1 });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subject by ID
export const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("department", "name")
      .populate("course", "name")
      .populate("semester", "name");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create subject
export const createSubject = async (req, res) => {
  try {
    const { name, department, semester, course } = req.body;

    if (!name || !department || !semester || !course) {
      return res.status(400).json({ message: "Name, department, semester, and course are required" });
    }

    const semesterCheck = await validateSemesterBelongsToCourse({ department, course, semester });
    if (!semesterCheck.valid) {
      return res.status(400).json({ message: semesterCheck.message });
    }

    const existingSubject = await Subject.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      department,
      course,
      semester,
    });

    if (existingSubject) {
      return res.status(400).json({ message: "Subject already exists for this department, course, and semester" });
    }

    const subject = await Subject.create({ name, department, semester, course });
    await subject.populate("department", "name");
    await subject.populate("course", "name");
    await subject.populate("semester", "name");
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subject
export const updateSubject = async (req, res) => {
  try {
    const { name, department, semester, course } = req.body;

    const semesterCheck = await validateSemesterBelongsToCourse({ department, course, semester });
    if (!semesterCheck.valid) {
      return res.status(400).json({ message: semesterCheck.message });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, department, semester, course },
      { new: true, runValidators: true }
    )
      .populate("department", "name")
      .populate("course", "name")
      .populate("semester", "name");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete subject
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
