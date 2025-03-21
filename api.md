# Puppeteer Scraper API Documentation

## Authentication

All API endpoints require an API key to be included in the request header:

```
X-API-Key: your-api-key
```

For development, you can use `test-key-1` as defined in the environment configuration.

## Endpoints

### Health Check

**Endpoint:** `GET /health`

**Description:** Verify the API is running correctly

**Authentication:** Not required

**Example Request:**

```bash
curl http://localhost:3000/health
```

**Example Response:**

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Crypto Mining Data

**Endpoint:** `POST /api/crypto`

**Description:** Scrape crypto mining profitability data from asicminervalue.com for a specific ASIC miner, using a configurable electricity cost parameter.

**Authentication:** Required

**Request Parameters:**

```json
{
  "electricityCost": "0.05" // Optional - Cost of electricity in USD per kWh, defaults to 0.0675
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/crypto \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"electricityCost": "0.05"}'
```

**Example Response:**

```json
{
  "success": true,
  "content": "Antminer L9 (17Gh) profitability... [content truncated for brevity]",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "parameters": {
    "electricityCost": "0.05"
  }
}
```

**Error Responses:**

- 400 Bad Request: Invalid parameter format
- 401 Unauthorized: Invalid or missing API key
- 500 Internal Server Error: Scraping or processing failed

### Text Extraction

**Endpoint:** `POST /api/text`

**Description:** Extracts readable content from a web page, similar to browser reader mode. Uses Mozilla's Readability library to parse HTML and extract the main content, title, and other metadata.

**Authentication:** Required

**Request Parameters:**

```json
{
  "url": "https://example.com/article", // Required - URL to extract text from
  "includeHtml": false // Optional - Include HTML content in response
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"url": "https://example.com/article"}'
```

**Example Response (without HTML):**

```json
{
  "success": true,
  "url": "https://example.com/article",
  "title": "Example Domain",
  "byline": "Author Name",
  "content": "This domain is for use in illustrative examples in documents...",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "length": 191,
  "excerpt": "This domain is for use in illustrative examples..."
}
```

**Example Response (with HTML):**

```json
{
  "success": true,
  "url": "https://example.com",
  "title": "Example Domain",
  "content": "This domain is for use in illustrative examples...",
  "contentHtml": "<div><p>This domain is for use in illustrative examples...</p></div>",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "length": 191,
  "excerpt": "This domain is for use in illustrative examples..."
}
```

**Error Responses:**

- 400 Bad Request: Invalid URL or missing required parameters
- 401 Unauthorized: Invalid or missing API key
- 500 Internal Server Error: Scraping or processing failed

## Error Handling

All endpoints return appropriate HTTP status codes:

- 200: Successful operation
- 400: Bad request (invalid parameters)
- 401: Unauthorized (invalid or missing API key)
- 404: Endpoint not found
- 500: Server error

Error responses follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```
