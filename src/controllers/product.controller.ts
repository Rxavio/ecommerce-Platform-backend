import { Request, Response, NextFunction } from "express";
import productService from "../services/product.service";
import { AuthRequest } from "../interfaces/auth.interface";
import { AppError } from "../utils/AppError";
import { GetProductsQuery } from "../schemas/product.schema";

// Helper function to parse pagination and filter params
const parsePaginationParams = (query: GetProductsQuery) => {
  const page = query.page ? parseInt(query.page) : 1;
  const pageSize = query.limit ? parseInt(query.limit) : 10;
  const search = query.search?.toString();
  const category = query.category?.toString();
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  const sortBy = query.sortBy as "price" | "name" | "createdAt" | undefined;
  const order = query.order as "asc" | "desc" | undefined;

  return {
    page,
    pageSize,
    search,
    category,
    minPrice,
    maxPrice,
    sortBy,
    order,
  };
};

// Create a new product
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

// Update a product
export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError(401, "User not authenticated"));
    }

    const result = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
// Get all products
export const getProducts = async (
  req: Request<any, any, any, GetProductsQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = parsePaginationParams(req.query);
    const result = await productService.getProducts(params as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
