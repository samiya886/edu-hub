import User from "../models/User.js";
import Note from "../models/Note.js";
import Paper from "../models/Paper.js";
import { validateAcademicSelection } from "../utils/academicValidation.js";

const getId = (value) => value?._id?.toString?.() || value?.toString?.() || "";

const populateUser = (query) =>
  query
    .populate("department", "name")
    .populate("course", "name")
    .populate("semester", "name")
    .populate("subjects", "name department course semester");

const hasCompletedStudentProfile = (user) => {
  if (user.role !== "student") return true;
  return Boolean(
    user.rollNumber &&
      user.phoneNumber &&
      user.admissionYear &&
      user.department &&
      user.course &&
      user.semester &&
      Array.isArray(user.subjects) &&
      user.subjects.length
  );
};

const serializeUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  rollNumber: user.rollNumber || "",
  phoneNumber: user.phoneNumber || "",
  admissionYear: user.admissionYear || "",
  profileCompleted: hasCompletedStudentProfile(user),
  department: user.department || null,
  course: user.course || null,
  semester: user.semester || null,
  subjects: user.subjects || [],
  createdAt: user.createdAt,
});

const populateResource = (query) =>
  query
    .populate({
      path: "subject",
      select: "name department course semester",
      populate: [
        { path: "department", select: "name" },
        { path: "course", select: "name" },
        { path: "semester", select: "name" },
      ],
    })
    .populate("department", "name")
    .populate("course", "name")
    .populate("semester", "name")
    .populate("author", "name email role")
    .populate("uploaderId", "name email role");

export const getUsers = async (_req, res) => {
  try {
    const users = await populateUser(User.find().select("-password")).sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { department, course, semester, subjects, rollNumber, phoneNumber, admissionYear } = req.body;
    const selectedSubjects = Array.isArray(subjects) ? subjects : [];

    if (req.user.role === "student") {
      const missingFields = [];
      if (!rollNumber?.trim?.()) missingFields.push("roll number");
      if (!phoneNumber?.trim?.()) missingFields.push("phone number");
      if (!admissionYear) missingFields.push("admission year");
      if (!department) missingFields.push("department");
      if (!course) missingFields.push("course");
      if (!semester) missingFields.push("semester");
      if (!selectedSubjects.length) missingFields.push("subjects");

      if (missingFields.length) {
        return res.status(400).json({
          message: `Please complete: ${missingFields.join(", ")}`,
        });
      }

      const academicCheck = await validateAcademicSelection({
        department,
        course,
        semester,
        subjects: selectedSubjects,
      });

      if (!academicCheck.valid) {
        return res.status(400).json({ message: academicCheck.message });
      }
    }

    const update = {
      rollNumber: rollNumber || "",
      phoneNumber: phoneNumber || "",
      admissionYear: admissionYear || null,
      department: department || null,
      course: course || null,
      semester: semester || null,
      subjects: selectedSubjects,
      profileCompleted: req.user.role === "student",
    };

    const user = await populateUser(
      User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true }).select("-password")
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated", user: serializeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyResources = async (req, res) => {
  try {
    if (!["student", "teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only authenticated users can view their uploads" });
    }

    const type = req.query.type === "papers" ? "papers" : "notes";
    const Model = type === "papers" ? Paper : Note;
    const sort = type === "papers" ? { year: -1, createdAt: -1 } : { createdAt: -1 };
    const userId = getId(req.user._id);
    const items = await populateResource(
      Model.find({
        $and: [
          {
            $or: [
              { uploaderId: req.user._id },
              { author: req.user._id },
            ],
          },
          {
            $or: [
              { uploaderRole: req.user.role },
              { uploaderRole: { $exists: false } },
              { uploaderRole: null },
            ],
          },
        ],
      })
    ).sort(sort);

    res.json({
      profileRequired: false,
      scope: {
        uploaderId: userId,
        uploaderRole: req.user.role,
      },
      items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
