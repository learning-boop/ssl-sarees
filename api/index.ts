import type { IncomingMessage, ServerResponse } from "http";
import app from "../server/src/app";
import { connectDB } from "../server/src/db";

/**
 * Vercel serverless entry point. Every /api/* request is rewritten here
 * (see vercel.json); we ensure the MongoDB connection is ready, then let
 * the existing Express app handle the request unchanged.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await connectDB();
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}
