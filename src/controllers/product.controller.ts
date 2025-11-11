import { Request, Response, NextFunction } from "express";
import productService from "../services/product.service";
import { AuthRequest } from "../interfaces/auth.interface";
import { AppError } from "../utils/AppError";
import { GetProductsQuery } from "../schemas/product.schema";
import { uploadBuffer, deleteByPublicId } from "../utils/cloudinary";

// Helper function to parse pagination and filter params
const parsePaginationParams = (query: GetProductsQuery) => {
  const page = query.page ? parseInt(query.page) : 1;
  const pageSize = query.limit ? parseInt(query.limit) : 10;
  const search = query.search?.toString();
  const category = query.category?.toString();
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

  return {
    page,
    pageSize,
    search,
    category,
    minPrice,
    maxPrice,
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
    // Handle uploaded images (multer supplies req.files as array)
    const files: Express.Multer.File[] = (req as any).files || [];
    const imageUrls: string[] = [];
    for (const file of files) {
      // our multer uses memoryStorage so file.buffer should be present
      if (file && (file as any).buffer) {
        const uploaded = await uploadBuffer((file as any).buffer);
        if (uploaded && uploaded.url) imageUrls.push(uploaded.url);
      }
    }
    const payload: any = { ...req.body };
    if (imageUrls.length) payload.imageUrls = imageUrls;
    const result = await productService.createProduct(req.user.id, payload);
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
    // Upload new images if provided
    const files: Express.Multer.File[] = (req as any).files || [];
    const imageUrls: string[] = [];
    for (const file of files) {
      if (file && (file as any).buffer) {
        const uploaded = await uploadBuffer((file as any).buffer);
        if (uploaded && uploaded.url) imageUrls.push(uploaded.url);
      }
    }

    const payload: any = { ...req.body };
    if (imageUrls.length) payload.imageUrls = imageUrls;
    // Optionally delete old images
    if (req.query.deleteOld === "true") {
      try {
        const existing = await productService.getProductById(req.params.id);
        const urls: string[] = existing.data?.imageUrls || [];
        for (const url of urls) {
          // extract publicId from url
          try {
            const parts = url.split("/");
            const last = parts[parts.length - 1];
            const publicId = last.split(".")[0];
            await deleteByPublicId(publicId);
          } catch (e) {
            // ignore error
          }
        }
      } catch (e) {
        // ignore error
      }
    }
    const result = await productService.updateProduct(req.params.id, payload);
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

// Get a single product
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await productService.getProductById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
