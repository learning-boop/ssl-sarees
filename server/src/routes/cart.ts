import { Router } from "express";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every cart route requires a logged-in user — a cart only makes
// sense tied to an account.
router.use(authenticate);

function serializeCart(user: any) {
  return user.cart
    .filter((entry: any) => entry.product) // drop entries whose product was since deleted
    .map((entry: any) => ({ product: entry.product.toJSON(), quantity: entry.quantity }));
}

/** GET /api/cart */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ items: serializeCart(user) });
  })
);

const addSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
});

/** POST /api/cart — add a product, or increase quantity if already present. */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });
    const { productId, quantity } = parsed.data;

    // Static demo products use ids like "1" — those aren't real Mongo
    // ObjectIds, so findById would throw a CastError. Return a clean 404
    // instead so the frontend can tell the user what happened.
    if (!isValidObjectId(productId)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = user.cart.find((e) => e.product.toString() === productId);
    if (existing) existing.quantity += quantity;
    else user.cart.push({ product: product._id, quantity } as any);
    await user.save();

    await user.populate("cart.product");
    res.status(201).json({ items: serializeCart(user) });
  })
);

const qtySchema = z.object({ quantity: z.number().int().min(0) });

/** PUT /api/cart/:productId — set an exact quantity (0 removes it). */
router.put(
  "/:productId",
  asyncHandler(async (req, res) => {
    const parsed = qtySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (parsed.data.quantity === 0) {
      user.cart = user.cart.filter((e) => e.product.toString() !== req.params.productId) as any;
    } else {
      const existing = user.cart.find((e) => e.product.toString() === req.params.productId);
      if (existing) existing.quantity = parsed.data.quantity;
    }
    await user.save();
    await user.populate("cart.product");
    res.json({ items: serializeCart(user) });
  })
);

/** DELETE /api/cart/:productId — remove one product from the cart. */
router.delete(
  "/:productId",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = user.cart.filter((e) => e.product.toString() !== req.params.productId) as any;
    await user.save();
    await user.populate("cart.product");
    res.json({ items: serializeCart(user) });
  })
);

/** DELETE /api/cart — empty the whole cart. */
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = [] as any;
    await user.save();
    res.json({ items: [] });
  })
);

export default router;
