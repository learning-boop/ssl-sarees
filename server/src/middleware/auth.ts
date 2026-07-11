import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";

// Extend Express's Request type so req.user is typed everywhere.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/** Requires a valid JWT in the Authorization header. Attaches req.user. */
export function authenticate(req: Request, res: Response, next: NextFunction) {
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

/** Use after authenticate(). Requires req.user.role === "admin". */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
