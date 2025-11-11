import { Router } from "express";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller";
import { validateRequest } from "../middleware/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";
import { z } from "zod";
import { authenticateToken, isAdmin } from "../middleware/auth.middleware";
import { productImageUpload } from "../middleware/upload.middleware";

const router = Router();

// POST /products - Create a new product (Admin only)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  productImageUpload,
  validateRequest({ body: createProductSchema }),
  createProduct,
);

// PUT /products/:id - Update an existing product (Admin only)
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  productImageUpload,
  validateRequest({
    params: updateProductSchema.shape.params,
    body: updateProductSchema.shape.body,
  }),
  updateProduct,
);

// DELETE /products/:id - Delete a product (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  validateRequest({
    params: z.object({ id: z.string().uuid() }),
  }),
  deleteProduct,
);

// GET /products - Get all products with pagination and search
router.get("/", getProducts);

// GET /products/:id - Get product by ID
router.get(
  "/:id",
  validateRequest({
    params: z.object({ id: z.string().uuid() }),
  }),
  getProductById,
);

export default router;
