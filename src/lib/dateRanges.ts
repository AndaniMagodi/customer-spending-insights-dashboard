import type { SpendingPeriod } from '../features/spending/types'

const lookbackDays: Record<SpendingPeriod, number> = { '7d': 6, '30d': 29, '90d': 89, '1y': 364 }
const millisecondsPerDay = 86_400_000

function toDateOnly(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getPeriodDateRange(period: SpendingPeriod, today = new Date()) {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const start = new Date(end)
  start.setDate(start.getDate() - lookbackDays[period])
  return { startDate: toDateOnly(start), endDate: toDateOnly(end) }
}

export function getInclusiveDateRangeDays(startDate: string, endDate: string) {
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number)
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number)
  const start = Date.UTC(startYear, startMonth - 1, startDay)
  const end = Date.UTC(endYear, endMonth - 1, endDay)
  return Math.round((end - start) / millisecondsPerDay) + 1
}

export function getPreviousDateRange(startDate: string, endDate: string) {
  const duration = getInclusiveDateRangeDays(startDate, endDate)
  const [year, month, day] = startDate.split('-').map(Number)
  const previousEnd = Date.UTC(year, month - 1, day) - millisecondsPerDay
  const previousStart = previousEnd - (duration - 1) * millisecondsPerDay
  return {
    startDate: new Date(previousStart).toISOString().slice(0, 10),
    endDate: new Date(previousEnd).toISOString().slice(0, 10),
  }
}

export function shiftFixtureDate(value: string, referenceDate = '2026-10-17') {
  const [year, month, day] = referenceDate.split('-').map(Number)
  const [sourceYear, sourceMonth, sourceDay] = value.slice(0, 10).split('-').map(Number)
  const offset = Math.round((Date.UTC(sourceYear, sourceMonth - 1, sourceDay) - Date.UTC(year, month - 1, day)) / 86_400_000)
  const now = new Date()
  const current = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const shifted = new Date(current + offset * 86_400_000).toISOString().slice(0, 10)
  return `${shifted}${value.slice(10)}`
}

export function shiftFixtureMonth(value: string, referenceMonth = '2026-10') {
  const [referenceYear, referenceIndex] = referenceMonth.split('-').map(Number)
  const [sourceYear, sourceIndex] = value.split('-').map(Number)
  const monthOffset = (sourceYear - referenceYear) * 12 + sourceIndex - referenceIndex
  const now = new Date()
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() + monthOffset, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}
