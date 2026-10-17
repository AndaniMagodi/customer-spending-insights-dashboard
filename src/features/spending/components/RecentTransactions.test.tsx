import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { RecentTransactions } from './RecentTransactions'
import type { Transaction } from '../types'

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

describe('RecentTransactions', () => {
  it('paginates loaded transactions and disables navigation at the boundaries', async () => {
    const user = userEvent.setup()
    render(<RecentTransactions transactions={transactions} />)

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
    render(<RecentTransactions transactions={transactions} />)
    await user.click(screen.getByRole('button', { name: /next/i }))

    await user.type(screen.getByRole('searchbox', { name: /search loaded transactions/i }), 'Purchase 2')

    expect(screen.getByText('Merchant 2')).toBeInTheDocument()
    expect(screen.queryByText('Merchant 6')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1–1 of 1 loaded transactions')).toBeInTheDocument()
  })

  it('filters by category and presents an empty message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<RecentTransactions transactions={transactions} />)

    await user.selectOptions(screen.getByRole('combobox', { name: /filter by transaction category/i }), 'Dining')

    expect(screen.getByText('Merchant 2')).toBeInTheDocument()
    expect(screen.getByText('Merchant 4')).toBeInTheDocument()
    expect(screen.getByText('Merchant 6')).toBeInTheDocument()
    expect(screen.queryByText('Merchant 1')).not.toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: /search loaded transactions/i }), 'does not exist')
    expect(screen.getByText('No transactions match these filters.')).toBeInTheDocument()
    expect(screen.getByText('No matching transactions')).toBeInTheDocument()
  })
})
