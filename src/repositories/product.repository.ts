import prisma from "../config/prisma";
import { CreateProductInput } from "../schemas/product.schema";
import { Product, Prisma } from "@prisma/client";

class ProductRepository {
  async create(
    data: CreateProductInput & { userId: string },
  ): Promise<Product> {
    const { userId, ...productData } = data;
    return prisma.product.create({
      data: {
        ...productData,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
export default new ProductRepository();
