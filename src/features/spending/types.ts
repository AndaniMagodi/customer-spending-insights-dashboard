export type SpendingPeriod = '7d' | '30d' | '90d' | '1y'

export interface CustomerProfile {
  customerId: string
  name: string
  email: string
  joinDate: string
  accountType: string
  totalSpent: number
  currency: string
}

export interface SpendingSummary {
  period: SpendingPeriod
  totalSpent: number
  transactionCount: number
  averageTransaction: number
  topCategory: string
  comparedToPrevious: {
    spentChange: number
    transactionChange: number
  }
}

export interface SpendingCategory {
  name: string
  amount: number
  percentage: number
  transactionCount: number
  color: string
  icon: string
}

export interface CategoriesResponse {
  dateRange: { startDate: string; endDate: string }
  totalAmount: number
  categories: SpendingCategory[]
}

export interface SpendingTrend {
  month: string
  totalSpent: number
  transactionCount: number
  averageTransaction: number
}

export interface TrendsResponse {
  trends: SpendingTrend[]
}

export interface Transaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  description: string
  paymentMethod: string
  icon: string
  categoryColor: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}
