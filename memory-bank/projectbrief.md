# Project Brief: Puppeteer Scraper API

## Project Scope

Create a scalable, dockerized web scraping API service that:

1. Uses Puppeteer scripts to extract data from websites
2. Exposes these scripts as API endpoints
3. Handles authentication, request parameters, and secure deployment
4. Utilizes Browserbase for enhanced scraping capabilities

## Core Requirements

1. **Architecture**

   - Node.js backend with Express
   - Docker containerization (single backend service for MVP)
   - Puppeteer-core with Browserbase integration

2. **API Features**

   - Endpoints for different scraping tasks ("/crypto", "/text", etc.)
   - Dynamic parameter handling from request body
   - Simple authentication mechanism with API keys (file-based for MVP)
   - JSON response format with scraped data

3. **Deployment & CI/CD**

   - Automated deployment via GitHub Actions
   - Secure handling of API keys and sensitive information
   - Containerized environment for consistent operation

4. **Scalability Considerations**
   - Handling of concurrent browser sessions (max 3 for Browserbase)
   - Modular design to easily add new scraping endpoints

## Initial Implementation

1. Set up the "/crypto" endpoint:

   - Adapting provided script to work with Browserbase
   - Making "electricityCost" a dynamic input parameter
   - Returning content data in structured format

2. Create the "/text" endpoint:
   - Taking URL as input parameter
   - Extracting readable text content (similar to browser reading mode)
   - Consider using Mozilla's Readability library

## Constraints

- Handling bot detection/blocking by target websites
- Managing timeouts in scraping operations
- Dealing with changing CSS selectors in target sites
- Browserbase limit of 3 concurrent browser sessions

## Success Criteria

- Working API endpoints that can be called via POST requests
- Secure authentication mechanism
- Clean, modular codebase that can be extended
- Automated deployment pipeline
- Comprehensive documentation and testing

## Future Enhancements (Post-MVP)

- Add database (PostgreSQL) for storing API keys and usage metrics
- Implement caching mechanism for frequently requested content
- Add more advanced authentication and user management
