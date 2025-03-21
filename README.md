# Puppeteer Scraper API

A dockerized web scraping API service that transforms standalone Puppeteer scripts into accessible API endpoints.

## Documentation

For comprehensive project documentation, please refer to the `memory-bank` directory:

- **Project Brief**: [memory-bank/projectbrief.md](memory-bank/projectbrief.md)
- **Product Context**: [memory-bank/productContext.md](memory-bank/productContext.md)
- **System Patterns**: [memory-bank/systemPatterns.md](memory-bank/systemPatterns.md)
- **Technical Context**: [memory-bank/techContext.md](memory-bank/techContext.md)
- **Active Context**: [memory-bank/activeContext.md](memory-bank/activeContext.md)
- **Progress**: [memory-bank/progress.md](memory-bank/progress.md)

## Quick Start

### Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Node.js 16+ (for local development)
- Browserbase account with API key (can use mock mode for development)

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/rodeloescueta/puppeteer-scraper-deployment.git
   cd puppeteer-scraper-deployment
   ```

2. Create a `.env` file with your configuration:

   ```
   PORT=3000
   NODE_ENV=development
   LOG_LEVEL=info
   USE_MOCK_BROWSER=true  # Set to false to use real Browserbase
   BROWSERBASE_API_KEY=your_browserbase_key  # Only needed if USE_MOCK_BROWSER=false
   API_KEYS=your-api-key-1,your-api-key-2
   ```

3. Start with Docker:

   For production:

   ```bash
   docker-compose up -d
   ```

   For development (with hot-reloading):

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

   Or run locally for development:

   ```bash
   npm install
   npm run dev
   ```

## API Usage

### Authentication

All API endpoints require authentication using an API key. Add your API key to the request header:

```
X-API-Key: your-api-key
```

### Endpoints

#### Health Check

```bash
curl http://localhost:3000/health
```

#### Crypto Mining Data

```bash
curl -X POST http://localhost:3000/crypto \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"electricityCost": "0.05"}'
```

## Development

### Mock Browser Mode

For development without a Browserbase account, you can use the mock browser mode:

1. Set `USE_MOCK_BROWSER=true` in your `.env` file or Docker environment
2. The mock browser will simulate operations without making real web requests
3. This is useful for testing the API structure and flow

### Testing

Run the automated tests:

```bash
npm test
```

### Docker Commands

Build the Docker image:

```bash
docker-compose build
```

Start the containers:

```bash
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f
```

Stop the containers:

```bash
docker-compose down
```

## Deployment

The application is configured for CI/CD deployment to Render using GitHub Actions. Push to the `main` branch to trigger automatic deployment.

### Render Configuration

1. Create a Web Service on Render
2. Connect to your GitHub repository
3. Set the following environment variables:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `USE_MOCK_BROWSER=false` (or `true` for testing)
   - `BROWSERBASE_API_KEY=your_key`
   - `API_KEYS=comma,separated,keys`
4. Create a deploy hook and set it in GitHub Actions secret as `RENDER_DEPLOY_HOOK`

## License

MIT
