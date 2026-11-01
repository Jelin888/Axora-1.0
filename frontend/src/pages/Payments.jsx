import React, { useEffect, useState } from 'react'
import api from '../services/api'

const statusClass = { PENDING: 'badge-pending', SUCCESS: 'badge-completed', FAILED: 'badge-cancelled' }

export default function Payments() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    api.get('/payments/my').then(res => setPayments(res.data.data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>Payment History</h1>
      {payments.length === 0 ? <div className="empty-state">No transactions yet.</div> : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
                {['Transaction', 'Project', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--navy)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>{p.transactionId}</td>
                  <td style={{ padding: '12px 16px' }}>{p.projectTitle}</td>
                  <td style={{ padding: '12px 16px' }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '12px 16px' }}><span className={`badge ${statusClass[p.status]}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
