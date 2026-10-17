import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CategoryBreakdown } from './CategoryBreakdown'
import { SpendingTrendChart } from './SpendingTrendChart'

describe('chart empty states', () => {
  it('explains when there are no category values to chart', () => {
    render(<CategoryBreakdown categories={[]} />)

    expect(screen.getByRole('status')).toHaveTextContent('No category spending is available for this period.')
  })

  it('explains when trend data is unavailable', () => {
    render(<SpendingTrendChart trends={[]} />)

    expect(screen.getByRole('status')).toHaveTextContent('No spending trend data is available yet.')
  })
})
