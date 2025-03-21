require("dotenv").config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",

  // Feature flags
  useMockBrowser: process.env.USE_MOCK_BROWSER === "true" || false,

  // Browserbase configuration
  browserbaseApiKey: process.env.BROWSERBASE_API_KEY,

  // Authentication
  apiKeys: process.env.API_KEYS
    ? process.env.API_KEYS.split(",")
    : ["test-key-1"],

  // Scraper specific configuration
  scraperDefaults: {
    crypto: {
      defaultElectricityCost: "0.0675",
    },
  },
};
