import prisma from "../config/prisma";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
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

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }
}
export default new ProductRepository();
