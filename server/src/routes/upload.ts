import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
// Default-import then pick .v2: named imports from CommonJS packages can
// crash Node's ESM loader on some versions ("Named export not found").
// A default import is always safe.
import cloudinaryPkg from "cloudinary";
const cloudinary = (cloudinaryPkg as any).v2 ?? (cloudinaryPkg as any);
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// Files are held in MEMORY (never written to disk) and streamed straight
// to Cloudinary. This is required on Vercel serverless, where there is no
// persistent filesystem — and it also means images survive forever and are
// served from Cloudinary's fast global CDN.
//
// Configuration comes from the CLOUDINARY_URL environment variable
// (format: cloudinary://<api_key>:<api_secret>@<cloud_name>), which the
// Cloudinary SDK picks up automatically.

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP, or GIF images are allowed"));
  },
});

function uploadToCloudinary(buffer: Buffer): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ssl-sarees/products",
        public_id: `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`,
        resource_type: "image",
      },
      (error: any, result: any) => {
        if (error || !result) reject(error || new Error("Upload failed"));
        else resolve(result as { secure_url: string });
      }
    );
    stream.end(buffer);
  });
}

/**
 * POST /api/upload — admin only. Accepts a single image under the field
 * name "image", uploads it to Cloudinary, and returns the permanent
 * https URL to store in the product's images array.
 */
router.post("/", authenticate, requireAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file was uploaded" });
  }
  if (!process.env.CLOUDINARY_URL) {
    return res.status(500).json({
      message: "Image storage is not configured (CLOUDINARY_URL missing). Add it in Vercel environment variables.",
    });
  }
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    res.status(201).json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: "Image upload failed: " + (err as Error).message });
  }
});

export default router;
