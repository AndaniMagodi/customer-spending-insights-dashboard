import { z } from 'zod'

export const SpendingPeriodSchema = z.enum(['7d', '30d', '90d', '1y'])
export const TransactionSortBySchema = z.enum(['date_desc', 'date_asc', 'amount_desc', 'amount_asc'])
export const DateRangePresetSchema = z.object({ label: z.string(), value: SpendingPeriodSchema })
export const FiltersResponseSchema = z.object({
  categories: z.array(z.object({ name: z.string(), color: z.string(), icon: z.string() })),
  dateRangePresets: z.array(DateRangePresetSchema),
})
export const SpendingGoalSchema = z.object({
  id: z.string(),
  category: z.string(),
  monthlyBudget: z.number().positive(),
  currentSpent: z.number().nonnegative(),
  percentageUsed: z.number().nonnegative(),
  daysRemaining: z.number().int().nonnegative(),
  status: z.enum(['on_track', 'warning']),
})
export const GoalsResponseSchema = z.object({ goals: z.array(SpendingGoalSchema) })

export const CustomerProfileSchema = z.object({
  customerId: z.string(),
  name: z.string(),
  email: z.email(),
  joinDate: z.iso.date(),
  accountType: z.string(),
  totalSpent: z.number().nonnegative(),
  currency: z.string().length(3),
})

export const SpendingSummarySchema = z.object({
  period: SpendingPeriodSchema,
  totalSpent: z.number().nonnegative(),
  transactionCount: z.number().int().nonnegative(),
  averageTransaction: z.number().nonnegative(),
  topCategory: z.string(),
  comparedToPrevious: z.object({ spentChange: z.number(), transactionChange: z.number() }),
})

export const SpendingCategorySchema = z.object({
  name: z.string(),
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),
  transactionCount: z.number().int().nonnegative(),
  color: z.string(),
  icon: z.string(),
})

export const CategoriesResponseSchema = z.object({
  dateRange: z.object({ startDate: z.iso.date(), endDate: z.iso.date() }),
  totalAmount: z.number().nonnegative(),
  categories: z.array(SpendingCategorySchema),
})

export const SpendingTrendSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  totalSpent: z.number().nonnegative(),
  transactionCount: z.number().int().nonnegative(),
  averageTransaction: z.number().nonnegative(),
})

export const TrendsResponseSchema = z.object({ trends: z.array(SpendingTrendSchema) })

export const TransactionSchema = z.object({
  id: z.string(),
  date: z.iso.datetime(),
  merchant: z.string(),
  category: z.string(),
  amount: z.number().nonnegative(),
  description: z.string(),
  paymentMethod: z.string(),
  icon: z.string(),
  categoryColor: z.string(),
})

export const TransactionsResponseSchema = z.object({
  transactions: z.array(TransactionSchema),
  pagination: z.object({
    total: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
    offset: z.number().int().nonnegative(),
    hasMore: z.boolean(),
  }),
})

export type SpendingPeriod = z.infer<typeof SpendingPeriodSchema>
export type TransactionSortBy = z.infer<typeof TransactionSortBySchema>
export type FiltersResponse = z.infer<typeof FiltersResponseSchema>
export type SpendingGoal = z.infer<typeof SpendingGoalSchema>
export type GoalsResponse = z.infer<typeof GoalsResponseSchema>
export type CustomerProfile = z.infer<typeof CustomerProfileSchema>
export type SpendingSummary = z.infer<typeof SpendingSummarySchema>
export type SpendingCategory = z.infer<typeof SpendingCategorySchema>
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>
export type SpendingTrend = z.infer<typeof SpendingTrendSchema>
export type TrendsResponse = z.infer<typeof TrendsResponseSchema>
export type Transaction = z.infer<typeof TransactionSchema>
export type TransactionsResponse = z.infer<typeof TransactionsResponseSchema>

export interface TransactionFilters {
  category: string | null
  startDate: string
  endDate: string
  sortBy: TransactionSortBy
}

export interface TransactionQueryOptions extends Partial<TransactionFilters> {
  limit?: number
  offset?: number
}
