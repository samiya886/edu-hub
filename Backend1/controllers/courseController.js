import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = {};

    if (department) {
      filter.department = department;
    }

    const courses = await Course.find(filter)
      .populate("department", "name")
      .sort({ name: 1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({ message: "Course name and department are required" });
    }

    const existingCourse = await Course.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      department,
    });

    if (existingCourse) {
      return res.status(400).json({ message: "Course already exists for this department" });
    }

    const course = await Course.create({ name, department });
    await course.populate("department", "name");
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
