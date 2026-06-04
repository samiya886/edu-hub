import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const pdfOnly = (_req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    cb(new Error("Only PDF files are allowed"));
    return;
  }

  cb(null, true);
};

export const uploadPdf = multer({
  storage,
  fileFilter: pdfOnly,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});
