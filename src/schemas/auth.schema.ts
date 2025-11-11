import { z } from "zod";

// Base user schema for shared fields
const userBase = {
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers"),

  email: z
    .string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email cannot exceed 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    ),
};

// Registration schema
export const registerSchema = z.object({
  ...userBase,
});

// Login schema
export const loginSchema = z.object({
  email: userBase.email,
  password: z.string().min(1, "Password is required"),
});

// Update user schema (all fields optional)
export const updateUserSchema = z.object({
  username: userBase.username.optional(),
  email: userBase.email.optional(),
  password: userBase.password.optional(),
});

// Types inferred from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
