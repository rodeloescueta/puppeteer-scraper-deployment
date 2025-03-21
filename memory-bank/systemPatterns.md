# System Patterns: Puppeteer Scraper API

## System Architecture

The system follows a containerized architecture with these main components:

```
┌────────────────────────────────────────┐
│          Docker Environment             │
│ ┌──────────────┐                        │
│ │              │                        │
│ │  API Server  │                        │
│ │  (Node.js)   │                        │
│ │              │                        │
│ └──────┬───────┘                        │
│        │                                │
└────────┼────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│                 │
│   Browserbase   │
│   (External)    │
│                 │
└─────────────────┘
```

### Component Relationships

1. **API Server**:

   - Handles incoming HTTP requests
   - Manages authentication and request validation
   - Orchestrates Puppeteer scripts execution
   - Formats and returns responses

2. **Browserbase Integration**:
   - External service that provides remote browser instances
   - Handles proxies and anti-bot measures
   - Limited to 3 concurrent sessions

## Key Technical Decisions

1. **Express.js Framework**:

   - Chosen for its simplicity and flexibility in creating RESTful APIs
   - Well-documented and widely used in the Node.js ecosystem
   - Easy to extend with middleware for authentication, logging, etc.

2. **Puppeteer-Core with Browserbase**:

   - Using puppeteer-core instead of full Puppeteer for smaller footprint
   - Browserbase integration to handle complex scraping scenarios
   - Managed browser instances to avoid deployment issues

3. **Docker Containerization**:

   - Ensures consistent environment across development and production
   - Simplifies deployment and scaling
   - Single container for API server in the MVP phase

4. **File-Based Configuration**:

   - Simple JSON or environmental variables for configuration
   - Secure API key storage via environment variables
   - Easy to deploy and configure

5. **GitHub Actions for CI/CD**:
   - Automated testing and deployment
   - Triggered by code changes
   - Secure handling of environment variables and secrets

## Design Patterns

1. **Middleware Pattern**:

   - Express middleware for cross-cutting concerns
   - Authentication, logging, error handling as middleware components
   - Promotes code reuse and separation of concerns

2. **Factory Pattern**:

   - Browser factory to manage Browserbase connections
   - Scraper factory to create appropriate scraper instances
   - Promotes consistent object creation and resource management

3. **Strategy Pattern**:

   - Different scraping strategies for different websites
   - Common interface for all scrapers
   - Makes it easy to add new scraping endpoints

4. **Rate Limiting Pattern**:

   - Manage concurrent requests to stay within Browserbase limits
   - Queue requests when limit is reached
   - Prioritize certain requests if needed

5. **Circuit Breaker Pattern**:

   - Prevent cascading failures when external services are unavailable
   - Gracefully handle timeouts and errors
   - Automatic retry mechanisms with exponential backoff

6. **Configuration Management**:
   - Environment-based configuration
   - Secure storage of secrets and API keys
   - Runtime configuration options where appropriate

## Future Architecture (Post-MVP)

For future phases, the system could be extended to include:

```
┌────────────────────────────────────────────────┐
│                Docker Environment               │
│ ┌──────────────┐         ┌──────────────────┐  │
│ │              │         │                  │  │
│ │  API Server  │◄────────┤  PostgreSQL DB   │  │
│ │  (Node.js)   │         │                  │  │
│ │              │         │                  │  │
│ └──────┬───────┘         └──────────────────┘  │
│        │                                        │
└────────┼────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│                 │
│   Browserbase   │
│   (External)    │
│                 │
└─────────────────┘
```

Adding a database would enable:

- Persistent storage of API keys and user information
- Logging of request metrics and usage statistics
- Caching of scraping results to improve performance
- More sophisticated authentication and authorization
