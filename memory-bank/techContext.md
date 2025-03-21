# Technical Context: Puppeteer Scraper API

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime environment (v16+)
- **Express.js**: Web application framework
- **Puppeteer-core**: Headless browser automation library
- **Browserbase**: Remote browser service for enhanced scraping capabilities
- **Mozilla Readability**: Library for extracting readable content from web pages
- **Winston**: Logging library
- **Joi**: Schema validation
- **JWT/API Keys**: Simple authentication mechanisms

### DevOps & Infrastructure

- **Docker**: Containerization platform
- **Docker Compose**: Multi-container Docker applications
- **GitHub Actions**: CI/CD pipeline
- **Nginx**: (Optional) Reverse proxy/load balancer

### Testing

- **Jest**: Testing framework
- **Supertest**: HTTP assertion library

## Development Setup

### Local Environment Requirements

- Docker and Docker Compose
- Node.js (for local development outside Docker)
- Git
- Browserbase account (free tier available)

### Environment Variables

```
# API Configuration
PORT=3000
NODE_ENV=development|production
LOG_LEVEL=info|debug|error

# Browserbase Configuration
BROWSERBASE_API_KEY=your_browserbase_key

# Authentication
API_KEYS=key1,key2,key3
```

### Docker Configuration

- **Backend Container**: Node.js application with Express
- **Shared Network**: For communication with future services
- **Volumes**: For configuration and logs persistence

## Technical Constraints

### Browserbase Limitations

- Maximum of 3 concurrent browser sessions
- Potential timeout issues for long-running scrapes
- Rate limiting on the free tier

### Puppeteer Challenges

- Dealing with dynamic content loading
- Handling changing CSS selectors
- Managing browser resource usage

### Infrastructure Considerations

- Memory usage of browser instances
- CPU requirements for parallel scraping
- Network bandwidth for transferring page content

### Security Concerns

- Secure storage of API keys
- Protection against injection attacks
- Rate limiting to prevent abuse
- Sanitization of user inputs

## Development Workflow

1. **Local Development**:

   ```bash
   # Clone repository
   git clone <repository-url>

   # Start Docker container
   docker-compose up -d

   # Install dependencies (for local development)
   npm install

   # Run in development mode
   npm run dev
   ```

2. **Testing**:

   ```bash
   # Run tests
   npm test

   # Run specific test suite
   npm test -- --testPathPattern=auth
   ```

3. **Deployment**:
   - Push to GitHub repository
   - GitHub Actions automatically build and deploy
   - Environment variables configured in CI/CD pipeline

## Monitoring and Maintenance

- Winston logging for application monitoring
- Health check endpoints
- Container resource usage monitoring

## Future Extensions (Post-MVP)

- PostgreSQL database for persistent storage
- Advanced user management and authentication
- Caching mechanisms for improved performance
- Horizontal scaling with load balancing

## API Endpoints Documentation

### Crypto Mining Data Endpoint

**Endpoint:** `POST /crypto`

**Description:** Scrapes crypto mining profitability data from asicminervalue.com for a specific ASIC miner, using a configurable electricity cost parameter.

**Authentication:** Requires API key in the `X-API-Key` header.

**Request Parameters:**

```json
{
  "electricityCost": "0.05" // Optional - Cost of electricity in USD per kWh
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/crypto \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"electricityCost": "0.05"}'
```

**Example Response:**

```json
{
  "success": true,
  "content": "Antminer L9 (17Gh) profitability... [content truncated for brevity]",
  "timestamp": "2025-03-21T10:41:03.642Z",
  "parameters": {
    "electricityCost": "0.05"
  }
}
```

**Default Parameter:**

If no `electricityCost` is provided, the API uses a default value of `0.0675`.

**Error Handling:**

- 400 Bad Request: Invalid parameter format
- 401 Unauthorized: Invalid or missing API key
- 500 Internal Server Error: Scraping or processing failed

**Implementation Details:**

- Uses Puppeteer through Browserbase to load the webpage
- Automates form interaction to update electricity cost
- Waits for page calculations to update after input
- Extracts the updated page content
- Supports automatic fallback to mock browser for development

### Text Extraction Endpoint

**Endpoint:** `POST /text`

**Description:** Extracts readable content from a web page, similar to browser reader mode. Uses Mozilla's Readability library to parse HTML and extract the main content, title, and other metadata.

**Authentication:** Requires API key in the `X-API-Key` header.

**Request Parameters:**

```json
{
  "url": "https://example.com/article", // Required - URL to extract text from
  "includeHtml": false // Optional - Include HTML content in response
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"url": "https://example.com/article"}'
```

**Example Response:**

```json
{
  "success": true,
  "url": "https://example.com/article",
  "title": "Example Domain",
  "byline": "Author Name",
  "content": "This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.",
  "timestamp": "2025-03-21T10:56:15.562Z",
  "length": 191,
  "excerpt": "This domain is for use in illustrative examples..."
}
```

**With HTML Content:**

When `includeHtml` is set to `true`, the response includes an additional `contentHtml` field:

```json
{
  "success": true,
  "url": "https://example.com",
  "title": "Example Domain",
  "content": "This domain is for use in illustrative examples...",
  "contentHtml": "<div><p>This domain is for use in illustrative examples...</p></div>",
  "timestamp": "2025-03-21T10:57:07.719Z",
  "length": 191,
  "excerpt": "This domain is for use in illustrative examples..."
}
```

**Error Handling:**

- 400 Bad Request: Invalid URL or missing required parameters
- 401 Unauthorized: Invalid or missing API key
- 500 Internal Server Error: Scraping or processing failed

**Implementation Details:**

- Uses Puppeteer through Browserbase to load the webpage
- Applies Mozilla's Readability algorithm to extract content
- Supports automatic fallback to mock browser for development
- Validates URL format before processing
- Includes content length and excerpt for preview purposes
