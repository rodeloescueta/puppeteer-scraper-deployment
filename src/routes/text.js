const express = require("express");
const { validateTextRequest } = require("../middleware/validators");
const { apiKeyAuth } = require("../middleware/auth");
const textExtractorService = require("../services/textExtractor");
const logger = require("../utils/logger");

const router = express.Router();

/**
 * POST /text
 * Extract readable text content from a URL
 */
router.post("/", apiKeyAuth, validateTextRequest, async (req, res) => {
  try {
    const { url, includeHtml } = req.body;

    logger.info(`Received text extraction request for URL: ${url}`);

    const result = await textExtractorService.extractText(url, includeHtml);

    return res.json(result);
  } catch (error) {
    logger.error(`Text endpoint error: ${error.message}`);
    return res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
});

module.exports = router;
