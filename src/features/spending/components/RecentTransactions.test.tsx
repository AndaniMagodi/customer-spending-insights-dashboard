import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RecentTransactions } from './RecentTransactions'
import type { Transaction, TransactionFilters } from '../types'

const transactions: Transaction[] = Array.from({ length: 7 }, (_, index) => ({
  id: `txn-${index + 1}`,
  date: `2026-10-${String(17 - index).padStart(2, '0')}T10:00:00Z`,
  merchant: `Merchant ${index + 1}`,
  category: index % 2 === 0 ? 'Groceries' : 'Dining',
  amount: (index + 1) * 10,
  description: `Purchase ${index + 1}`,
  paymentMethod: 'Credit Card',
  icon: 'shopping-cart',
  categoryColor: '#087e69',
}))

const initialFilters: TransactionFilters = { category: null, startDate: '', endDate: '', sortBy: 'date_desc' }

function renderTransactions() {
  const onFiltersChange = vi.fn()
  render(<RecentTransactions transactions={transactions} categories={[{ name: 'Dining', color: '#a5d2c4', icon: 'utensils' }, { name: 'Groceries', color: '#087e69', icon: 'shopping-cart' }]} filters={initialFilters} onFiltersChange={onFiltersChange} />)
  return onFiltersChange
}

describe('RecentTransactions', () => {
  it('paginates loaded transactions and disables navigation at the boundaries', async () => {
    const user = userEvent.setup()
    renderTransactions()

    expect(screen.getByText('Merchant 1')).toBeInTheDocument()
    expect(screen.getByText('Merchant 5')).toBeInTheDocument()
    expect(screen.queryByText('Merchant 6')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1–5 of 7 loaded transactions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.queryByText('Merchant 1')).not.toBeInTheDocument()
    expect(screen.getByText('Merchant 6')).toBeInTheDocument()
    expect(screen.getByText('Showing 6–7 of 7 loaded transactions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('searches merchant, category, and description and resets to the first page', async () => {
    const user = userEvent.setup()
    renderTransactions()
    await user.click(screen.getByRole('button', { name: /next/i }))

    await user.type(screen.getByRole('searchbox', { name: /search this page/i }), 'Purchase 2')

    expect(screen.getByText('Merchant 2')).toBeInTheDocument()
    expect(screen.queryByText('Merchant 6')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1–1 of 1 loaded transactions')).toBeInTheDocument()
  })

  it('requests category filtering and presents an empty message when search has no matches', async () => {
    const user = userEvent.setup()
    const onFiltersChange = renderTransactions()

    await user.selectOptions(screen.getByRole('combobox', { name: /filter by transaction category/i }), 'Dining')

    expect(onFiltersChange).toHaveBeenCalledWith({ ...initialFilters, category: 'Dining' })

    await user.type(screen.getByRole('searchbox', { name: /search this page/i }), 'does not exist')
    expect(screen.getByText('No transactions match these filters.')).toBeInTheDocument()
    expect(screen.getByText('No matching transactions')).toBeInTheDocument()
  })

  it('reveals transaction details on both mobile and desktop layouts', async () => {
    const user = userEvent.setup()
    renderTransactions()

    const detailsButton = screen.getByRole('button', { name: 'Merchant 1 transaction details' })
    await user.click(detailsButton)

    expect(detailsButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Purchase 1')).toBeInTheDocument()
    expect(screen.getByText('Purchase 1').parentElement).toHaveTextContent('Credit Card')
  })
})
