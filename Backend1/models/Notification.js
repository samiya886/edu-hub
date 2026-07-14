import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["login", "upload", "edit", "delete", "admin", "info", "approval"],
      default: "info",
    },
    // Target audience: array of role strings or specific user ObjectIds
    recipientRoles: {
      type: [String],
      enum: ["admin", "teacher", "student", "all"],
      default: [],
    },
    recipientUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Tracks which specific users have read this notification
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Optional deep-link
    link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
notificationSchema.index({ recipientRoles: 1, createdAt: -1 });
notificationSchema.index({ recipientUsers: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
