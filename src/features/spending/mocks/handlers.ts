import { http, HttpResponse } from 'msw'
import { categoriesByPeriod, customerId, customerProfile, summaryFixtures, transactions, trends } from './fixtures'
import type { SpendingPeriod, Transaction, TransactionSortBy } from '../types'

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
    const period = resolvePeriod(new URL(request.url).searchParams.get('period'))
    return HttpResponse.json(categoriesByPeriod[period])
  }),
  http.get('*/api/customers/:id/spending/trends', ({ params, request }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    const months = Math.max(1, Number(new URL(request.url).searchParams.get('months')) || 6)
    return HttpResponse.json({ trends: trends.trends.slice(-months) })
  }),
  http.get('*/api/customers/:id/transactions', ({ params, request }) => {
    if (params.id !== customerId) return HttpResponse.json({ message: 'Customer not found' }, { status: 404 })
    const query = new URL(request.url).searchParams
    const period = resolvePeriod(query.get('period'))
    const range = categoriesByPeriod[period].dateRange
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
