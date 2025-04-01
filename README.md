# Startpage backend

Backend for [startpage-frontend](https://github.com/sarkiisov/startpage-frontend) handles favicon fetching via web scraping and caches icons for optimized performance.

## Icon retrieval

- Extracts Apple touch icons from HTML.

- Pulls icons from Apple App Store.

- Pulls icons from Google Play Store.

## Installation & usage

1. Install pnpm (package manager)

   https://pnpm.io/installation

2. Setup enviromental variables (follow .env.example)

3. Build static assets for Chrome Extension

   ```sh
   pnpm install
   pnpm start
   ```

## Stack

Express, TypeScript, SQLite3, HTMLParser2, JSdom
