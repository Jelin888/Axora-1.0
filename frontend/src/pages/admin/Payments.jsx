import React, { useEffect, useState } from 'react'
import api from '../../services/api'

const statusClass = { PENDING: 'badge-pending', SUCCESS: 'badge-completed', FAILED: 'badge-cancelled' }

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    api.get('/admin/payments', { params: { status: status || undefined, size: 100 } }).then(r => setPayments(r.data.data.content)).catch(() => {})
  }, [status])

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>Payment Management</h1>
      <select className="form-control" style={{ maxWidth: 220, marginBottom: 20 }} value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option><option value="SUCCESS">Successful</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option>
      </select>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
            {['Transaction', 'Project', 'Client', 'Freelancer', 'Amount', 'Date', 'Status'].map(h => <th key={h} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--navy)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {payments.length === 0 && <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No transactions</td></tr>}
            {payments.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>{p.transactionId}</td>
                <td style={{ padding: '12px 16px' }}>{p.projectTitle}</td>
                <td style={{ padding: '12px 16px' }}>{p.payerName}</td>
                <td style={{ padding: '12px 16px' }}>{p.receiverName}</td>
                <td style={{ padding: '12px 16px' }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 16px' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '12px 16px' }}><span className={`badge ${statusClass[p.status]}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
