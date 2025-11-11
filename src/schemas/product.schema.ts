import { z } from "zod";

// Base product schema for shared fields
const productBase = {
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  price: z.preprocess(
    (val) => {
      // Accept string values from multipart/form-data and convert them to numbers
      if (typeof val === "string") return Number(val);
      return val;
    },
    z
      .number()
      .positive("Price must be greater than 0")
      .min(0.01, "Minimum price is 0.01")
      .max(1000000, "Maximum price is 1,000,000"),
  ),

  stock: z.preprocess(
    (val) => {
      if (typeof val === "string") return Number(val);
      return val;
    },
    z
      .number()
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative"),
  ),

  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category cannot exceed 50 characters"),
};

// Create product schema
export const createProductSchema = z.object({
  ...productBase,
});

// Update product schema (all fields optional)
export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
  body: z.object({
    name: productBase.name.optional(),
    description: productBase.description.optional(),
    price: productBase.price.optional(),
    stock: productBase.stock.optional(),
    category: productBase.category.optional(),
  }),
});

// Get product schema (for query parameters)
export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).default("1"),
    limit: z.string().regex(/^\d+$/).default("10"),
    category: z.string().optional(),
    search: z.string().optional(),
    minPrice: z
      .string()
      .regex(/^\d+\.?\d*$/)
      .optional(),
    maxPrice: z
      .string()
      .regex(/^\d+\.?\d*$/)
      .optional(),
    sortBy: z.enum(["price", "name", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

// Types inferred from schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsQuery = z.infer<typeof getProductsSchema>["query"];
