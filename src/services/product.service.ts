import {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import { ApiResponse } from "../interfaces/response.interface";
import productRepository from "../repositories/product.repository";
import { AppError } from "../utils/AppError";
import { config } from "../config";
import cache from "../utils/cache";

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
class ProductService {
  async createProduct(
    userId: string,
    data: CreateProductInput & { imageUrls?: string[] },
  ): Promise<ApiResponse> {
    const product = await productRepository.create({
      ...data,
      userId,
    });
    // Invalidate product listing cache on create
    cache.delPrefix("products:");

    return {
      success: true,
      message: "Product created successfully",
      data: product,
    };
  }

  async updateProduct(
    productId: string,
    data: UpdateProductInput & { imageUrls?: string[] },
  ): Promise<ApiResponse> {
    // Check if product exists
    const existingProduct = await productRepository.findById(productId);
    if (!existingProduct) {
      throw AppError.notFound("Product not found");
    }
    const product = await productRepository.update(productId, data);
    // Invalidate product listing cache on update
    cache.delPrefix("products:");
    return {
      success: true,
      message: "Product updated successfully",
      data: product,
    };
  }

  async getProducts(params: GetProductsParams): Promise<ApiResponse> {
    // Build a cache key from params
    const key = `products:${JSON.stringify(params ?? {})}`;
    const cached = cache.get(key);
    if (cached) {
      return {
        success: true,
        message: "Products retrieved successfully (from cache)",
        data: cached,
      };
    }
    const result = await productRepository.findAll(params);
    // Cache the result for configured TTL (seconds)
    cache.set(key, result, config.cache.ttlSeconds);
    return {
      success: true,
      message: "Products retrieved successfully",
      data: result,
    };
  }

  async getProductById(id: string): Promise<ApiResponse> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw AppError.notFound("Product not found");
    }
    return {
      success: true,
      message: "Product retrieved successfully",
      data: product,
    };
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    // Check if product exists
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw AppError.notFound("Product not found");
    }
    const product = await productRepository.delete(id);
    // Invalidate product listing cache on delete
    cache.delPrefix("products:");
    return {
      success: true,
      message: "Product deleted successfully",
      data: product,
    };
  }
}

export default new ProductService();
