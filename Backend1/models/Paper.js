import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    uploaderRole: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: false,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    examType: {
      type: String,
      enum: ["Mid-term", "Final", "Quiz", "Assignment"],
      default: "Final",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Paper = mongoose.model("Paper", paperSchema);

export default Paper;
