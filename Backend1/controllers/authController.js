import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateAcademicSelection } from "../utils/academicValidation.js";

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

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, department, course, semester, subjects, rollNumber, phoneNumber, admissionYear } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (role && !['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({
        message: "Role must be 'student', 'teacher', or 'admin'",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const selectedSubjects = Array.isArray(subjects) ? subjects : [];

    if (department && course && semester && selectedSubjects.length) {
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

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      rollNumber: rollNumber || undefined,
      phoneNumber: phoneNumber || undefined,
      admissionYear: admissionYear || undefined,
      department: department || undefined,
      course: course || undefined,
      semester: semester || undefined,
      subjects: selectedSubjects,
    });

    const savedUser = await populateUser(User.findById(user._id).select("-password"));
    savedUser.profileCompleted = hasCompletedStudentProfile(savedUser);
    await savedUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: serializeUser(savedUser),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (role && !["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid selected role",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as a ${user.role}. Please select ${user.role} to login.`,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: serializeUser(await populateUser(User.findById(user._id).select("-password"))),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CURRENT USER
export const me = async (req, res) => {
  try {
    const user = await populateUser(User.findById(req.user._id).select("-password"));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can add the token to a blacklist if needed for security
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
