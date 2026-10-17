import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { getCustomerProfile, getRecentTransactions, getSpendingCategories, getSpendingSummary, resolveApiRequestUrl } from './spendingApi'
import { server } from '../mocks/server'
import type { SpendingPeriod } from '../types'
import { GoalsResponseSchema } from './schemas'

describe('spending API client and mock handlers', () => {
  it('keeps mock requests inside the application scope on subpath deployments', () => {
    expect(resolveApiRequestUrl('/api/customers/12345/profile', '', '/customer-spending-insights-dashboard/'))
      .toBe('/customer-spending-insights-dashboard/api/customers/12345/profile')
    expect(resolveApiRequestUrl('/api/customers/12345/profile', 'https://api.example.com/', '/customer-spending-insights-dashboard/'))
      .toBe('https://api.example.com/api/customers/12345/profile')
  })

  it('derives a safe goal status when the API returns a new status value', () => {
    const result = GoalsResponseSchema.parse({ goals: [
      { id: 'goal-1', category: 'Groceries', monthlyBudget: 1000, currentSpent: 1200, percentageUsed: 120, daysRemaining: 0, status: 'exceeded' },
      { id: 'goal-2', category: 'Dining', monthlyBudget: 1000, currentSpent: 400, percentageUsed: 40, daysRemaining: 8 },
    ] })

    expect(result.goals.map((goal) => goal.status)).toEqual(['warning', 'on_track'])
  })

  it('fetches and validates the customer profile through the mock HTTP handler', async () => {
    await expect(getCustomerProfile()).resolves.toMatchObject({ customerId: '12345', currency: 'ZAR' })
  })

  it('rejects malformed API responses instead of trusting a TypeScript cast', async () => {
    server.use(http.get('*/api/customers/12345/profile', () => HttpResponse.json({ customerId: '12345' })))
    await expect(getCustomerProfile()).rejects.toThrow()
  })

  it('keeps aggregate totals, averages, and category counts internally consistent', async () => {
    const periods: SpendingPeriod[] = ['7d', '30d', '90d', '1y']

    const results = await Promise.all(periods.map(async (period) => {
      const [summary, categoryResponse] = await Promise.all([
        getSpendingSummary(period),
        getSpendingCategories(period),
      ])
      return { summary, categoryResponse }
    }))

    for (const { summary, categoryResponse } of results) {
      const categoryAmount = categoryResponse.categories.reduce((total, item) => total + item.amount, 0)
      const categoryCount = categoryResponse.categories.reduce((total, item) => total + item.transactionCount, 0)
      const categoryPercentage = categoryResponse.categories.reduce((total, item) => total + item.percentage, 0)

      expect(categoryAmount).toBeCloseTo(summary.totalSpent, 2)
      expect(categoryResponse.totalAmount).toBeCloseTo(summary.totalSpent, 2)
      expect(categoryCount).toBe(summary.transactionCount)
      expect(categoryPercentage).toBeCloseTo(100, 0)
      expect(summary.averageTransaction).toBeCloseTo(summary.totalSpent / summary.transactionCount, 2)
    }
  })

  it('applies transaction category/date filters, sort order, and pagination to the mock response', async () => {
    const today = new Date()
    const makeDate = (daysAgo: number) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
    const [dateFiltered, amountSorted] = await Promise.all([
      getRecentTransactions('30d', {
        category: 'Dining',
        startDate: makeDate(3),
        endDate: makeDate(3),
        limit: 100,
      }),
      getRecentTransactions('30d', { sortBy: 'amount_desc', limit: 2 }),
    ])

    expect(dateFiltered.transactions.map((transaction) => transaction.merchant)).toEqual(['Woolworths Food'])
    expect(dateFiltered.pagination.total).toBe(1)
    expect(amountSorted.transactions.map((transaction) => transaction.amount)).toEqual([620, 384.5])
    expect(amountSorted.pagination).toMatchObject({ total: 9, limit: 2, offset: 0, hasMore: true })
  })
})
