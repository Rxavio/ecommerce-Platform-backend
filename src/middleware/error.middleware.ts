import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";
import { config } from "../config";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error | AppError | ZodError | any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Handle AppError first to ensure it has the correct structure
  if (
    err instanceof AppError ||
    (err && "statusCode" in err && "isOperational" in err)
  ) {
    // Handle expected operational errors
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      message: "Database operation failed",
      error: err.message,
    });
  }

  // Log unexpected errors
  logger.error("Unexpected error:", {
    name: err.name,
    message: err.message,
    stack: config.nodeEnv === "development" ? err.stack : undefined,
  });

  // Handle all other errors
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(config.nodeEnv === "development" && { error: err.message }),
  });
};
