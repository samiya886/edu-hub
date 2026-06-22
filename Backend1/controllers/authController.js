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

const getClientOrigin = (req) => {
  const configuredOrigin = process.env.CLIENT_URL || process.env.FRONTEND_URL;
  if (configuredOrigin) return configuredOrigin.replace(/\/$/, "");

  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || req.protocol;

  return `${protocol}://${req.get("host")}`;
};

const getGoogleRedirectUri = (req) => {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;

  return `${getClientOrigin(req)}/api/auth/google/callback`;
};

const signToken = (user) =>
  jwt.sign(
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

const encodeAuthPayload = (payload) =>
  Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");

const decodeGoogleState = (state) => {
  if (!state) return {};

  try {
    return JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
  } catch {
    return {};
  }
};

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

    const token = signToken(savedUser);

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

    const token = signToken(user);

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

export const startGoogleAuth = async (req, res) => {
  try {
    const { GOOGLE_CLIENT_ID } = process.env;

    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google login is not configured." });
    }

    const selectedRole = ["student", "teacher"].includes(req.query.role)
      ? req.query.role
      : "student";
    const state = encodeAuthPayload({ role: selectedRole });
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", getGoogleRedirectUri(req));
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("prompt", "select_account");
    authUrl.searchParams.set("state", state);

    res.redirect(authUrl.toString());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleCallback = async (req, res) => {
  const clientOrigin = getClientOrigin(req);

  try {
    const { code, state } = req.query;
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error("Google login is not configured.");
    }

    if (!code) {
      throw new Error("Google did not return an authorization code.");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: getGoogleRedirectUri(req),
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || tokenData.error || "Google token exchange failed.");
    }

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.email) {
      throw new Error(profile.error_description || "Unable to read Google account profile.");
    }

    const decodedState = decodeGoogleState(state);
    const selectedRole = ["student", "teacher"].includes(decodedState.role)
      ? decodedState.role
      : "student";
    const email = profile.email.toLowerCase();
    let user = await User.findOne({ email });

    if (user && user.role !== selectedRole) {
      const message = `This account is registered as a ${user.role}. Please select ${user.role} to login.`;
      return res.redirect(`${clientOrigin}/auth?oauth=error&message=${encodeURIComponent(message)}`);
    }

    if (!user) {
      const generatedPassword = await bcrypt.hash(`google:${profile.sub}:${Date.now()}`, 10);
      user = await User.create({
        name: profile.name || email.split("@")[0],
        email,
        password: generatedPassword,
        role: selectedRole,
      });
    }

    const populatedUser = await populateUser(User.findById(user._id).select("-password"));
    const payload = encodeAuthPayload({
      token: signToken(populatedUser),
      user: serializeUser(populatedUser),
    });

    res.redirect(`${clientOrigin}/auth?oauth=success&payload=${payload}`);
  } catch (error) {
    res.redirect(`${clientOrigin}/auth?oauth=error&message=${encodeURIComponent(error.message)}`);
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
