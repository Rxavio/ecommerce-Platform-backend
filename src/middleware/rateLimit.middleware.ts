import { Request, Response, NextFunction } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

// Load environment variables from .env file
const WINDOW_SECS = parseInt(
  process.env.ORDER_RATE_LIMIT_WINDOW_SECS || `${5 * 60}`,
  10,
); // 5 min
const MAX_REQ = parseInt(process.env.ORDER_RATE_LIMIT_MAX_REQ || "10", 10);
const RETRY_AFTER = parseInt(
  process.env.ORDER_RATE_LIMIT_RETRY_AFTER?.replace(/\D/g, "") || "300",
  10,
); // 5 min

/**
 * Rate limiter for order-related routes.
 */
export const orderRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: WINDOW_SECS * 1000,
  max: MAX_REQ,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (_req: Request, res: Response, _next: NextFunction) => {
    const retryAfterMinutes = Math.ceil(RETRY_AFTER / 60);
    const retryAfterText = `${retryAfterMinutes} minute${retryAfterMinutes > 1 ? "s" : ""}`;

    res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many order requests. Please try again later",
      retryAfter: retryAfterText,
    });
  },
});
