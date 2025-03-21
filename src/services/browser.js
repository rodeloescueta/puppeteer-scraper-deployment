const puppeteer = require("puppeteer-core");
const Browserbase = require("@browserbasehq/sdk").default;
const logger = require("../utils/logger");
const config = require("../config");

/**
 * Mock browser implementation for development without Browserbase
 */
class MockBrowser {
  constructor() {
    logger.info("Creating mock browser instance");
  }

  async newPage() {
    logger.info("Creating mock page");
    return {
      goto: async (url) => {
        logger.info(`Mock navigating to: ${url}`);
        return Promise.resolve();
      },
      waitForSelector: async (selector) => {
        logger.info(`Mock waiting for selector: ${selector}`);
        return Promise.resolve();
      },
      $eval: async (selector, fn) => {
        logger.info(`Mock evaluating on selector: ${selector}`);
        return Promise.resolve();
      },
      click: async (selector, options) => {
        logger.info(`Mock clicking on selector: ${selector}`);
        return Promise.resolve();
      },
      keyboard: {
        press: async (key) => {
          logger.info(`Mock pressing key: ${key}`);
          return Promise.resolve();
        },
      },
      type: async (selector, text) => {
        logger.info(`Mock typing "${text}" into selector: ${selector}`);
        return Promise.resolve();
      },
      evaluate: async (fn) => {
        logger.info("Mock evaluating function in page context");
        return "MOCK DATA: This is simulated content from the mock browser for testing purposes.";
      },
    };
  }

  async close() {
    logger.info("Mock browser closed");
    return Promise.resolve();
  }

  on(event, callback) {
    logger.info(`Mock browser registered event listener for: ${event}`);
  }
}

/**
 * Browser service to manage Browserbase connections
 */
class BrowserService {
  constructor() {
    this.activeConnections = 0;
    this.maxConnections = 3; // Browserbase limit
    this.bb = null;
  }

  /**
   * Connect to Browserbase and return a browser instance
   */
  async connect() {
    // Debug logging
    logger.info(`Config useMockBrowser value: ${config.useMockBrowser}`);
    logger.info(
      `Environment USE_MOCK_BROWSER: ${process.env.USE_MOCK_BROWSER}`
    );

    // Use mock browser in development if enabled
    if (config.useMockBrowser) {
      logger.info("Using mock browser instead of Browserbase");
      return new MockBrowser();
    }

    if (this.activeConnections >= this.maxConnections) {
      logger.warn(
        `Connection limit reached: ${this.activeConnections}/${this.maxConnections}`
      );
      throw new Error("Maximum browser connections reached");
    }

    try {
      logger.info("Connecting to Browserbase...");

      // Validate API key and project ID
      if (!config.browserbaseApiKey || !config.browserbaseProjectId) {
        throw new Error("Browserbase API key or Project ID not configured");
      }

      logger.info(
        `Using Browserbase API Key: ${config.browserbaseApiKey.substring(
          0,
          10
        )}... (partially hidden)`
      );
      logger.info(
        `Using Browserbase Project ID: ${config.browserbaseProjectId}`
      );

      // Initialize Browserbase client
      if (!this.bb) {
        this.bb = new Browserbase({
          apiKey: config.browserbaseApiKey,
        });
        logger.info("Browserbase client initialized");
      }

      // Create a new session
      logger.info("Creating Browserbase session...");
      const session = await this.bb.sessions.create({
        projectId: config.browserbaseProjectId,
      });
      logger.info(`Session created with ID: ${session.id}`);

      // Connect to the session
      logger.info(`Connecting to session via: ${session.connectUrl}`);
      const browser = await puppeteer.connect({
        browserWSEndpoint: session.connectUrl,
      });

      this.activeConnections++;
      logger.info(
        `Connected to Browserbase. Active connections: ${this.activeConnections}`
      );

      // Setup disconnect handler
      browser.on("disconnected", () => {
        this.activeConnections--;
        logger.info(
          `Browser disconnected. Active connections: ${this.activeConnections}`
        );
      });

      return browser;
    } catch (error) {
      logger.error(`Failed to connect to Browserbase: ${error.message}`);
      logger.error(`Stack trace: ${error.stack}`);

      // Fall back to mock browser if connection fails
      if (!config.useMockBrowser && config.autoFallbackToMock) {
        logger.info("Falling back to mock browser due to connection error");
        return new MockBrowser();
      }

      throw error;
    }
  }

  /**
   * Safely disconnect a browser instance
   */
  async disconnect(browser) {
    if (!browser) return;

    try {
      await browser.close();
      logger.info("Browser disconnected successfully");
    } catch (error) {
      logger.error(`Error disconnecting browser: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new BrowserService();
