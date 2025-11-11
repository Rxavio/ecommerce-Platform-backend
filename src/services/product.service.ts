import {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import { ApiResponse } from "../interfaces/response.interface";
import productRepository from "../repositories/product.repository";
import { AppError } from "../utils/AppError";
import { config } from "../config";

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
    data: CreateProductInput,
  ): Promise<ApiResponse> {
    const product = await productRepository.create({
      ...data,
      userId,
    });

    return {
      success: true,
      message: "Product created successfully",
      data: product,
    };
  }

  async updateProduct(
    productId: string,
    data: UpdateProductInput,
  ): Promise<ApiResponse> {
    // Check if product exists
    const existingProduct = await productRepository.findById(productId);
    if (!existingProduct) {
      throw AppError.notFound("Product not found");
    }
    const product = await productRepository.update(productId, data);
    return {
      success: true,
      message: "Product updated successfully",
      data: product,
    };
  }

  async getProducts(params: GetProductsParams): Promise<ApiResponse> {
    const result = await productRepository.findAll(params);
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
}

export default new ProductService();
