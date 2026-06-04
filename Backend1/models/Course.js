import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ name: 1, department: 1 }, { unique: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
