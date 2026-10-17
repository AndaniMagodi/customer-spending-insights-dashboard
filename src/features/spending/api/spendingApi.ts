import type {
  CategoriesResponse,
  SpendingPeriod,
  SpendingSummary,
  TransactionsResponse,
  TrendsResponse,
} from '../types'

const customerId = '12345'
const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const summary: SpendingSummary = {
  period: '30d',
  totalSpent: 4250.75,
  transactionCount: 47,
  averageTransaction: 90.44,
  topCategory: 'Groceries',
  comparedToPrevious: { spentChange: 12.5, transactionChange: -3.2 },
}

const categories: CategoriesResponse = {
  dateRange: { startDate: '2026-09-17', endDate: '2026-10-17' },
  totalAmount: 4250.75,
  categories: [
    { name: 'Groceries', amount: 1250.3, percentage: 29.4, transactionCount: 15, color: '#087e69', icon: 'shopping-cart' },
    { name: 'Entertainment', amount: 890.2, percentage: 20.9, transactionCount: 8, color: '#3b9c83', icon: 'film' },
    { name: 'Transportation', amount: 680.45, percentage: 16, transactionCount: 12, color: '#73bba7', icon: 'car' },
    { name: 'Dining', amount: 520.3, percentage: 12.2, transactionCount: 9, color: '#a5d2c4', icon: 'utensils' },
    { name: 'Shopping', amount: 450.8, percentage: 10.6, transactionCount: 6, color: '#c3e1d7', icon: 'shopping-bag' },
    { name: 'Utilities', amount: 458.7, percentage: 10.8, transactionCount: 3, color: '#d9ece5', icon: 'zap' },
  ],
}

const trends: TrendsResponse = {
  trends: [
    { month: '2026-05', totalSpent: 3890.25, transactionCount: 42, averageTransaction: 92.62 },
    { month: '2026-06', totalSpent: 4150.8, transactionCount: 38, averageTransaction: 109.23 },
    { month: '2026-07', totalSpent: 3750.6, transactionCount: 45, averageTransaction: 83.35 },
    { month: '2026-08', totalSpent: 4200.45, transactionCount: 39, averageTransaction: 107.7 },
    { month: '2026-09', totalSpent: 3980.3, transactionCount: 44, averageTransaction: 90.46 },
    { month: '2026-10', totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 },
  ],
}

const transactions: TransactionsResponse = {
  transactions: [
    { id: 'txn_123456', date: '2026-10-16T14:30:00Z', merchant: 'Pick n Pay', category: 'Groceries', amount: 245.8, description: 'Weekly groceries', paymentMethod: 'Credit Card', icon: 'shopping-cart', categoryColor: '#087e69' },
    { id: 'txn_123457', date: '2026-10-15T10:15:00Z', merchant: 'Netflix', category: 'Entertainment', amount: 199, description: 'Monthly subscription', paymentMethod: 'Debit Order', icon: 'film', categoryColor: '#3b9c83' },
    { id: 'txn_123458', date: '2026-10-14T17:40:00Z', merchant: 'Shell', category: 'Transportation', amount: 620, description: 'Fuel', paymentMethod: 'Credit Card', icon: 'car', categoryColor: '#73bba7' },
    { id: 'txn_123459', date: '2026-10-13T12:05:00Z', merchant: 'Woolworths', category: 'Groceries', amount: 384.5, description: 'Household shopping', paymentMethod: 'Credit Card', icon: 'shopping-cart', categoryColor: '#087e69' },
    { id: 'txn_123460', date: '2026-10-12T08:25:00Z', merchant: 'vida e caffè', category: 'Dining', amount: 78, description: 'Coffee', paymentMethod: 'Credit Card', icon: 'utensils', categoryColor: '#a5d2c4' },
  ],
  pagination: { total: 1250, limit: 5, offset: 0, hasMore: true },
}

async function getJson<T>(path: string, mockResponse: T): Promise<T> {
  await wait(300)
  if (!apiBaseUrl) return structuredClone(mockResponse)

  const response = await fetch(`${apiBaseUrl}${path}`)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json() as Promise<T>
}

export function getSpendingSummary(period: SpendingPeriod) {
  const query = new URLSearchParams({ period })
  return getJson<SpendingSummary>(
    `/api/customers/${customerId}/spending/summary?${query}`,
    { ...summary, period },
  )
}

export function getSpendingCategories(period: SpendingPeriod) {
  const query = new URLSearchParams({ period })
  return getJson<CategoriesResponse>(
    `/api/customers/${customerId}/spending/categories?${query}`,
    categories,
  )
}

export function getSpendingTrends(months = 6) {
  const query = new URLSearchParams({ months: String(months) })
  return getJson<TrendsResponse>(
    `/api/customers/${customerId}/spending/trends?${query}`,
    trends,
  )
}

export function getRecentTransactions(limit = 5) {
  const query = new URLSearchParams({ limit: String(limit), offset: '0', sortBy: 'date_desc' })
  return getJson<TransactionsResponse>(
    `/api/customers/${customerId}/transactions?${query}`,
    transactions,
  )
}
