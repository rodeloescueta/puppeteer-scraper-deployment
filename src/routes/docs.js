const express = require("express");
const router = express.Router();
const path = require("path");

/**
 * GET /
 * API documentation page
 */
router.get("/", (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puppeteer Scraper API</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #2c3e50;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
      }
      h2 {
        color: #3498db;
        margin-top: 30px;
      }
      pre {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
      }
      code {
        font-family: Consolas, Monaco, "Andale Mono", monospace;
      }
      .endpoint {
        margin-bottom: 30px;
        border-left: 4px solid #3498db;
        padding-left: 15px;
      }
      .method {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 5px;
        background-color: #3498db;
        color: white;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>Puppeteer Scraper API</h1>
    <p>
      A dockerized web scraping API service that transforms standalone Puppeteer scripts into accessible API endpoints.
    </p>

    <h2>Authentication</h2>
    <p>
      All API endpoints require an API key to be included in the request header:
    </p>
    <pre><code>X-API-Key: your-api-key</code></pre>

    <h2>Endpoints</h2>
    
    <div class="endpoint">
      <h3><span class="method">GET</span> /health</h3>
      <p>Health check endpoint to verify the API is running correctly.</p>
      <h4>Example Request:</h4>
      <pre><code>curl http://localhost:3000/health</code></pre>
      <h4>Example Response:</h4>
      <pre><code>{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2023-01-01T00:00:00.000Z"
}</code></pre>
    </div>

    <div class="endpoint">
      <h3><span class="method">POST</span> /api/crypto</h3>
      <p>Scrape crypto mining data from ASIC miner value with a customizable electricity cost.</p>
      <h4>Request Parameters:</h4>
      <pre><code>{
  "electricityCost": "0.05"  // Optional, defaults to 0.0675
}</code></pre>
      <h4>Example Request:</h4>
      <pre><code>curl -X POST http://localhost:3000/api/crypto \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"electricityCost": "0.05"}'</code></pre>
      <h4>Example Response:</h4>
      <pre><code>{
  "success": true,
  "content": "... extracted data ...",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "parameters": {
    "electricityCost": "0.05"
  }
}</code></pre>
    </div>

    <div class="endpoint">
      <h3><span class="method">POST</span> /api/text</h3>
      <p>Extract readable text content from a webpage, similar to browser reader view.</p>
      <h4>Request Parameters:</h4>
      <pre><code>{
  "url": "https://example.com/article",  // Required, must be a valid URL
  "includeHtml": false                   // Optional, set to true to include HTML content
}</code></pre>
      <h4>Example Request:</h4>
      <pre><code>curl -X POST http://localhost:3000/api/text \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"url": "https://example.com/article"}'</code></pre>
      <h4>Example Response:</h4>
      <pre><code>{
  "success": true,
  "url": "https://example.com/article",
  "title": "Article Title",
  "byline": "Author Name",
  "content": "The extracted text content without HTML tags...",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "length": 1234,
  "excerpt": "A short excerpt from the beginning of the article..."
}</code></pre>
    </div>

    <footer>
      <p>© 2025 Puppeteer Scraper API</p>
    </footer>
  </body>
  </html>
  `;

  res.send(html);
});

module.exports = router;
