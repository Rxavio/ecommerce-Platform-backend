import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { config } from "./config";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";
import { logger } from "./utils/logger";

// Initialize express app
const app = express();

// Security middleware
app.use(helmet()); // Add security headers
app.use(
  cors({
    origin:
      config.nodeEnv === "development" ? "*" : process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Request parsing middleware
app.use(express.json());

// Logging middleware
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use("/api", routes);

// Return a custom 404 for unknown API routes
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Basic health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    docs: "http://localhost:" + config.port + "/api-docs",
  });
});

// Start server
const startServer = () => {
  try {
    const server = app.listen(config.port, () => {
      logger.info("Server started", {
        port: config.port,
        environment: config.nodeEnv,
        healthCheck: `http://localhost:${config.port}/health`,
        apiDocs: `http://localhost:${config.port}/api-docs`,
      });
    });

    // Handle shutdown gracefully
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export { app, startServer };
