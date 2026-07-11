import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { authenticate } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * POST /api/auth/register
 * Public signup for customers. Always creates role "user" — admin
 * accounts are created only via the seed script, never through this
 * endpoint, so a random visitor can never grant themselves admin.
 */
router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: "user" });

  const token = signToken({ id: user._id.toString(), email: user.email, role: "user" });
  res.status(201).json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  });
});

/**
 * POST /api/auth/login
 * Shared by both the customer login page and the admin login page.
 * The token carries the user's real role — the admin login page
 * checks role === "admin" client-side and rejects otherwise, but the
 * important enforcement happens server-side on protected routes.
 */
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role as "user" | "admin",
  });
  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  });
});

/** GET /api/auth/me — returns the currently logged in user. */
router.get("/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
});

export default router;
