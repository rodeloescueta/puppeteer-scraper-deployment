const express = require("express");
const { validateCryptoRequest } = require("../middleware/validators");
const { apiKeyAuth } = require("../middleware/auth");
const cryptoScraperService = require("../services/cryptoScraper");
const logger = require("../utils/logger");
const config = require("../config");

const router = express.Router();

/**
 * POST /crypto
 * Scrape crypto mining data with optional electricity cost parameter
 */
router.post("/", apiKeyAuth, validateCryptoRequest, async (req, res) => {
  try {
    // Use the provided electricityCost or fallback to the default value
    const electricityCost =
      req.body.electricityCost ||
      config.scraperDefaults.crypto.defaultElectricityCost;

    logger.info(
      `Received crypto scraping request with electricityCost: ${electricityCost}`
    );

    const result = await cryptoScraperService.scrapeData(electricityCost);

    return res.json(result);
  } catch (error) {
    logger.error(`Crypto endpoint error: ${error.message}`);
    return res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
});

module.exports = router;
