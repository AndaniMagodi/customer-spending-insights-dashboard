import './App.css'

const metrics = [
  { label: 'Total spent', value: 'R 4,250.75', note: '12.5% more than last month', trend: 'up' },
  { label: 'Transactions', value: '47', note: '3.2% fewer than last month', trend: 'down' },
  { label: 'Average transaction', value: 'R 90.44', note: 'Across all categories', trend: 'neutral' },
  { label: 'Top category', value: 'Groceries', note: 'R 1,250.30 this month', trend: 'neutral' },
]

const categories = [
  { name: 'Groceries', amount: 'R 1,250.30', share: 29.4, color: '#087e69' },
  { name: 'Entertainment', amount: 'R 890.20', share: 20.9, color: '#43a48c' },
  { name: 'Transport', amount: 'R 680.45', share: 16, color: '#84c5b1' },
  { name: 'Dining', amount: 'R 520.30', share: 12.2, color: '#c0dfd4' },
]

const transactions = [
  { merchant: 'Pick n Pay', category: 'Groceries', date: '16 Sep 2026', amount: 'R 245.80' },
  { merchant: 'Netflix', category: 'Entertainment', date: '15 Sep 2026', amount: 'R 199.00' },
  { merchant: 'Shell', category: 'Transport', date: '14 Sep 2026', amount: 'R 620.00' },
]

function App() {
  return (
    <main className="dashboard">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Spending insights home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Spending insights</span>
        </a>
        <div className="profile"><span className="avatar" aria-hidden="true">JD</span><span>Jordan Davis</span></div>
      </header>

      <section id="overview" className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR MONEY, MADE CLEAR</p>
            <h1>Spending overview</h1>
            <p className="subheading">A clear picture of where your money went.</p>
          </div>
          <label className="period-picker">Period
            <select aria-label="Spending period" defaultValue="30d">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </label>
        </div>

        <section className="metric-grid" aria-label="Spending summary">
          {metrics.map((metric) => <article className="metric-card" key={metric.label}>
            <p>{metric.label}</p><strong>{metric.value}</strong>
            <span className={`metric-note ${metric.trend}`}>{metric.note}</span>
          </article>)}
        </section>

        <div className="insight-grid">
          <section className="panel category-panel">
            <div className="panel-heading"><div><h2>Spending by category</h2><p>How your spending is split this month</p></div><button className="text-button">View details <span aria-hidden="true">→</span></button></div>
            <div className="category-list">
              {categories.map((category) => <div className="category-row" key={category.name}>
                <div className="category-title"><span className="category-dot" style={{ backgroundColor: category.color }} /><span>{category.name}</span><strong>{category.amount}</strong></div>
                <div className="progress-track" role="img" aria-label={`${category.name}: ${category.share}% of spending`}><span style={{ width: `${category.share}%`, backgroundColor: category.color }} /></div>
                <span className="share-label">{category.share}% of total</span>
              </div>)}
            </div>
          </section>

          <section className="panel trend-panel">
            <div className="panel-heading"><div><h2>Monthly trend</h2><p>Your spending over the last 6 months</p></div><span className="chart-label">Total spent</span></div>
            <div className="chart-placeholder" role="img" aria-label="Monthly spending chart will appear here">
              <div className="chart-bars" aria-hidden="true"><i style={{ height: '56%' }} /><i style={{ height: '70%' }} /><i style={{ height: '62%' }} /><i style={{ height: '81%' }} /><i style={{ height: '72%' }} /><i style={{ height: '90%' }} /></div>
              <div className="chart-months" aria-hidden="true"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div>
            </div>
          </section>
        </div>

        <section className="panel transactions-panel">
          <div className="panel-heading"><div><h2>Recent transactions</h2><p>Your latest activity</p></div><button className="text-button">All transactions <span aria-hidden="true">→</span></button></div>
          <div className="table-scroll"><table><thead><tr><th scope="col">Merchant</th><th scope="col">Category</th><th scope="col">Date</th><th scope="col" className="amount-cell">Amount</th></tr></thead>
            <tbody>{transactions.map((transaction) => <tr key={`${transaction.merchant}-${transaction.date}`}><td>{transaction.merchant}</td><td><span className="category-pill">{transaction.category}</span></td><td>{transaction.date}</td><td className="amount-cell">{transaction.amount}</td></tr>)}</tbody>
          </table></div>
        </section>
        <p className="demo-note">Sample data for demonstration · Amounts shown in South African rand (ZAR)</p>
      </section>
    </main>
  )
}

export default App
