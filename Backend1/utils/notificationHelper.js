import Notification from "../models/Notification.js";

/**
 * Fire-and-forget helper. Call from other controllers without awaiting.
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.message
 * @param {string} opts.type  - login | upload | edit | delete | admin | info | approval
 * @param {string[]} opts.recipientRoles  - ['all'] | ['admin','teacher'] | []
 * @param {string[]} opts.recipientUsers  - array of user id strings
 * @param {string}  opts.createdBy  - user id string of actor
 * @param {string}  opts.link
 */
export function sendNotification(opts) {
  const {
    title,
    message,
    type = "info",
    recipientRoles = [],
    recipientUsers = [],
    createdBy,
    link = "",
  } = opts;

  Notification.create({
    title,
    message,
    type,
    recipientRoles,
    recipientUsers,
    createdBy: createdBy || null,
    link,
  }).catch((err) => {
    console.error("[notifications] Failed to create notification:", err.message);
  });
}
