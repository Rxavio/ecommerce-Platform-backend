import { CreateProductInput } from "../schemas/product.schema";
import { ApiResponse } from "../interfaces/response.interface";
import productRepository from "../repositories/product.repository";
import { AppError } from "../utils/AppError";
import { config } from "../config";

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
}

export default new ProductService();
