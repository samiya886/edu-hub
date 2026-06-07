import Course from "../models/Course.js";
import Department from "../models/Department.js";
import Note from "../models/Note.js";
import Paper from "../models/Paper.js";
import Subject from "../models/Subject.js";
import User from "../models/User.js";

const compactResource = (resource, type) => ({
  id: resource._id,
  type,
  uploaderRole: resource.uploaderRole || "student",
  title: resource.title,
  description: resource.description,
  subject: resource.subject?.name || "General",
  category: resource.category || resource.examType || type,
  year: resource.year,
  rating: resource.rating || 0,
  views: resource.views || 0,
  fileUrl: resource.fileUrl,
  createdAt: resource.createdAt,
});

const resolveSubjectFilter = async ({ department, course, semester, subject }) => {
  if (subject) return subject;

  const academicFilter = {};
  if (department) academicFilter.department = department;
  if (course) academicFilter.course = course;
  if (semester) academicFilter.semester = semester;

  if (!Object.keys(academicFilter).length) return null;

  const subjects = await Subject.find(academicFilter).select("_id");
  return { $in: subjects.map((item) => item._id) };
};

const roleScopedFilter = (req) => {
  // Admins should see all resources regardless of uploader role
  if (req.user?.role === 'admin') {
    return {};
  }
  // Students and teachers see only resources uploaded by users with the same role, excluding their own uploads
  if (req.user && ["student", "teacher"].includes(req.user.role)) {
    const filter = { uploaderRole: req.user.role };
    if (req.user._id) {
      filter.uploaderId = { $ne: req.user._id };
    }
    return filter;
  }
  // Public (unauthenticated) visitors can see all resources
  return {};
};

export const getHomeSummary = async (req, res) => {
  try {
    const { department, course, semester, subject, search } = req.query;
    const subjectFilter = await resolveSubjectFilter({ department, course, semester, subject });
    const resourceFilter = roleScopedFilter(req);

    if (subjectFilter) resourceFilter.subject = subjectFilter;
    if (search) {
      resourceFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [
      departments,
      courses,
      subjects,
      notes,
      papers,
      students,
      latestNotes,
      latestPapers,
      popularNotes,
    ] = await Promise.all([
      Department.countDocuments(),
      Course.countDocuments(),
      Subject.countDocuments(),
      Note.countDocuments(resourceFilter),
      Paper.countDocuments(resourceFilter),
      User.countDocuments({ role: "student" }),
      Note.find(resourceFilter)
        .populate("subject", "name")
        .sort({ createdAt: -1 })
        .limit(3),
      Paper.find(resourceFilter)
        .populate("subject", "name")
        .sort({ createdAt: -1 })
        .limit(3),
      Note.find(resourceFilter)
        .populate("subject", "name")
        .sort({ views: -1, rating: -1, createdAt: -1 })
        .limit(3),
    ]);

    res.json({
      stats: {
        departments,
        courses,
        subjects,
        notes,
        papers,
        students,
        resources: notes + papers,
      },
      latestResources: [
        ...latestNotes.map((note) => compactResource(note, "note")),
        ...latestPapers.map((paper) => compactResource(paper, "paper")),
      ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
      popularNotes: popularNotes.map((note) => compactResource(note, "note")),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
