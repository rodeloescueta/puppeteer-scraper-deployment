const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const config = require("./config");
const logger = require("./utils/logger");

// Import routes
const docsRoutes = require("./routes/docs");
const healthRoutes = require("./routes/health");
const cryptoRoutes = require("./routes/crypto");

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(express.json()); // Parse JSON body
app.use(morgan("combined")); // Request logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests",
    message: "Please try again later",
  },
});
app.use(limiter);

// Routes
app.use("/", docsRoutes);
app.use("/health", healthRoutes);
app.use("/crypto", cryptoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    error: "Server error",
    message:
      config.nodeEnv === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
});

// Start server
const server = app.listen(config.port, () => {
  logger.info(
    `Server running on port ${config.port} in ${config.nodeEnv} mode`
  );
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

module.exports = app; // For testing
