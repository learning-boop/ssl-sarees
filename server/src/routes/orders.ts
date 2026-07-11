import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { authenticate, requireAdmin } from "../middleware/auth";
import { verifyToken } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * Like authenticate(), but doesn't reject guests — if a valid token is
 * present the order gets linked to the user's account, otherwise it's
 * stored as a guest order. Checkout should work for everyone.
 */
function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.slice("Bearer ".length));
    } catch {
      // invalid/expired token — treat as guest
    }
  }
  next();
}

function generateOrderNumber(): string {
  // e.g. SSL-250710-8342 (date + random suffix, human-friendly)
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SSL-${date}-${rand}`;
}

const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string().min(1),
  image: z.string().default(""),
  price: z.number().min(0),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(6),
  }),
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().min(0),
  shipping: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().min(0),
  paymentMethod: z.string().min(1),
});

/** POST /api/orders — place an order (works for guests and logged-in users). */
router.post(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const order = await Order.create({
      ...parsed.data,
      orderNumber: generateOrderNumber(),
      user: req.user?.id,
    });

    // Reduce inventory for each ordered item; auto flag out-of-stock at 0.
    // Skipped silently for items whose product no longer exists.
    for (const item of parsed.data.items) {
      const product = await Product.findById(item.productId).catch(() => null);
      if (!product) continue;
      product.stockQuantity = Math.max(0, (product.stockQuantity ?? 0) - item.quantity);
      if (product.stockQuantity === 0) product.inStock = false;
      await product.save();
    }

    res.status(201).json({ order: order.toJSON() });
  })
);

/** GET /api/orders/my — the logged-in user's own orders. */
router.get(
  "/my",
  authenticate,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user!.id }).sort({ createdAt: -1 });
    res.json({ orders: orders.map((o) => o.toJSON()) });
  })
);

/** GET /api/orders — ALL orders (admin only, newest first). */
router.get(
  "/",
  authenticate,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders: orders.map((o) => o.toJSON()) });
  })
);

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

/** PUT /api/orders/:id/status — update order status (admin only). */
router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id).catch(() => null);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = parsed.data.status;
    await order.save();
    res.json({ order: order.toJSON() });
  })
);

export default router;
