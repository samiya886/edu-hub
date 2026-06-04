import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
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
    order: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

semesterSchema.index({ name: 1, course: 1 }, { unique: true });

const Semester = mongoose.model("Semester", semesterSchema);

export default Semester;
