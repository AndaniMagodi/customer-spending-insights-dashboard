import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardShell } from './DashboardShell'

describe('DashboardShell mobile navigation', () => {
  it('provides bottom navigation without duplicating the desktop menu in the header', () => {
    render(<DashboardShell customerName="John Doe"><main>Dashboard</main></DashboardShell>)

    const mobileNavigation = screen.getByRole('navigation', { name: 'Mobile navigation' })
    expect(mobileNavigation).toHaveTextContent('Overview')
    expect(mobileNavigation).toHaveTextContent('Transactions')
    expect(mobileNavigation).toHaveTextContent('Insights')
    expect(screen.queryByRole('button', { name: /navigation menu/i })).not.toBeInTheDocument()
  })
})
