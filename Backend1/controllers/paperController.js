import Paper from "../models/Paper.js";
import Subject from "../models/Subject.js";
import { validateAcademicSelection } from "../utils/academicValidation.js";
import { getUploadedFileUrl } from "../utils/fileStorage.js";

const populatePaper = (query) =>
  query
    .populate({
      path: "subject",
      select: "name department semester course",
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

const resolveAcademicFields = async ({ department, course, semester, subject }) => {
  const academic = { department, course, semester };

  if ((!academic.department || !academic.course || !academic.semester) && subject) {
    const subjectDoc = await Subject.findById(subject).select("department course semester");
    if (subjectDoc) {
      academic.department = academic.department || subjectDoc.department;
      academic.course = academic.course || subjectDoc.course;
      academic.semester = academic.semester || subjectDoc.semester;
    }
  }

  return academic;
};

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

const canManageResource = (user, resource) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  const userId = user._id?.toString?.();
  const resourceRole = resource.uploaderRole || user.role;

  if (resourceRole !== user.role) return false;

  return (
    resource.uploaderId?.toString?.() === userId ||
    resource.author?.toString?.() === userId
  );
};

const roleScopedFilter = (req) => {
  if (req.user && ["student", "teacher"].includes(req.user.role)) {
    const filter = { uploaderRole: req.user.role };
    if (req.user._id) {
      filter.uploaderId = { $ne: req.user._id };
    }
    return filter;
  }
  return {};
};

// Get all papers
export const getPapers = async (req, res) => {
  try {
    const { subject, department, course, semester, year, examType, isPremium, search } = req.query;
    let filter = roleScopedFilter(req);
    const subjectFilter = await resolveSubjectFilter({ department, course, semester, subject });

    if (subjectFilter) filter.subject = subjectFilter;
    if (year) filter.year = parseInt(year);
    if (examType) filter.examType = examType;
    if (isPremium !== undefined) filter.isPremium = isPremium === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const papers = await populatePaper(Paper.find(filter)).sort({ year: -1, createdAt: -1 });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get paper by ID
export const getPaper = async (req, res) => {
  try {
    const paper = await populatePaper(Paper.findOne({ _id: req.params.id, ...roleScopedFilter(req) }));

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // Increment views
    paper.views += 1;
    await paper.save();

    res.json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create paper
export const createPaper = async (req, res) => {
  try {
    const { title, description, department, course, semester, subject, year, examType, isPremium } = req.body;
    const authorId = req.user?._id;
    const academic = await resolveAcademicFields({ department, course, semester, subject });

    if (!title || !subject || !year || !academic.department || !academic.course || !academic.semester) {
      return res.status(400).json({ message: "Title, department, course, semester, subject, and year are required" });
    }

    const academicCheck = await validateAcademicSelection({
      ...academic,
      subjects: [subject],
    });

    if (!academicCheck.valid) {
      return res.status(400).json({ message: academicCheck.message });
    }

    const paper = await Paper.create({
      title,
      description,
      subject,
      ...academic,
      author: authorId,
      uploaderId: authorId,
      uploaderRole: req.user?.role,
      year,
      examType,
      isPremium: isPremium || false,
      fileUrl: getUploadedFileUrl(req),
    });

    const populatedPaper = await populatePaper(Paper.findById(paper._id));

    res.status(201).json(populatedPaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update paper
export const updatePaper = async (req, res) => {
  try {
    const { title, description, department, course, semester, subject, year, examType, isPremium } = req.body;
    const academic = await resolveAcademicFields({ department, course, semester, subject });
    const update = { title, description, subject, ...academic, year, examType, isPremium };
    const existingPaper = await Paper.findById(req.params.id).select("author uploaderId uploaderRole");

    if (!existingPaper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    if (!canManageResource(req.user, existingPaper)) {
      return res.status(403).json({ message: "Only admins or the original uploader can update this paper" });
    }

    if (subject && academic.department && academic.course && academic.semester) {
      const academicCheck = await validateAcademicSelection({
        ...academic,
        subjects: [subject],
      });

      if (!academicCheck.valid) {
        return res.status(400).json({ message: academicCheck.message });
      }
    }

    if (req.file) {
      update.fileUrl = getUploadedFileUrl(req);
    }

    const paper = await populatePaper(Paper.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ));

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    res.json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete paper
export const deletePaper = async (req, res) => {
  try {
    const existingPaper = await Paper.findById(req.params.id).select("author uploaderId uploaderRole");

    if (!existingPaper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    if (!canManageResource(req.user, existingPaper)) {
      return res.status(403).json({ message: "Only admins or the original uploader can delete this paper" });
    }

    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    res.json({ message: "Paper deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate paper
export const ratePaper = async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // Simple rating update (in production, you'd track individual user ratings)
    paper.rating = rating;
    await paper.save();

    res.json({ message: "Rating updated successfully", rating: paper.rating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

