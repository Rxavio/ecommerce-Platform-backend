import prisma from "../config/prisma";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import { Product } from "@prisma/client";

interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

class ProductRepository {
  async create(
    data: CreateProductInput & { userId: string },
  ): Promise<Product> {
    const { userId, ...productData } = data;
    return prisma.product.create({
      data: {
        ...productData,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async findAll(params: ProductQueryParams) {
    const {
      page = 1,
      pageSize = 10,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
    } = params;
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.category = { equals: category, mode: "insensitive" };
    if (typeof minPrice === "number" || typeof maxPrice === "number") {
      where.price = {};
      if (typeof minPrice === "number") where.price.gte = minPrice;
      if (typeof maxPrice === "number") where.price.lte = maxPrice;
    }
    if (inStock) where.stock = { gt: 0 };

    const [products, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: Object.keys(where).length ? where : undefined,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({
        where: Object.keys(where).length ? where : undefined,
      }),
    ]);

    return {
      products,
      totalProducts,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalProducts / pageSize),
    };
  }
}

export default new ProductRepository();
