const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    // openapi: "",
    info: {
      title: "E-Commerce Platform API",
      version: "1.0.0",
      description:
        "Complete REST API for an e-commerce platform with product management, user authentication, and order processing",
      contact: {
        name: "API Support",
        email: "support@ecommerce.local",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "https://api.example.com",
        description: "E-Commerce Platform API",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT token required for authenticated endpoints. Include 'Authorization: Bearer <token>' in header.",
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "User authentication endpoints (register, login)",
      },
      {
        name: "Products",
        description:
          "Product management endpoints (CRUD operations, search, filters and image upload)",
      },
      {
        name: "Orders",
        description:
          "Order management endpoints (create, retrieve user orders)",
      },
    ],
  },
  apis: ["./src/swagger/**/*.ts", "./src/routes/**/*.ts"],
};

module.exports = { swaggerSpec: swaggerJsdoc(options) };
