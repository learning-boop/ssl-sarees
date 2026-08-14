import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import Razorpay from "razorpay";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

function getRazorpay(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

const createSchema = z.object({
  amount: z.number().positive(), // in rupees
});

/**
 * POST /api/payment/create-order
 * Creates a Razorpay order for the given amount (₹) and returns the
 * details the frontend needs to open the Razorpay checkout popup.
 */
router.post(
  "/create-order",
  asyncHandler(async (req, res) => {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(500).json({
        message:
          "Payments are not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing).",
      });
    }

    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "A valid amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(parsed.data.amount * 100), // rupees -> paise
      currency: "INR",
      receipt: `ssl_${Date.now()}`,
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  })
);

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/**
 * POST /api/payment/verify
 * Verifies the payment signature returned by Razorpay checkout, proving
 * the payment is genuine and untampered. Orders for online payments must
 * only be created after this returns { valid: true }.
 */
router.post("/verify", (req, res) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return res.status(500).json({
      message: "Payments are not configured (RAZORPAY_KEY_SECRET missing).",
    });
  }

  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Missing payment verification fields" });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

  if (!valid) {
    return res.status(400).json({ valid: false, message: "Payment verification failed" });
  }

  res.json({ valid: true });
});

export default router;
