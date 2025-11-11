import { Response, NextFunction } from "express";
import { CreateOrderInput } from "../schemas/order.schema";
import orderService from "../services/order.service";
import { ApiResponse } from "../interfaces/response.interface";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../interfaces/auth.interface";

class OrderController {
  async createOrder(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ) {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError(401, "User not authenticated"));
      }
      const userId = req.user.id;
      const orderItems = req.body as CreateOrderInput;

      const order = await orderService.createOrder(userId, orderItems);

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ) {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError(401, "User not authenticated"));
      }
      const userId = req.user.id;
      const orders = await orderService.getUserOrders(userId);

      res.status(200).json({
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
