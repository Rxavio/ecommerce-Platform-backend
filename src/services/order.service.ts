import { CreateOrderInput } from "../schemas/order.schema";
import orderRepository from "../repositories/order.repository";
import productRepository from "../repositories/product.repository";
import { AppError } from "../utils/AppError";
import { Order, OrderProduct } from "@prisma/client";
import prisma from "../config/prisma";

class OrderService {
  async createOrder(userId: string, items: CreateOrderInput): Promise<Order> {
    return prisma.$transaction(async (tx) => {
      // Check stock and calculate total price
      let totalPrice = 0;
      for (const item of items) {
        const product = await productRepository.findById(item.productId);
        if (!product) {
          throw AppError.notFound(
            `Product with id ${item.productId} not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw AppError.badRequest(
            `Insufficient stock for product ${product.name}`,
          );
        }

        totalPrice += product.price * item.quantity;
      }

      // Update stock for all products
      for (const item of items) {
        await orderRepository.updateProductStock(item.productId, item.quantity);
      }

      // Create the order
      return orderRepository.create(userId, items, totalPrice);
    });
  }

  async getUserOrders(userId: string): Promise<
    (Order & {
      products: (OrderProduct & {
        product: { id: string; name: string; price: number };
      })[];
    })[]
  > {
    return orderRepository.findByUserId(userId);
  }
}

export default new OrderService();
