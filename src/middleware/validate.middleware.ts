import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type ValidationSchema = {
  params?: z.ZodType<any>;
  query?: z.ZodType<any>;
  body?: z.ZodType<any>;
};

export const validateRequest = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((issue) => {
            // Handle undefined body specifically
            if (issue.message === "Required" && issue.path.length === 0) {
              return {
                path: "body",
                message:
                  "Request body is required with the following fields: name, description, price, stock, category",
              };
            }
            return {
              path: issue.path.join("."),
              message: issue.message,
            };
          }),
        });
      }

      // Handle other errors
      next(error);
    }
  };
};
