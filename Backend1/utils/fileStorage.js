import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadsPath = path.resolve(__dirname, "../uploads");

export function getRequestOrigin(req) {
  const protocol = req.protocol || "http";
  const host = req.get("host");
  return host ? `${protocol}://${host}` : "";
}

export function getStoredUploadPath(fileName) {
  return `/uploads/${encodeURIComponent(path.basename(fileName))}`;
}

export function getUploadedFileUrl(req) {
  if (req.file?.filename) {
    const storedPath = getStoredUploadPath(req.file.filename);
    console.info("[files] upload stored", {
      originalName: req.file.originalname,
      storedFileName: req.file.filename,
      diskPath: path.join(uploadsPath, req.file.filename),
      storedPath,
    });
    return storedPath;
  }

  return req.body.fileUrl;
}

export function getUploadFileName(fileUrl = "") {
  if (!fileUrl) return "";

  try {
    const parsed = new URL(fileUrl, "http://placeholder.local");
    const uploadIndex = parsed.pathname.lastIndexOf("/uploads/");
    if (uploadIndex >= 0) {
      return decodeURIComponent(parsed.pathname.slice(uploadIndex + "/uploads/".length));
    }

    if (/^https?:\/\//i.test(fileUrl)) {
      return "";
    }
  } catch {
    // Fall through to relative path parsing.
  }

  if (fileUrl.includes("/uploads/")) {
    return decodeURIComponent(fileUrl.split("/uploads/").pop()?.split(/[?#]/)[0] || "");
  }

  return decodeURIComponent(path.basename(fileUrl.split(/[?#]/)[0] || ""));
}

export function resolveUploadFile(fileUrl = "") {
  const fileName = getUploadFileName(fileUrl);
  if (!fileName) {
    return { fileName: "", filePath: "", exists: false };
  }

  const safeName = path.basename(fileName);
  const filePath = path.join(uploadsPath, safeName);
  const exists = filePath.startsWith(uploadsPath) && fs.existsSync(filePath);

  return { fileName: safeName, filePath, exists };
}

export function getPublicFileUrl(req, fileUrl = "") {
  if (!fileUrl) return "";

  const origin = getRequestOrigin(req);
  const { fileName, exists } = resolveUploadFile(fileUrl);
  if (fileName && exists) {
    return `${origin}${getStoredUploadPath(fileName)}`;
  }

  if (fileName && !exists) {
    return "";
  }

  return fileUrl;
}

export function getFileDiagnostics(req, resource, type) {
  const storedFileUrl = resource?.fileUrl || "";
  const resolved = resolveUploadFile(storedFileUrl);

  return {
    id: resource?._id?.toString?.() || resource?.id?.toString?.() || "",
    type,
    title: resource?.title || "",
    storedFileUrl,
    resolvedFileName: resolved.fileName,
    resolvedDiskPath: resolved.filePath,
    fileExists: resolved.exists,
    publicFileUrl: getPublicFileUrl(req, storedFileUrl),
  };
}

export function logMissingFile(req, details) {
  console.warn("[files] missing upload", {
    ...details,
    requestPath: req.originalUrl,
    uploadsPath,
  });
}
