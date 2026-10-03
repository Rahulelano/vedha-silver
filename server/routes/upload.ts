import express from "express";
import multer from "multer";
import path from "path";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "public/uploads/"));
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname || "")}`);
  },
});

function checkFileType(file: any, cb: any) {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }
  const filetypes = /jpg|jpeg|png|webp|avif|gif|svg|heic/i;
  const extname = filetypes.test(path.extname(file.originalname || "").toLowerCase());
  if (extname) {
    return cb(null, true);
  }
  cb(new Error("Images only! Unsupported format."));
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    res.send(`/uploads/${req.file.filename}`);
  } else {
    res.status(400).send("No file uploaded");
  }
});

router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({ message: err.message || "Server Error" });
});

export default router;
