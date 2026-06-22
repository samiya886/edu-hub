import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique subject per department, course, semester
subjectSchema.index({ name: 1, department: 1, course: 1, semester: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;