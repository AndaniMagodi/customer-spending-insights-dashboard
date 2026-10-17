import {
  CategoriesResponseSchema,
  CustomerProfileSchema,
  SpendingSummarySchema,
  TransactionSortBySchema,
  TransactionsResponseSchema,
  TrendsResponseSchema,
} from './schemas'
import type { SpendingPeriod, TransactionQueryOptions } from '../types'

const customerId = '12345'
const getApiBaseUrl = () => window.__APP_CONFIG__?.apiUrl.replace(/\/$/, '') ?? ''
const defaultDateRanges: Record<SpendingPeriod, { startDate: string; endDate: string }> = {
  '7d': { startDate: '2026-10-10', endDate: '2026-10-17' },
  '30d': { startDate: '2026-09-17', endDate: '2026-10-17' },
  '90d': { startDate: '2026-07-19', endDate: '2026-10-17' },
  '1y': { startDate: '2025-10-17', endDate: '2026-10-17' },
}

async function getJson<T>(path: string, schema: { parse: (value: unknown) => T }, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return schema.parse(await response.json())
}

export function getCustomerProfile(signal?: AbortSignal) {
  return getJson(`/api/customers/${customerId}/profile`, CustomerProfileSchema, signal)
}

export function getSpendingSummary(period: SpendingPeriod, signal?: AbortSignal) {
  const query = new URLSearchParams({ period })
  return getJson(`/api/customers/${customerId}/spending/summary?${query}`, SpendingSummarySchema, signal)
}

export function getSpendingCategories(period: SpendingPeriod, signal?: AbortSignal) {
  const query = new URLSearchParams({ period })
  return getJson(`/api/customers/${customerId}/spending/categories?${query}`, CategoriesResponseSchema, signal)
}

export function getSpendingTrends(months = 6, signal?: AbortSignal) {
  const query = new URLSearchParams({ months: String(months) })
  return getJson(`/api/customers/${customerId}/spending/trends?${query}`, TrendsResponseSchema, signal)
}

export function getRecentTransactions(period: SpendingPeriod, options: TransactionQueryOptions = {}, signal?: AbortSignal) {
  const { limit = 20, offset = 0, category, sortBy = 'date_desc' } = options
  const range = defaultDateRanges[period]
  const query = new URLSearchParams({
    limit: String(Math.min(100, Math.max(1, limit))),
    offset: String(Math.max(0, offset)),
    sortBy: TransactionSortBySchema.parse(sortBy),
    startDate: options.startDate || range.startDate,
    endDate: options.endDate || range.endDate,
  })
  if (category) query.set('category', category)
  return getJson(`/api/customers/${customerId}/transactions?${query}`, TransactionsResponseSchema, signal)
}
