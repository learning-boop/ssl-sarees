import mongoose from "mongoose";

/**
 * Connects to MongoDB using MONGODB_URI.
 *
 * Serverless-safe: on Vercel each function invocation may reuse a warm
 * process, so we cache the connection promise and never reconnect if a
 * connection is already open. Locally it just connects once at startup.
 */
let cached: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (mongoose.connection.readyState === 1) return;
  if (!cached) {
    cached = mongoose.connect(uri).then((m) => {
      console.log("Connected to MongoDB");
      return m;
    });
    // If the connection fails, allow a retry on the next request.
    cached.catch(() => {
      cached = null;
    });
  }
  await cached;
}
