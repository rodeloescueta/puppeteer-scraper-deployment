require("dotenv").config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",

  // Feature flags
  useMockBrowser: process.env.USE_MOCK_BROWSER === "true",
  autoFallbackToMock: process.env.AUTO_FALLBACK_TO_MOCK !== "false",

  // Browserbase configuration
  browserbaseApiKey: process.env.BROWSERBASE_API_KEY,
  browserbaseProjectId: process.env.BROWSERBASE_PROJECT_ID,

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
