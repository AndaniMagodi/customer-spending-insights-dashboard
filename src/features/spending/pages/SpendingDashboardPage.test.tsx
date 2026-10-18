import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SpendingDashboardPage } from './SpendingDashboardPage'
import {
  getCustomerProfile,
  getRecentTransactions,
  getSpendingCategories,
  getSpendingFilters,
  getSpendingGoals,
  getSpendingSummary,
  getSpendingTrends,
} from '../api/spendingApi'
import type {
  CategoriesResponse,
  CustomerProfile,
  SpendingPeriod,
  SpendingSummary,
  TransactionsResponse,
  TrendsResponse,
} from '../types'

vi.mock('../api/spendingApi', () => ({
  getCustomerProfile: vi.fn(),
  getRecentTransactions: vi.fn(),
  getSpendingCategories: vi.fn(),
  getSpendingFilters: vi.fn(),
  getSpendingGoals: vi.fn(),
  getSpendingSummary: vi.fn(),
  getSpendingTrends: vi.fn(),
}))

const profile: CustomerProfile = {
  customerId: 'customer-1',
  name: 'John Doe',
  email: 'john@example.com',
  joinDate: '2023-01-15',
  accountType: 'premium',
  totalSpent: 15420.5,
  currency: 'ZAR',
}

const categories: CategoriesResponse = {
  dateRange: { startDate: '2026-09-17', endDate: '2026-10-17' },
  totalAmount: 4250.75,
  categories: [{ name: 'Groceries', amount: 1250.3, percentage: 29.4, transactionCount: 15, color: '#087e69', icon: 'shopping-cart' }],
}
const filters = {
  categories: [{ name: 'Groceries', color: '#087e69', icon: 'shopping-cart' }],
  dateRangePresets: [
    { label: 'Last 7 days', value: '7d' as const },
    { label: 'Last 30 days', value: '30d' as const },
    { label: 'Last 90 days', value: '90d' as const },
    { label: 'Last year', value: '1y' as const },
  ],
}

const trends: TrendsResponse = {
  trends: [
    { month: '2026-09', totalSpent: 3980.3, transactionCount: 44, averageTransaction: 90.46 },
    { month: '2026-10', totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 },
  ],
}

const transactions: TransactionsResponse = {
  transactions: [{
    id: 'txn-1', date: '2026-10-16T14:30:00Z', merchant: 'Pick n Pay', category: 'Groceries', amount: 245.8,
    description: 'Weekly groceries', paymentMethod: 'Credit Card', icon: 'shopping-cart', categoryColor: '#087e69',
  }],
  pagination: { total: 1, limit: 100, offset: 0, hasMore: false },
}

const createSummary = (period: SpendingPeriod): SpendingSummary => ({
  period,
  totalSpent: period === '7d' ? 1120.35 : 4250.75,
  transactionCount: period === '7d' ? 13 : 47,
  averageTransaction: period === '7d' ? 86.18 : 90.44,
  topCategory: 'Groceries',
  comparedToPrevious: { spentChange: 12.5, transactionChange: -3.2 },
})

function renderDashboard() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false, staleTime: 0 } },
  })
  return render(<QueryClientProvider client={client}><SpendingDashboardPage /></QueryClientProvider>)
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getCustomerProfile).mockResolvedValue(profile)
  vi.mocked(getSpendingSummary).mockImplementation(async (period) => createSummary(period))
  vi.mocked(getSpendingCategories).mockResolvedValue(categories)
  vi.mocked(getSpendingFilters).mockResolvedValue(filters)
  vi.mocked(getSpendingGoals).mockResolvedValue({ goals: [] })
  vi.mocked(getSpendingTrends).mockResolvedValue(trends)
  vi.mocked(getRecentTransactions).mockResolvedValue(transactions)
})

describe('SpendingDashboardPage', () => {
  it('announces loading state while data is pending', async () => {
    let resolveProfile: ((value: CustomerProfile) => void) | undefined
    vi.mocked(getCustomerProfile).mockImplementation(() => new Promise((resolve) => { resolveProfile = resolve }))
    renderDashboard()

    expect(screen.getByRole('status', { name: 'Loading spending summary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true')

    resolveProfile?.(profile)
    await screen.findByRole('heading', { name: 'Spending overview' })
    await waitFor(() => expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'false'))
  })

  it('refreshes period-dependent data when the customer changes the period', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await screen.findByText('Pick n Pay')

    await user.selectOptions(screen.getByRole('combobox', { name: 'Spending period' }), '7d')

    await waitFor(() => {
      expect(getSpendingSummary).toHaveBeenLastCalledWith('7d', expect.any(AbortSignal))
      expect(getSpendingCategories).toHaveBeenLastCalledWith('7d', {}, expect.any(AbortSignal))
      expect(getRecentTransactions).toHaveBeenLastCalledWith('7d', expect.objectContaining({ limit: 5, offset: 0, sortBy: 'date_desc' }), expect.any(AbortSignal))
    })
  })

  it('sends category, custom dates, and sort order to the transaction endpoint client', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await screen.findByText('Pick n Pay')

    await user.selectOptions(screen.getByRole('combobox', { name: /filter by transaction category/i }), 'Groceries')
    await waitFor(() => expect(getRecentTransactions).toHaveBeenLastCalledWith('30d', expect.objectContaining({ category: 'Groceries' }), expect.any(AbortSignal)))

    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort transactions' }), 'amount_desc')
    await waitFor(() => expect(getRecentTransactions).toHaveBeenLastCalledWith('30d', expect.objectContaining({ category: 'Groceries', sortBy: 'amount_desc' }), expect.any(AbortSignal)))

    await user.type(screen.getByLabelText('From'), '2026-10-01')
    await user.type(screen.getByLabelText('To'), '2026-10-15')
    await user.click(screen.getByRole('button', { name: 'Apply dates' }))

    await waitFor(() => expect(getRecentTransactions).toHaveBeenLastCalledWith('30d', expect.objectContaining({
      category: 'Groceries',
      startDate: '2026-10-01',
      endDate: '2026-10-15',
      sortBy: 'amount_desc',
    }), expect.any(AbortSignal)))
  })

  it('keeps the dashboard and transaction search mounted while filters refresh', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await screen.findByText('Pick n Pay')

    const search = screen.getByRole('searchbox', { name: /search all transactions/i })
    await user.type(search, 'Pick')
    await user.selectOptions(screen.getByRole('combobox', { name: /filter by transaction category/i }), 'Groceries')

    expect(screen.getByRole('heading', { name: 'Spending overview' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: /search all transactions/i })).toHaveValue('Pick')
  })

  it('shows an error and retries failed data requests', async () => {
    const user = userEvent.setup()
    vi.mocked(getSpendingSummary)
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValue(createSummary('30d'))
    renderDashboard()

    expect(await screen.findByRole('alert', { name: 'Spending summary' })).toHaveTextContent('Network unavailable')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    await screen.findByText('Pick n Pay')
    expect(screen.queryByRole('alert', { name: 'Spending summary' })).not.toBeInTheDocument()
  })
})
