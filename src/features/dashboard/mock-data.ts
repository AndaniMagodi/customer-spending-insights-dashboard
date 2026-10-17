export type Period = '30d' | '90d' | '1y'

export interface CategorySpend {
  name: string
  amount: number
  color: string
}

export interface SpendingTrend {
  month: string
  amount: number
}

export interface Transaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  status: 'Processed' | 'Pending'
  paymentMethod: string
}

export interface DashboardData {
  totalSpent: number
  transactionCount: number
  averageTransaction: number
  topCategory: string
  previousPeriodChange: number
  monthlyBudget: number
  categories: CategorySpend[]
  trend: SpendingTrend[]
  transactions: Transaction[]
}

const monthlyData: DashboardData = {
  totalSpent: 4250.75,
  transactionCount: 47,
  averageTransaction: 90.44,
  topCategory: 'Groceries',
  previousPeriodChange: 12.5,
  monthlyBudget: 6500,
  categories: [
    { name: 'Groceries', amount: 1250.3, color: '#087e69' },
    { name: 'Entertainment', amount: 890.2, color: '#3b9c83' },
    { name: 'Transport', amount: 680.45, color: '#73bba7' },
    { name: 'Dining', amount: 520.3, color: '#a5d2c4' },
    { name: 'Shopping', amount: 450.8, color: '#c3e1d7' },
    { name: 'Utilities', amount: 458.7, color: '#d9ece5' },
  ],
  trend: [
    { month: 'Apr', amount: 3890.25 },
    { month: 'May', amount: 4150.8 },
    { month: 'Jun', amount: 3750.6 },
    { month: 'Jul', amount: 4200.45 },
    { month: 'Aug', amount: 3980.3 },
    { month: 'Sep', amount: 4250.75 },
  ],
  transactions: [
    {
      id: 'txn-001',
      date: '16 Oct 2026',
      merchant: 'Pick n Pay',
      category: 'Groceries',
      amount: 245.8,
      status: 'Processed',
      paymentMethod: 'Card',
    },
    {
      id: 'txn-002',
      date: '15 Oct 2026',
      merchant: 'Netflix',
      category: 'Entertainment',
      amount: 199,
      status: 'Processed',
      paymentMethod: 'Debit order',
    },
    {
      id: 'txn-003',
      date: '14 Oct 2026',
      merchant: 'Shell',
      category: 'Transport',
      amount: 620,
      status: 'Pending',
      paymentMethod: 'Card',
    },
    {
      id: 'txn-004',
      date: '13 Oct 2026',
      merchant: 'Woolworths',
      category: 'Groceries',
      amount: 384.5,
      status: 'Processed',
      paymentMethod: 'Card',
    },
    {
      id: 'txn-005',
      date: '12 Oct 2026',
      merchant: ' vida e caffè',
      category: 'Dining',
      amount: 78,
      status: 'Processed',
      paymentMethod: 'Card',
    },
  ],
}

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds))


export async function fetchDashboardData(period: Period): Promise<DashboardData> {
  await wait(350)

  if (period === '30d') {
    return structuredClone(monthlyData)
  }

  const multiplier = period === '90d' ? 2.8 : 10.5

  return {
    ...structuredClone(monthlyData),
    totalSpent: Math.round(monthlyData.totalSpent * multiplier * 100) / 100,
    transactionCount: Math.round(monthlyData.transactionCount * multiplier),
    averageTransaction: monthlyData.averageTransaction,
    trend:
      period === '90d'
        ? monthlyData.trend.slice(-3)
        : monthlyData.trend,
  }
}