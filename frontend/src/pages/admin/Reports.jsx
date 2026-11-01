import React, { useEffect, useState } from 'react'
import api from '../../services/api'

// Dependency-free bar chart (pure CSS) so no charting library is needed
function BarChart({ title, data, money }) {
  const max = Math.max(1, ...data.map(d => d.value))
  return (
    <div className="card">
      <h4 style={{ color: 'var(--navy)', marginBottom: 14 }}>{title}</h4>
      {data.length === 0 ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No data yet.</p> : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
          {data.map(d => (
            <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }} title={`${d.month}: ${money ? '₹' : ''}${d.value.toLocaleString('en-IN')}`}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{money ? '₹' : ''}{d.value.toLocaleString('en-IN')}</span>
              <div style={{ width: '100%', maxWidth: 34, height: `${(d.value / max) * 100}%`, minHeight: 3, background: 'linear-gradient(180deg, var(--blue-accent), var(--navy))', borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontSize: 10, marginTop: 6 }}>{d.month.slice(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminReports() {
  const [r, setR] = useState(null)
  useEffect(() => { api.get('/admin/reports').then(res => setR(res.data.data)).catch(() => {}) }, [])
  if (!r) return <div className="skeleton" style={{ height: 200 }} />
  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>Reports & Analytics</h1>
      <div className="grid grid-2">
        <BarChart title="New users per month" data={r.usersPerMonth} />
        <BarChart title="Projects posted per month" data={r.projectsPerMonth} />
        <BarChart title="Completed projects per month" data={r.completedPerMonth} />
        <BarChart title="Proposals per month" data={r.proposalsPerMonth} />
        <BarChart title="Freelancer growth" data={r.freelancersPerMonth} />
        <BarChart title="Client growth" data={r.clientsPerMonth} />
        <BarChart title="Revenue trend" data={r.revenuePerMonth} money />
      </div>
    </div>
  )
}
