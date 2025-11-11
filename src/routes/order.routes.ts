import { Router } from "express";
import orderController from "../controllers/order.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { CreateOrderSchema } from "../schemas/order.schema";
import { authenticateToken } from "../middleware/auth.middleware";
import { orderRateLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.use(authenticateToken); // All order routes require authentication

router.post(
  "/",
  // Apply rate limiter
  orderRateLimiter,
  validateRequest({ body: CreateOrderSchema }),
  orderController.createOrder,
);
router.get("/", orderController.getUserOrders);

export default router;
