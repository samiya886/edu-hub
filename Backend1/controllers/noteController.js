import Note from "../models/Note.js";
import Subject from "../models/Subject.js";
import { validateAcademicSelection } from "../utils/academicValidation.js";

const getUploadedFileUrl = (req) => {
  if (!req.file) return req.body.fileUrl;
  return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
};

const populateNote = (query) =>
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
  const userId = user._id?.toString?.();
  const resourceRole = resource.uploaderRole || user.role;

  if (resourceRole !== user.role) return false;

  return (
    resource.uploaderId?.toString?.() === userId ||
    resource.author?.toString?.() === userId
  );
};

const roleScopedFilter = (req) => {
  // For students and teachers, restrict to resources uploaded by same role excluding own uploads
  if (req.user && ["student", "teacher"].includes(req.user.role)) {
    const filter = { uploaderRole: req.user.role };
    if (req.user._id) {
      filter.uploaderId = { $ne: req.user._id };
    }
    return filter;
  }
  // Admins and unauthenticated users see all resources without restriction
  return {};
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const { subject, department, course, semester, category, isPremium, isApproved, search } = req.query;
    let filter = roleScopedFilter(req);
    const subjectFilter = await resolveSubjectFilter({ department, course, semester, subject });

    if (subjectFilter) filter.subject = subjectFilter;
    if (category) filter.category = category;
    if (isPremium !== undefined) filter.isPremium = isPremium === 'true';
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await populateNote(Note.find(filter)).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get note by ID
export const getNote = async (req, res) => {
  try {
    const note = await populateNote(Note.findOne({ _id: req.params.id, ...roleScopedFilter(req) }));

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Increment views
    note.views += 1;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create note
export const createNote = async (req, res) => {
  try {
    const { title, description, department, course, semester, subject, category, isPremium, isApproved, chapters } = req.body;
    const authorId = req.user?._id;
    const academic = await resolveAcademicFields({ department, course, semester, subject });

    if (!title || !subject || !academic.department || !academic.course || !academic.semester) {
      return res.status(400).json({ message: "Title, department, course, semester, and subject are required" });
    }

    const academicCheck = await validateAcademicSelection({
      ...academic,
      subjects: [subject],
    });

    if (!academicCheck.valid) {
      return res.status(400).json({ message: academicCheck.message });
    }

    const note = await Note.create({
      title,
      description,
      subject,
      ...academic,
      author: authorId,
      uploaderId: authorId,
      uploaderRole: req.user?.role,
      category,
      isPremium: isPremium || false,
      isApproved: isApproved === undefined ? true : isApproved === 'true' || isApproved === true,
      chapters: chapters || 1,
      fileUrl: getUploadedFileUrl(req),
    });

    const populatedNote = await populateNote(Note.findById(note._id));

    res.status(201).json(populatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const { title, description, department, course, semester, subject, category, isPremium, isApproved, chapters } = req.body;
    const academic = await resolveAcademicFields({ department, course, semester, subject });
    const update = { title, description, subject, ...academic, category, isPremium, isApproved, chapters };
    const existingNote = await Note.findById(req.params.id).select("author uploaderId uploaderRole");

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!canManageResource(req.user, existingNote)) {
      return res.status(403).json({ message: "Only admins or the original uploader can update this note" });
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

    const note = await populateNote(Note.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ));

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const existingNote = await Note.findById(req.params.id).select("author uploaderId uploaderRole");

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!canManageResource(req.user, existingNote)) {
      return res.status(403).json({ message: "Only admins or the original uploader can delete this note" });
    }

    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate note
export const rateNote = async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Simple rating update (in production, you'd track individual user ratings)
    note.rating = rating;
    await note.save();

    res.json({ message: "Rating updated successfully", rating: note.rating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
