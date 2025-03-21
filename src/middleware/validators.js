const Joi = require("joi");
const logger = require("../utils/logger");

/**
 * Validate crypto scraper request body
 */
function validateCryptoRequest(req, res, next) {
  const schema = Joi.object({
    electricityCost: Joi.string()
      .pattern(/^\d+(\.\d+)?$/)
      .optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    logger.warn(`Invalid crypto request: ${error.message}`);
    return res.status(400).json({
      error: "Validation error",
      message: error.message,
    });
  }

  next();
}

/**
 * Validate text extractor request body
 */
function validateTextRequest(req, res, next) {
  const schema = Joi.object({
    url: Joi.string().uri().required(),
    includeHtml: Joi.boolean().default(false).optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    logger.warn(`Invalid text extraction request: ${error.message}`);
    return res.status(400).json({
      error: "Validation error",
      message: error.message,
    });
  }

  // Make validated values available
  req.body = value;
  next();
}

module.exports = {
  validateCryptoRequest,
  validateTextRequest,
};
