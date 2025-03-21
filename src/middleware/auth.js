const config = require("../config");
const logger = require("../utils/logger");

/**
 * Middleware for API key authentication
 */
function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    logger.warn("API request missing API key");
    return res.status(401).json({
      error: "Authentication failed",
      message: "API key is required",
    });
  }

  if (!config.apiKeys.includes(apiKey)) {
    logger.warn(`Invalid API key attempted: ${apiKey.substring(0, 4)}...`);
    return res.status(401).json({
      error: "Authentication failed",
      message: "Invalid API key",
    });
  }

  // API key is valid, proceed
  logger.debug("API key authentication successful");
  next();
}

module.exports = {
  apiKeyAuth,
};
