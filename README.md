# Customer Spending Insights Dashboard

Responsive React and TypeScript dashboard for exploring customer spending insights. It displays illustrative sample data in South African rand; it does not connect to a banking service or make financial decisions.

## Run locally

Requirements: Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Vite prints the development URL. Create a production bundle with `npm run build`; `npm run preview` serves that bundle locally.

## Docker

```sh
docker build -t customer-spending-insights-dashboard .
docker run --rm -p 8080:8080 customer-spending-insights-dashboard
```

Open http://localhost:8080. Nginx serves the optimized static build on port 8080.

## Quality checks

```sh
npm run build
npm run lint
npm run test
```

Run tests in watch mode while developing with `npm run test:watch`. The interaction tests use Vitest, Testing Library, and jsdom; they cover period changes, transaction search and filtering, pagination, loading and retry states, chart empty states, and keyboard dismissal of mobile navigation.

## Project structure

```text
src/
├── features/spending/
│   ├── api/           # Typed API boundary and local mock responses
│   ├── components/   # Dashboard shell, cards, chart, and transaction UI
│   ├── pages/        # Dashboard page and query orchestration
│   └── types.ts      # API response and domain types
├── App.tsx            # Application entry
└── index.css          # Global styles and design tokens
```

## Data and API boundary

The supplied endpoint contract informed the TypeScript response types and request paths in `src/features/spending/api/spendingApi.ts`. The profile and 30-day summary/category values follow its examples. Those examples do not include complete datasets for every period, so the 7-day, 90-day, and 1-year responses, monthly trend history, and additional transaction rows are illustrative mock fixtures. All displayed amounts are ZAR.

With no `VITE_API_URL` configured, the app uses those local fixtures and a short simulated network delay. To connect an API, set `VITE_API_URL` to its base URL; the client then requests the documented `/api/customers/...` endpoints. The demo fixtures are not live customer or bank data.

## Features

- Summary metrics, category breakdown, monthly spending trends, and recent transactions
- Period-aware summary, category, and transaction views
- Responsive navigation with keyboard dismissal and active-section announcements
- Accessible loading, retryable error, and chart empty states
- Transaction search, category filtering, and pagination over loaded results
- Typed API boundary with local mock data or an optional API base URL
