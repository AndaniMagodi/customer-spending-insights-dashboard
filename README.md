# Customer Spending Insights Dashboard

**Live demo:** [andanimagodi.github.io/customer-spending-insights-dashboard](https://andanimagodi.github.io/customer-spending-insights-dashboard/)

Responsive React and TypeScript dashboard for exploring customer spending insights. It displays illustrative sample data in South African rand; it does not connect to a banking service or make financial decisions.

## Screenshots

![Spending dashboard with the updated design, charts, transactions, and active filter controls](docs/screenshots/dashboard-desktop.jpg)

## Run locally

Requirements: Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

The local config at `public/config.json` enables the MSW demo API by default. To connect to a real API during local development, set `apiUrl` to its base URL and `mockApi` to `false` in that file. Vite serves the file at runtime, so no rebuild is needed after changing it.

The dashboard is available at http://localhost:5173 after starting Vite. The same production image can be previewed locally on port 8080 with Docker.

GitHub Pages deploys from `main` only after the CI workflow passes linting, tests, build, dependency audit, and Docker smoke checks.

## Docker

```sh
docker build -t customer-spending-insights-dashboard .
docker run --rm -p 8080:8080 customer-spending-insights-dashboard
```

Open http://localhost:8080. The container runs Nginx as an unprivileged user on port 8080. It uses the mock API when no API URL is supplied. To point the same image at a real API, set the runtime environment variable:

```sh
docker run --rm -p 8080:8080 \
  -e VITE_API_URL=https://api.example.com \
  customer-spending-insights-dashboard
```

The container entrypoint writes `config.json` when the container starts, so the API URL is not baked into the image. Use an API origin allowed by your API's CORS policy.

## Quality checks

```sh
npm run lint
npm run test
npm run build
npm audit --audit-level=high
```

The GitHub Actions workflow runs lint, tests, build, dependency audit, Docker build, and a container HTTP smoke test. It publishes to GitHub Pages only after every quality check succeeds.

## Project structure

```text
src/
├── features/spending/
│   ├── api/           # Zod API schemas and typed fetch client
│   ├── components/    # Dashboard shell, cards, charts, and transaction UI
│   ├── mocks/         # MSW handlers, fixtures, browser worker, and test server
│   ├── pages/         # Dashboard page and query orchestration
│   └── types.ts       # Domain types derived from the API schemas
├── lib/format.ts      # Shared locale-aware formatters
├── appConfig.ts       # Runtime configuration loader and validation
└── index.css          # Global styles and design tokens
```

## Sample data and API

The dashboard follows the seven endpoints in the supplied API examples: profile, spending summary, categories, monthly trends, transactions, budget goals, and filters. The app checks API responses before displaying them.

By default, the app uses a mock API: sample responses that let you run the dashboard without a real banking service. Those examples are based on the supplied API descriptions, but most spending amounts, charts, goals, and transactions are illustrative. The transaction rows are only a sample, so their count will not necessarily match the totals shown elsewhere. Amounts are shown in South African rand (ZAR).

The filters work together: you can search and narrow transactions by date, category, or amount, then sort the results. The supplied API description does not include search or amount filters, so this demo adds those to its mock API. A real API would need to support them too. When you choose custom dates, the summary, category chart, and transactions use that range. Monthly trends and goals continue to show their own monthly data.

To connect a real API, set `apiUrl` to its address and set `mockApi` to `false` in `public/config.json`. The API needs to provide the data listed above and support search and amount filters if you want those filters to work with real data.

## Security and deployment notes

The Nginx container uses a non-root user, gzip compression, and security headers including a restrictive Content Security Policy with `frame-ancestors 'none'`. Its `connect-src` policy allows only the app origin and, when configured, the API origin derived from `VITE_API_URL`. The API URL is public client configuration; never put credentials or secrets in it.

## Features

- Period-aware summary metrics, category breakdown, spending trends, and recent transactions
- Average daily spending, top category amount and share, and biggest monthly movement insights
- Responsive navigation and transaction table with desktop and mobile row details
- Accessible loading, section-level error and retry, empty, and reduced-motion states
- Composable transaction search, category, amount, and date filters with server pagination and sorting
- Lazy-loaded charts, validated API responses, cancellable requests, and runtime API configuration

## AI assistance

I used AI tools during development for brainstorming, implementation support, and troubleshooting. I reviewed and adapted the suggestions, and I’m prepared to explain the code and decisions.
