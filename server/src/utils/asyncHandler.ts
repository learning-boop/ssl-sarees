import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Express 4 does NOT catch errors thrown inside async route handlers.
 * An invalid Mongo ObjectId (e.g. a static frontend product id like "1")
 * makes Product.findById() reject with a CastError — without this wrapper
 * that rejection is unhandled, the request hangs, and on modern Node the
 * whole API process crashes. Wrapping every async handler forwards the
 * error to the JSON error middleware in index.ts instead.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
