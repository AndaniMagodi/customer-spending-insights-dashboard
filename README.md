# Customer Spending Insights Dashboard

Responsive React and TypeScript dashboard scaffold for the customer spending insights assessment. It displays illustrative sample data in South African rand; it does not connect to a banking service or make financial decisions.

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
```

## Project structure

- `src/App.tsx` — dashboard page and assessment sample data
- `src/App.css` — responsive dashboard styles
- `src/index.css` — global styles and design tokens
- `Dockerfile` and `nginx.conf` — production image and static-file server

## Engineering reference

The project takes architectural cues from [Andani's Smart Parking System](https://github.com/AndaniMagodi/smart-parking-system): keep domain logic and UI concerns in clear boundaries, use explicit data types, document design choices, and include container and quality-check workflows. This dashboard is a frontend assessment with mocked data, so those ideas are adapted to a typed mock-data/API boundary rather than copying the parking app's backend or deployment setup.

## Assessment notes

The initial screen includes summary metrics, category breakdown, monthly trend, and recent transactions. The supplied endpoint brief can guide mock-data types and filter behaviour as development continues. Replace illustrative figures with a clearly identified, internally consistent demo dataset before final submission.
