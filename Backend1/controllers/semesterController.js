import Semester from "../models/Semester.js";
import { validateCourseBelongsToDepartment } from "../utils/academicValidation.js";

export const getSemesters = async (req, res) => {
  try {
    const { department, course } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (course) filter.course = course;

    const semesters = await Semester.find(filter)
      .populate("department", "name")
      .populate("course", "name")
      .sort({ order: 1, name: 1 });

    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSemester = async (req, res) => {
  try {
    const { name, department, course, order } = req.body;

    if (!name || !department || !course) {
      return res.status(400).json({ message: "Semester name, course, and department are required" });
    }

    const courseCheck = await validateCourseBelongsToDepartment({ department, course });
    if (!courseCheck.valid) {
      return res.status(400).json({ message: courseCheck.message });
    }

    const existingSemester = await Semester.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      course,
    });

    if (existingSemester) {
      return res.status(400).json({ message: "Semester already exists for this course" });
    }

    const semester = await Semester.create({ name, department, course, order });
    await semester.populate("department", "name");
    await semester.populate("course", "name");
    res.status(201).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
