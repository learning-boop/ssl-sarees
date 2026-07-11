import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every wishlist route requires a logged-in user.
router.use(authenticate);

function serializeWishlist(user: any) {
  return (user.wishlist as any[]).filter(Boolean).map((p) => p.toJSON());
}

/** GET /api/wishlist */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ items: serializeWishlist(user) });
  })
);

/** POST /api/wishlist/:productId — add a product to the wishlist. */
router.post(
  "/:productId",
  asyncHandler(async (req, res) => {
    // Guard against non-ObjectId ids (e.g. static demo product "1") which
    // would otherwise make findById throw and crash the request.
    if (!isValidObjectId(req.params.productId)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyIn = user.wishlist.some((id) => id.toString() === req.params.productId);
    if (!alreadyIn) {
      user.wishlist.push(product._id as any);
      await user.save();
    }
    await user.populate("wishlist");
    res.status(201).json({ items: serializeWishlist(user) });
  })
);

/** DELETE /api/wishlist/:productId — remove a product from the wishlist. */
router.delete(
  "/:productId",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId) as any;
    await user.save();
    await user.populate("wishlist");
    res.json({ items: serializeWishlist(user) });
  })
);

export default router;
