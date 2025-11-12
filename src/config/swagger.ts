import { Express } from "express";

export const setupSwagger = (app: Express) => {
  try {
    const swaggerUi = require("swagger-ui-express");
    const { swaggerSpec } = require("../swagger");
    const { logger } = require("../utils/logger");

    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
          persistAuthorization: true,
        },
      }),
    );
    logger.info("Swagger documentation available at /api-docs");
  } catch (err) {
    const { logger } = require("../utils/logger");
    logger.warn(
      "Swagger packages not installed. API documentation unavailable. Run: npm install swagger-ui-express swagger-jsdoc",
    );
  }
};
