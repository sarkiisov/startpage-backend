# Startpage backend

Backend for [startpage-frontend](https://github.com/sarkiisov/startpage-frontend) handles favicon fetching via web scraping and caches icons for optimized performance.

## Icon retrieval

- Extracts Apple touch icons from HTML.

- Pulls icons from Apple App Store.

- Pulls icons from Google Play Store.

## Installation & usage

### Docker

1. Build Docker image

   ```
   docker build -t startpage-backend .
   ```

2. Setup environmental variables (follow .env.example)

3. Start Docker container

   ```
   docker run -d --env-file .env -p <PORT>:<.env PORT> startpage-backend
   ```

   - Replace `<PORT>` with the desired port number for your application.

### Standalone

1. Install pnpm (package manager)

   https://pnpm.io/installation

2. Setup environmental variables (follow .env.example)

3. Build static assets for Chrome Extension

   ```sh
   pnpm install
   pnpm start
   ```

## API Documentation

API documentation is available under `/api-docs` using Swagger UI. You can use it to explore the available endpoints.

## Stack

Express, TypeScript, SQLite3, HTMLParser2, JSdom
