import { Router } from "express";
import { z } from "zod";
import { Product } from "../models/Product";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

const productSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["Silk", "Banarasi", "Kanjivaram", "Cotton", "Designer", "Wedding"]),
  fabric: z.string().min(1),
  occasion: z.array(z.string()).default([]),
  color: z.string().min(1),
  price: z.number().nonnegative(),
  discountedPrice: z.number().nonnegative(),
  discount: z.number().int().nonnegative().default(0),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().nonnegative().default(0),
  images: z.array(z.string()).min(1),
  description: z.string().default(""),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  inStock: z.boolean().default(true),
  shippingCharge: z.number().nonnegative().default(199),
  stockQuantity: z.number().int().nonnegative().default(10),
  specifications: z.record(z.string(), z.string()).default({}),
});

/** GET /api/products?category=Silk — public product listing (what Collections/Home use). */
router.get("/", async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const docs = await Product.find(category ? { category } : {}).sort({ createdAt: -1 });
  res.json(docs.map((d) => d.toJSON()));
});

/** GET /api/products/:id — public single product (what ProductDetails uses). */
router.get("/:id", async (req, res) => {
  const doc = await Product.findById(req.params.id).catch(() => null);
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json(doc.toJSON());
});

/** POST /api/products — admin only. */
router.post("/", authenticate, requireAdmin, async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const doc = await Product.create(parsed.data);
  res.status(201).json(doc.toJSON());
});

/** PUT /api/products/:id — admin only. */
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const doc = await Product.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).catch(() => null);
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json(doc.toJSON());
});

/** DELETE /api/products/:id — admin only. */
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  const doc = await Product.findByIdAndDelete(req.params.id).catch(() => null);
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

export default router;
