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
