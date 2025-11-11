import { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { createProductSchema } from "../schemas/product.schema";
import { authenticateToken, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// POST /products - Create a new product (Admin only)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  validateRequest({ body: createProductSchema }),
  createProduct,
);

export default router;
