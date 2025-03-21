const browserService = require("./browser");
const logger = require("../utils/logger");
const config = require("../config");

/**
 * Crypto Scraper Service
 */
class CryptoScraperService {
  /**
   * Scrape crypto mining data with the provided electricity cost
   * @param {string} electricityCost - The electricity cost to use in the calculation
   * @returns {Promise<object>} - The scraped content
   */
  async scrapeData(
    electricityCost = config.scraperDefaults.crypto.defaultElectricityCost
  ) {
    let browser = null;
    let result = { success: false };

    try {
      logger.info(
        `Starting crypto scraping with electricity cost: ${electricityCost}`
      );

      browser = await browserService.connect();
      const page = await browser.newPage();

      // Navigate to the target URL
      await page.goto(
        "https://www.asicminervalue.com/de/miners/bitmain/antminer-l9-17gh",
        { waitUntil: "networkidle2" }
      );

      // Wait for the input field with the ID "electricityCost" to appear
      await page.waitForSelector("#electricityCost", { timeout: 10000 });

      // Clear the field by setting its value to an empty string
      await page.$eval("#electricityCost", (el) => (el.value = ""));

      // Further clear the field with a triple-click and a Backspace press
      await page.click("#electricityCost", { clickCount: 3 });
      await page.keyboard.press("Backspace");

      // Type the new electricity cost value into the field
      await page.type("#electricityCost", electricityCost);

      // Wait for calculations to update
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Retrieve the entire page's readable text content
      const content = await page.evaluate(() => document.body.innerText);

      // Extract specific data (this can be enhanced later to parse specific parts)
      // For now, we're just returning the full content
      result = {
        success: true,
        content: content,
        timestamp: new Date().toISOString(),
        parameters: { electricityCost },
      };

      logger.info("Crypto scraping completed successfully");
      return result;
    } catch (error) {
      logger.error(`Error during crypto scraping: ${error.message}`);
      result.error = error.message;
      throw error;
    } finally {
      if (browser) {
        await browserService.disconnect(browser);
      }
    }
  }
}

// Export singleton instance
module.exports = new CryptoScraperService();
