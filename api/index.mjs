// server/src/app.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import path2 from "path";

// server/src/routes/auth.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

// server/src/models/User.ts
import { Schema, model } from "mongoose";
var cartEntrySchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: 1 }
  },
  { _id: false }
);
var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // A user's cart and wishlist live directly on their account, so
    // they're available on any device once logged in, and survive
    // clearing browser storage.
    cart: { type: [cartEntrySchema], default: [] },
    wishlist: { type: [Schema.Types.ObjectId], ref: "Product", default: [] }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);
var User = model("User", userSchema);

// server/src/utils/jwt.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// server/src/middleware/auth.ts
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }
  const token = header.slice("Bearer ".length);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// server/src/routes/auth.ts
var router = Router();
var registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
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
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  });
});
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
    role: user.role
  });
  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  });
});
router.get("/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
});
var auth_default = router;

// server/src/routes/products.ts
import { Router as Router2 } from "express";
import { z as z2 } from "zod";

// server/src/models/Product.ts
import { Schema as Schema2, model as model2 } from "mongoose";
var productSchema = new Schema2(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Silk", "Banarasi", "Kanjivaram", "Cotton", "Designer", "Wedding"],
      required: true
    },
    fabric: { type: String, required: true },
    occasion: { type: [String], default: [] },
    color: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    images: { type: [String], required: true },
    description: { type: String, default: "" },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    // Per-product shipping charge in ₹ (existing products default to 199)
    shippingCharge: { type: Number, default: 199, min: 0 },
    // Inventory count; when it reaches 0 the product goes out of stock
    stockQuantity: { type: Number, default: 10, min: 0 },
    // Stored as a native Map in Mongo, converted to a plain object before
    // being sent to the frontend (see toJSON transform below).
    specifications: { type: Map, of: String, default: {} }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        if (ret.specifications instanceof Map) {
          ret.specifications = Object.fromEntries(ret.specifications);
        }
        return ret;
      }
    }
  }
);
var Product = model2("Product", productSchema);

// server/src/routes/products.ts
var router2 = Router2();
var productSchema2 = z2.object({
  name: z2.string().min(1),
  category: z2.enum(["Silk", "Banarasi", "Kanjivaram", "Cotton", "Designer", "Wedding"]),
  fabric: z2.string().min(1),
  occasion: z2.array(z2.string()).default([]),
  color: z2.string().min(1),
  price: z2.number().nonnegative(),
  discountedPrice: z2.number().nonnegative(),
  discount: z2.number().int().nonnegative().default(0),
  rating: z2.number().min(0).max(5).default(0),
  reviews: z2.number().int().nonnegative().default(0),
  images: z2.array(z2.string()).min(1),
  description: z2.string().default(""),
  isNewArrival: z2.boolean().default(false),
  isBestSeller: z2.boolean().default(false),
  isTrending: z2.boolean().default(false),
  inStock: z2.boolean().default(true),
  shippingCharge: z2.number().nonnegative().default(199),
  stockQuantity: z2.number().int().nonnegative().default(10),
  specifications: z2.record(z2.string(), z2.string()).default({})
});
router2.get("/", async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : void 0;
  const docs = await Product.find(category ? { category } : {}).sort({ createdAt: -1 });
  res.json(docs.map((d) => d.toJSON()));
});
router2.get("/:id", async (req, res) => {
  const doc = await Product.findById(req.params.id).catch(() => null);
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json(doc.toJSON());
});
router2.post("/", authenticate, requireAdmin, async (req, res) => {
  const parsed = productSchema2.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const doc = await Product.create(parsed.data);
  res.status(201).json(doc.toJSON());
});
router2.put("/:id", authenticate, requireAdmin, async (req, res) => {
  const parsed = productSchema2.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const doc = await Product.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).catch(() => null);
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json(doc.toJSON());
});
router2.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  const doc = await Product.findByIdAndDelete(req.params.id).catch(() => null);
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});
var products_default = router2;

// server/src/routes/upload.ts
import { Router as Router3 } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
var router3 = Router3();
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5MB per image
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP, or GIF images are allowed"));
  }
});
router3.post("/", authenticate, requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file was uploaded" });
  }
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});
var upload_default = router3;

// server/src/routes/cart.ts
import { Router as Router4 } from "express";
import { z as z3 } from "zod";
import { isValidObjectId } from "mongoose";

// server/src/utils/asyncHandler.ts
function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

// server/src/routes/cart.ts
var router4 = Router4();
router4.use(authenticate);
function serializeCart(user) {
  return user.cart.filter((entry) => entry.product).map((entry) => ({ product: entry.product.toJSON(), quantity: entry.quantity }));
}
router4.get(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ items: serializeCart(user) });
  })
);
var addSchema = z3.object({
  productId: z3.string(),
  quantity: z3.number().int().positive().default(1)
});
router4.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });
    const { productId, quantity } = parsed.data;
    if (!isValidObjectId(productId)) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const existing = user.cart.find((e) => e.product.toString() === productId);
    if (existing) existing.quantity += quantity;
    else user.cart.push({ product: product._id, quantity });
    await user.save();
    await user.populate("cart.product");
    res.status(201).json({ items: serializeCart(user) });
  })
);
var qtySchema = z3.object({ quantity: z3.number().int().min(0) });
router4.put(
  "/:productId",
  asyncHandler(async (req, res) => {
    const parsed = qtySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (parsed.data.quantity === 0) {
      user.cart = user.cart.filter((e) => e.product.toString() !== req.params.productId);
    } else {
      const existing = user.cart.find((e) => e.product.toString() === req.params.productId);
      if (existing) existing.quantity = parsed.data.quantity;
    }
    await user.save();
    await user.populate("cart.product");
    res.json({ items: serializeCart(user) });
  })
);
router4.delete(
  "/:productId",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = user.cart.filter((e) => e.product.toString() !== req.params.productId);
    await user.save();
    await user.populate("cart.product");
    res.json({ items: serializeCart(user) });
  })
);
router4.delete(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = [];
    await user.save();
    res.json({ items: [] });
  })
);
var cart_default = router4;

// server/src/routes/wishlist.ts
import { Router as Router5 } from "express";
import { isValidObjectId as isValidObjectId2 } from "mongoose";
var router5 = Router5();
router5.use(authenticate);
function serializeWishlist(user) {
  return user.wishlist.filter(Boolean).map((p) => p.toJSON());
}
router5.get(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ items: serializeWishlist(user) });
  })
);
router5.post(
  "/:productId",
  asyncHandler(async (req, res) => {
    if (!isValidObjectId2(req.params.productId)) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const alreadyIn = user.wishlist.some((id) => id.toString() === req.params.productId);
    if (!alreadyIn) {
      user.wishlist.push(product._id);
      await user.save();
    }
    await user.populate("wishlist");
    res.status(201).json({ items: serializeWishlist(user) });
  })
);
router5.delete(
  "/:productId",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
    await user.save();
    await user.populate("wishlist");
    res.json({ items: serializeWishlist(user) });
  })
);
var wishlist_default = router5;

// server/src/routes/orders.ts
import { Router as Router6 } from "express";
import { z as z4 } from "zod";

// server/src/models/Order.ts
import mongoose, { Schema as Schema3 } from "mongoose";
var orderItemSchema = new Schema3(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);
var orderSchema = new Schema3(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema3.Types.ObjectId, ref: "User" },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);
var Order = mongoose.model("Order", orderSchema);

// server/src/routes/orders.ts
var router6 = Router6();
function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.slice("Bearer ".length));
    } catch {
    }
  }
  next();
}
function generateOrderNumber() {
  const d = /* @__PURE__ */ new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1e3 + Math.random() * 9e3);
  return `SSL-${date}-${rand}`;
}
var orderItemSchema2 = z4.object({
  productId: z4.string(),
  name: z4.string().min(1),
  image: z4.string().default(""),
  price: z4.number().min(0),
  quantity: z4.number().int().positive()
});
var createOrderSchema = z4.object({
  customer: z4.object({
    firstName: z4.string().min(1),
    lastName: z4.string().min(1),
    email: z4.string().email(),
    phone: z4.string().min(10),
    address: z4.string().min(1),
    city: z4.string().min(1),
    state: z4.string().min(1),
    pincode: z4.string().min(6)
  }),
  items: z4.array(orderItemSchema2).min(1),
  subtotal: z4.number().min(0),
  shipping: z4.number().min(0),
  discount: z4.number().min(0).default(0),
  total: z4.number().min(0),
  paymentMethod: z4.string().min(1)
});
router6.post(
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
      user: req.user?.id
    });
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
router6.get(
  "/my",
  authenticate,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders: orders.map((o) => o.toJSON()) });
  })
);
router6.get(
  "/",
  authenticate,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders: orders.map((o) => o.toJSON()) });
  })
);
var statusSchema = z4.object({
  status: z4.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
});
router6.put(
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
var orders_default = router6;

// server/src/app.ts
var app = express();
var allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
if (!process.env.VERCEL) {
  app.use("/uploads", express.static(path2.join(process.cwd(), "uploads")));
}
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", auth_default);
app.use("/api/products", products_default);
app.use("/api/upload", upload_default);
app.use("/api/cart", cart_default);
app.use("/api/wishlist", wishlist_default);
app.use("/api/orders", orders_default);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});
var app_default = app;

// server/src/db.ts
import mongoose2 from "mongoose";
var cached = null;
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (mongoose2.connection.readyState === 1) return;
  if (!cached) {
    cached = mongoose2.connect(uri).then((m) => {
      console.log("Connected to MongoDB");
      return m;
    });
    cached.catch(() => {
      cached = null;
    });
  }
  await cached;
}

// api/_handler.ts
async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Database connection failed: " + err.message }));
    return;
  }
  return app_default(req, res);
}
export {
  handler as default
};
