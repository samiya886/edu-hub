import Notification from "../models/Notification.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a MongoDB filter that returns notifications visible to this user.
 * A notification is visible when:
 *   • recipientRoles includes 'all'
 *   • recipientRoles includes the user's role
 *   • recipientUsers includes the user's _id
 */
const visibilityFilter = (user) => ({
  $or: [
    { recipientRoles: "all" },
    { recipientRoles: user.role },
    { recipientUsers: user._id },
  ],
});

// ─── User-facing endpoints ───────────────────────────────────────────────────

// GET /api/notifications
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const filter = visibilityFilter(req.user);

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("createdBy", "name email role")
      .lean();

    // Attach isRead flag per notification for this user
    const enriched = notifications.map((n) => ({
      ...n,
      isRead: n.readBy.some((id) => id.toString() === userId.toString()),
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/notifications/:id/read
export const markRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, ...visibilityFilter(req.user) },
      { $addToSet: { readBy: userId } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany(
      visibilityFilter(req.user),
      { $addToSet: { readBy: userId } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      ...visibilityFilter(req.user),
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // If admin, delete the document entirely; others just mark as read + hide via client
    if (req.user.role === "admin") {
      await Notification.findByIdAndDelete(req.params.id);
    } else {
      // Non-admins: add to readBy (effectively hide) — we don't physically delete shared notifications
      await Notification.findByIdAndUpdate(req.params.id, {
        $addToSet: { readBy: req.user._id },
      });
    }

    res.json({ message: "Notification removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notifications/clear
export const clearAll = async (req, res) => {
  try {
    const userId = req.user._id;
    // Mark all visible notifications as read (effectively clearing them for this user)
    await Notification.updateMany(
      visibilityFilter(req.user),
      { $addToSet: { readBy: userId } }
    );
    res.json({ message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin-only endpoints ────────────────────────────────────────────────────

// POST /api/notifications  (admin only)
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, recipientRoles, recipientUsers, link } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || "admin",
      recipientRoles: Array.isArray(recipientRoles) ? recipientRoles : [],
      recipientUsers: Array.isArray(recipientUsers) ? recipientUsers : [],
      createdBy: req.user._id,
      link: link || "",
    });

    const populated = await Notification.findById(notification._id)
      .populate("createdBy", "name email role")
      .lean();

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notifications/all  (admin only) — all system notifications
export const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { message: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "name email role")
        .lean(),
      Notification.countDocuments(filter),
    ]);

    res.json({ notifications, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notifications/any/:id  (admin — hard delete any notification)
export const deleteAnyNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
