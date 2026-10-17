import { describe, expect, it } from 'vitest'
import { getRecentTransactions, getSpendingCategories, getSpendingSummary } from './spendingApi'
import type { SpendingPeriod } from '../types'

describe('spending mock fixtures', () => {
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
    const [dateFiltered, amountSorted] = await Promise.all([
      getRecentTransactions('30d', {
        category: 'Dining',
        startDate: '2026-10-01',
        endDate: '2026-10-15',
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
