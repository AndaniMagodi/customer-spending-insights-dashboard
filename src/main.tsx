import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { loadAppConfig } from './appConfig'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

async function bootstrap() {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Application root element was not found.')
  const root = ReactDOM.createRoot(rootElement)
  try {
    const config = await loadAppConfig()
    window.__APP_CONFIG__ = config
    if (config.mockApi) {
      const { worker } = await import('./features/spending/mocks/browser')
      await worker.start({
        onUnhandledFrame: 'bypass',
        serviceWorker: {
          url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
          options: { scope: import.meta.env.BASE_URL },
        },
      })
    }

    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </React.StrictMode>,
    )
  } catch {
    root.render(
      <main className="mx-auto max-w-lg p-8 text-slate-900">
        <h1 className="text-xl font-semibold">Spending insights is unavailable</h1>
        <p className="mt-2 text-sm text-slate-600">The application configuration could not be loaded. Refresh the page or contact support.</p>
      </main>,
    )
  }
}

void bootstrap()
