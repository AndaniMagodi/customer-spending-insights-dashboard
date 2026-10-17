import {
  CategoriesResponseSchema,
  CustomerProfileSchema,
  FiltersResponseSchema,
  GoalsResponseSchema,
  SpendingSummarySchema,
  TransactionSortBySchema,
  TransactionsResponseSchema,
  TrendsResponseSchema,
} from './schemas'
import type { SpendingPeriod, TransactionQueryOptions } from '../types'
import { getPeriodDateRange } from '../../../lib/dateRanges'

const customerId = '12345'
const getApiBaseUrl = () => window.__APP_CONFIG__?.apiUrl.replace(/\/$/, '') ?? ''
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

export function getSpendingCategories(period: SpendingPeriod, dateRange: Pick<TransactionQueryOptions, 'startDate' | 'endDate'> = {}, signal?: AbortSignal) {
  const query = new URLSearchParams({ period })
  if (dateRange.startDate) query.set('startDate', dateRange.startDate)
  if (dateRange.endDate) query.set('endDate', dateRange.endDate)
  return getJson(`/api/customers/${customerId}/spending/categories?${query}`, CategoriesResponseSchema, signal)
}

export function getSpendingGoals(signal?: AbortSignal) {
  return getJson(`/api/customers/${customerId}/goals`, GoalsResponseSchema, signal)
}

export function getSpendingFilters(signal?: AbortSignal) {
  return getJson(`/api/customers/${customerId}/filters`, FiltersResponseSchema, signal)
}

export function getSpendingTrends(months = 6, signal?: AbortSignal) {
  const query = new URLSearchParams({ months: String(months) })
  return getJson(`/api/customers/${customerId}/spending/trends?${query}`, TrendsResponseSchema, signal)
}

export function getRecentTransactions(period: SpendingPeriod, options: TransactionQueryOptions = {}, signal?: AbortSignal) {
  const { limit = 20, offset = 0, category, sortBy = 'date_desc' } = options
  const range = getPeriodDateRange(period)
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
