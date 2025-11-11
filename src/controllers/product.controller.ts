import { Request, Response, NextFunction } from "express";
import productService from "../services/product.service";
import { AuthRequest } from "../interfaces/auth.interface";
import { AppError } from "../utils/AppError";

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError(401, "User not authenticated"));
    }

    const result = await productService.createProduct(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
