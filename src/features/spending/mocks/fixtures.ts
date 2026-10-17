import type { CategoriesResponse, CustomerProfile, SpendingPeriod, SpendingSummary, Transaction, TrendsResponse } from '../types'

export const customerId = '12345'

export const customerProfile: CustomerProfile = {
  customerId,
  name: 'John Doe',
  email: 'john.doe@email.com',
  joinDate: '2023-01-15',
  accountType: 'premium',
  totalSpent: 15420.5,
  currency: 'ZAR',
}

export const summaryFixtures: Record<SpendingPeriod, SpendingSummary> = {
  '7d': { period: '7d', totalSpent: 1120.35, transactionCount: 13, averageTransaction: 86.18, topCategory: 'Groceries', comparedToPrevious: { spentChange: -4.8, transactionChange: 3.2 } },
  '30d': { period: '30d', totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44, topCategory: 'Groceries', comparedToPrevious: { spentChange: 12.5, transactionChange: -3.2 } },
  '90d': { period: '90d', totalSpent: 11320, transactionCount: 129, averageTransaction: 87.75, topCategory: 'Groceries', comparedToPrevious: { spentChange: 8.6, transactionChange: 4.1 } },
  '1y': { period: '1y', totalSpent: 51240.5, transactionCount: 568, averageTransaction: 90.21, topCategory: 'Groceries', comparedToPrevious: { spentChange: 11.2, transactionChange: 5.4 } },
}

export const categoriesByPeriod: Record<SpendingPeriod, CategoriesResponse> = {
  '7d': {
    dateRange: { startDate: '2026-10-10', endDate: '2026-10-17' }, totalAmount: 1120.35,
    categories: [
      { name: 'Groceries', amount: 360.45, percentage: 32.2, transactionCount: 4, color: '#087e69', icon: 'shopping-cart' },
      { name: 'Entertainment', amount: 99.7, percentage: 8.9, transactionCount: 2, color: '#3b9c83', icon: 'film' },
      { name: 'Dining', amount: 210.2, percentage: 18.8, transactionCount: 3, color: '#a5d2c4', icon: 'utensils' },
      { name: 'Shopping', amount: 150, percentage: 13.4, transactionCount: 2, color: '#c3e1d7', icon: 'shopping-bag' },
      { name: 'Utilities', amount: 300, percentage: 26.7, transactionCount: 2, color: '#d9ece5', icon: 'zap' },
    ],
  },
  '30d': {
    dateRange: { startDate: '2026-09-17', endDate: '2026-10-17' }, totalAmount: 4250.75,
    categories: [
      { name: 'Groceries', amount: 1250.3, percentage: 29.4, transactionCount: 13, color: '#087e69', icon: 'shopping-cart' },
      { name: 'Entertainment', amount: 890.2, percentage: 20.9, transactionCount: 7, color: '#3b9c83', icon: 'film' },
      { name: 'Transportation', amount: 680.45, percentage: 16, transactionCount: 10, color: '#73bba7', icon: 'car' },
      { name: 'Dining', amount: 520.3, percentage: 12.2, transactionCount: 8, color: '#a5d2c4', icon: 'utensils' },
      { name: 'Shopping', amount: 450.8, percentage: 10.6, transactionCount: 5, color: '#c3e1d7', icon: 'shopping-bag' },
      { name: 'Utilities', amount: 458.7, percentage: 10.8, transactionCount: 4, color: '#d9ece5', icon: 'zap' },
    ],
  },
  '90d': {
    dateRange: { startDate: '2026-07-19', endDate: '2026-10-17' }, totalAmount: 11320,
    categories: [
      { name: 'Groceries', amount: 3675.9, percentage: 32.5, transactionCount: 37, color: '#087e69', icon: 'shopping-cart' },
      { name: 'Entertainment', amount: 2380.6, percentage: 21, transactionCount: 20, color: '#3b9c83', icon: 'film' },
      { name: 'Transportation', amount: 1815.3, percentage: 16, transactionCount: 28, color: '#73bba7', icon: 'car' },
      { name: 'Dining', amount: 1510.2, percentage: 13.3, transactionCount: 22, color: '#a5d2c4', icon: 'utensils' },
      { name: 'Shopping', amount: 1015.5, percentage: 9, transactionCount: 13, color: '#c3e1d7', icon: 'shopping-bag' },
      { name: 'Utilities', amount: 922.5, percentage: 8.2, transactionCount: 9, color: '#d9ece5', icon: 'zap' },
    ],
  },
  '1y': {
    dateRange: { startDate: '2025-10-17', endDate: '2026-10-17' }, totalAmount: 51240.5,
    categories: [
      { name: 'Groceries', amount: 15700, percentage: 30.6, transactionCount: 184, color: '#087e69', icon: 'shopping-cart' },
      { name: 'Entertainment', amount: 10150, percentage: 19.8, transactionCount: 102, color: '#3b9c83', icon: 'film' },
      { name: 'Transportation', amount: 8200, percentage: 16, transactionCount: 98, color: '#73bba7', icon: 'car' },
      { name: 'Dining', amount: 6500, percentage: 12.7, transactionCount: 76, color: '#a5d2c4', icon: 'utensils' },
      { name: 'Shopping', amount: 5900, percentage: 11.5, transactionCount: 62, color: '#c3e1d7', icon: 'shopping-bag' },
      { name: 'Utilities', amount: 4790.5, percentage: 9.4, transactionCount: 46, color: '#d9ece5', icon: 'zap' },
    ],
  },
}

export const trends: TrendsResponse = {
  trends: [
    { month: '2025-11', totalSpent: 3890.25, transactionCount: 42, averageTransaction: 92.62 },
    { month: '2025-12', totalSpent: 4150.8, transactionCount: 38, averageTransaction: 109.23 },
    { month: '2026-01', totalSpent: 3750.6, transactionCount: 45, averageTransaction: 83.35 },
    { month: '2026-02', totalSpent: 4200.45, transactionCount: 39, averageTransaction: 107.7 },
    { month: '2026-03', totalSpent: 3980.3, transactionCount: 44, averageTransaction: 90.46 },
    { month: '2026-04', totalSpent: 4105.2, transactionCount: 43, averageTransaction: 95.47 },
    { month: '2026-05', totalSpent: 4338.7, transactionCount: 45, averageTransaction: 96.42 },
    { month: '2026-06', totalSpent: 3876.15, transactionCount: 41, averageTransaction: 94.54 },
    { month: '2026-07', totalSpent: 4621.4, transactionCount: 48, averageTransaction: 96.28 },
    { month: '2026-08', totalSpent: 4055.3, transactionCount: 43, averageTransaction: 94.31 },
    { month: '2026-09', totalSpent: 4425.9, transactionCount: 46, averageTransaction: 96.22 },
    { month: '2026-10', totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 },
  ],
}

export const transactions: Transaction[] = [
    { id: 'txn_123456', date: '2026-10-16T14:30:00Z', merchant: 'Pick n Pay', category: 'Groceries', amount: 245.8, description: 'Weekly groceries', paymentMethod: 'Credit Card', icon: 'shopping-cart', categoryColor: '#087e69' },
    { id: 'txn_123457', date: '2026-10-15T10:15:00Z', merchant: 'Netflix', category: 'Entertainment', amount: 199, description: 'Monthly subscription', paymentMethod: 'Debit Order', icon: 'film', categoryColor: '#3b9c83' },
    { id: 'txn_123465', date: '2026-10-14T12:30:00Z', merchant: 'Woolworths Food', category: 'Dining', amount: 184.5, description: 'Lunch with a colleague', paymentMethod: 'Credit Card', icon: 'utensils', categoryColor: '#a5d2c4' },
    { id: 'txn_123466', date: '2026-10-11T09:05:00Z', merchant: 'City Utilities', category: 'Utilities', amount: 325, description: 'Municipal services', paymentMethod: 'Debit Order', icon: 'zap', categoryColor: '#d9ece5' },
    { id: 'txn_123458', date: '2026-10-05T17:40:00Z', merchant: 'Shell', category: 'Transportation', amount: 620, description: 'Fuel', paymentMethod: 'Credit Card', icon: 'car', categoryColor: '#73bba7' },
    { id: 'txn_123467', date: '2026-10-02T15:10:00Z', merchant: 'Mr Price', category: 'Shopping', amount: 279.99, description: 'Clothing purchase', paymentMethod: 'Credit Card', icon: 'shopping-bag', categoryColor: '#c3e1d7' },
    { id: 'txn_123459', date: '2026-09-29T12:05:00Z', merchant: 'Woolworths', category: 'Groceries', amount: 384.5, description: 'Household shopping', paymentMethod: 'Credit Card', icon: 'shopping-cart', categoryColor: '#087e69' },
    { id: 'txn_123468', date: '2026-09-24T18:20:00Z', merchant: 'Uber', category: 'Transportation', amount: 156.75, description: 'Ride home', paymentMethod: 'Credit Card', icon: 'car', categoryColor: '#73bba7' },
    { id: 'txn_123460', date: '2026-09-18T08:25:00Z', merchant: 'vida e caffè', category: 'Dining', amount: 78, description: 'Coffee', paymentMethod: 'Credit Card', icon: 'utensils', categoryColor: '#a5d2c4' },
    { id: 'txn_123461', date: '2026-08-25T11:00:00Z', merchant: 'Checkers', category: 'Groceries', amount: 512.4, description: 'Monthly groceries', paymentMethod: 'Credit Card', icon: 'shopping-cart', categoryColor: '#087e69' },
    { id: 'txn_123462', date: '2026-07-30T16:45:00Z', merchant: 'Engen', category: 'Transportation', amount: 730, description: 'Fuel', paymentMethod: 'Credit Card', icon: 'car', categoryColor: '#73bba7' },
    { id: 'txn_123463', date: '2026-06-14T09:20:00Z', merchant: 'Spotify', category: 'Entertainment', amount: 89.99, description: 'Monthly subscription', paymentMethod: 'Debit Order', icon: 'film', categoryColor: '#3b9c83' },
    { id: 'txn_123464', date: '2025-12-05T13:10:00Z', merchant: 'Builders', category: 'Shopping', amount: 840, description: 'Home supplies', paymentMethod: 'Credit Card', icon: 'shopping-bag', categoryColor: '#c3e1d7' },
]
