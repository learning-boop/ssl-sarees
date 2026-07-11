import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// Where uploaded files get saved on disk, and how they're named.
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // process.cwd() instead of __dirname: works in both CJS (local dev)
    // and the ESM serverless bundle on Vercel.
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP, or GIF images are allowed"));
  },
});

/**
 * POST /api/upload — admin only. Accepts a single image file under the
 * field name "image", saves it to /uploads, and returns the URL the
 * frontend should use (which gets stored in a product's images array).
 */
router.post("/", authenticate, requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file was uploaded" });
  }
  // Full absolute URL (not just "/uploads/xxx.jpg") so it works as a
  // normal <img src="..."> anywhere in the app, exactly like the
  // external image URLs your existing products already use.
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

export default router;
