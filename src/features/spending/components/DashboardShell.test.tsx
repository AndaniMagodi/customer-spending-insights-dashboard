import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DashboardShell } from './DashboardShell'

describe('DashboardShell mobile navigation', () => {
  it('exposes menu state and closes the menu with Escape', async () => {
    const user = userEvent.setup()
    render(<DashboardShell customerName="John Doe"><main>Dashboard</main></DashboardShell>)
    const menuButton = screen.getByRole('button', { name: 'Open navigation menu' })

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await user.click(menuButton)

    expect(screen.getByRole('navigation', { name: 'Mobile menu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('navigation', { name: 'Mobile menu' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false')
  })
})
