const browserService = require("./browser");
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
const logger = require("../utils/logger");
const config = require("../config");

/**
 * Text Extractor Service
 * Extracts readable content from web pages using Mozilla's Readability
 */
class TextExtractorService {
  /**
   * Extract readable text content from a URL
   * @param {string} url - The URL to extract text from
   * @param {boolean} includeHtml - Whether to include HTML in the response
   * @returns {Promise<object>} - The extracted content
   */
  async extractText(url, includeHtml = false) {
    let browser = null;
    let result = { success: false };

    try {
      logger.info(`Starting text extraction for URL: ${url}`);

      // Validate URL format
      this.validateUrl(url);

      browser = await browserService.connect();
      const page = await browser.newPage();

      // Navigate to the target URL
      logger.info(`Navigating to: ${url}`);
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Wait for the content to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get the HTML content
      const html = await page.content();

      // Parse the HTML with Readability
      logger.info("Parsing content with Readability");
      const doc = new JSDOM(html, { url });
      const reader = new Readability(doc.window.document);
      const article = reader.parse();

      if (!article) {
        logger.warn(`Failed to extract content from ${url}`);
        throw new Error("Failed to extract content");
      }

      // Build the result
      result = {
        success: true,
        url: url,
        title: article.title,
        byline: article.byline,
        content: article.textContent,
        timestamp: new Date().toISOString(),
        length: article.textContent.length,
        excerpt: article.excerpt,
      };

      // Include HTML if requested
      if (includeHtml) {
        result.contentHtml = article.content;
      }

      logger.info(`Text extraction completed successfully for URL: ${url}`);
      return result;
    } catch (error) {
      logger.error(`Error during text extraction: ${error.message}`);
      if (result.success === false) {
        result.error = error.message;
      }
      throw error;
    } finally {
      if (browser) {
        await browserService.disconnect(browser);
      }
    }
  }

  /**
   * Validate URL format
   * @param {string} url - The URL to validate
   * @throws {Error} - If URL is invalid
   */
  validateUrl(url) {
    try {
      new URL(url);
    } catch (error) {
      logger.error(`Invalid URL format: ${url}`);
      throw new Error("Invalid URL format");
    }
  }
}

// Export singleton instance
module.exports = new TextExtractorService();
