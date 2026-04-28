const fs = require("fs");
const path = require("path");

const multer = require("multer");

const uploadRoot = path.join(__dirname, "..", "..", "uploads");

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

ensureDirectoryExists(path.join(uploadRoot, "licenses"));
ensureDirectoryExists(path.join(uploadRoot, "reports"));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "doctorLicense") {
      return cb(null, path.join(uploadRoot, "licenses"));
    }

    return cb(null, path.join(uploadRoot, "reports"));
  },
  filename(req, file, cb) {
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${Date.now()}-${safeOriginalName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_SIZE_BYTES || 5 * 1024 * 1024),
    files: 5,
  },
});

module.exports = { upload, uploadRoot };
