import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import uploadRoutes from "./routes/upload";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import orderRoutes from "./routes/orders";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

// On Vercel the frontend and API share one domain (same-origin), so CORS
// mostly matters for local dev where they run on different ports.
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Serves locally uploaded images — LOCAL DEV ONLY. On Vercel serverless
// there is no persistent disk (use full image URLs or Cloudinary), and
// __dirname does not exist in the ESM bundle, so this must be skipped.
if (!process.env.VERCEL) {
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
}

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

// Fallback error handler so unexpected errors return JSON, not an HTML stack trace.
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
