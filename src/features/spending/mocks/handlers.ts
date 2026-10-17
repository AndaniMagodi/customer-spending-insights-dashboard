import { http, HttpResponse } from 'msw'
import { availableFilters, categoriesByPeriod, customerId, customerProfile, spendingGoals, summaryFixtures, transactions, trends } from './fixtures'
import type { SpendingPeriod, Transaction, TransactionSortBy } from '../types'
import { getPeriodDateRange } from '../../../lib/dateRanges'

const compareTransactions = (a: Transaction, b: Transaction, sortBy: TransactionSortBy) => {
  switch (sortBy) {
    case 'date_asc': return Date.parse(a.date) - Date.parse(b.date)
    case 'amount_desc': return b.amount - a.amount
    case 'amount_asc': return a.amount - b.amount
    case 'date_desc': return Date.parse(b.date) - Date.parse(a.date)
  }
}

const resolvePeriod = (value: string | null): SpendingPeriod =>
  value === '7d' || value === '90d' || value === '1y' ? value : '30d'

export const handlers = [
  http.get('*/api/customers/:id/profile', ({ params }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    return HttpResponse.json(customerProfile)
  }),
  http.get('*/api/customers/:id/spending/summary', ({ params, request }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    const period = resolvePeriod(new URL(request.url).searchParams.get('period'))
    return HttpResponse.json(summaryFixtures[period])
  }),
  http.get('*/api/customers/:id/spending/categories', ({ params, request }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    const query = new URL(request.url).searchParams
    const period = resolvePeriod(query.get('period'))
    const startDate = query.get('startDate')
    const endDate = query.get('endDate')
    if (startDate && endDate) {
      const matched = transactions.filter((item) => item.date.slice(0, 10) >= startDate && item.date.slice(0, 10) <= endDate)
      const categoryTotals = new Map<string, { amount: number; transactionCount: number }>()
      for (const transaction of matched) {
        const current = categoryTotals.get(transaction.category) ?? { amount: 0, transactionCount: 0 }
        current.amount += transaction.amount
        current.transactionCount += 1
        categoryTotals.set(transaction.category, current)
      }
      const totalAmount = matched.reduce((total, transaction) => total + transaction.amount, 0)
      const categories = availableFilters.categories.flatMap((category) => {
        const totals = categoryTotals.get(category.name)
        return totals ? [{ ...category, ...totals, percentage: totalAmount ? Math.round((totals.amount / totalAmount) * 1000) / 10 : 0 }] : []
      })
      return HttpResponse.json({ dateRange: { startDate, endDate }, totalAmount, categories })
    }
    return HttpResponse.json(categoriesByPeriod[period])
  }),
  http.get('*/api/customers/:id/goals', ({ params }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    return HttpResponse.json({ goals: spendingGoals })
  }),
  http.get('*/api/customers/:id/filters', ({ params }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    return HttpResponse.json(availableFilters)
  }),
  http.get('*/api/customers/:id/spending/trends', ({ params, request }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    const months = Math.max(1, Number(new URL(request.url).searchParams.get('months')) || 6)
    return HttpResponse.json({ trends: trends.trends.slice(-months) })
  }),
  http.get('*/api/customers/:id/transactions', ({ params, request }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    const query = new URL(request.url).searchParams
    const range = getPeriodDateRange('30d')
    const startDate = query.get('startDate') || range.startDate
    const endDate = query.get('endDate') || range.endDate
    const category = query.get('category')
    const limit = Math.max(1, Number(query.get('limit')) || 10)
    const offset = Math.max(0, Number(query.get('offset')) || 0)
    const requestedSort = query.get('sortBy')
    const sortBy: TransactionSortBy = requestedSort === 'date_asc' || requestedSort === 'amount_desc' || requestedSort === 'amount_asc' ? requestedSort : 'date_desc'
    const filtered = transactions
      .filter((item) => {
        const date = item.date.slice(0, 10)
        return date >= startDate && date <= endDate && (!category || item.category === category)
      })
      .sort((a, b) => compareTransactions(a, b, sortBy))
    return HttpResponse.json({
      transactions: filtered.slice(offset, offset + limit),
      pagination: { total: filtered.length, limit, offset, hasMore: offset + limit < filtered.length },
    })
  }),
]
