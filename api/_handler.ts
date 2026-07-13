import type { IncomingMessage, ServerResponse } from "http";
import app from "../server/src/app";
import { connectDB } from "../server/src/db";

/**
 * Vercel serverless entry point. Ensures the MongoDB connection is ready,
 * then lets the existing Express app handle the request. Errors during
 * startup (e.g. missing MONGODB_URI) are returned as JSON so they are
 * visible instead of a generic FUNCTION_INVOCATION_FAILED page.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await connectDB();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Database connection failed: " + (err as Error).message }));
    return;
  }
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}
