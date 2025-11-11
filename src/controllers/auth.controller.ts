import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    // Ensure the error is properly passed to the error handler
    return next(error instanceof Error ? error : new Error(String(error)));
  }
};
