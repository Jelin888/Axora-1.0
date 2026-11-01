import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AdminProposals() {
  const [proposals, setProposals] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    api.get('/admin/proposals', { params: { status: status || undefined, size: 100 } }).then(r => setProposals(r.data.data.content)).catch(() => {})
  }, [status])

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>Proposal Management</h1>
      <select className="form-control" style={{ maxWidth: 220, marginBottom: 20 }} value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option><option>PENDING</option><option>ACCEPTED</option><option>REJECTED</option><option>WITHDRAWN</option>
      </select>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
            {['ID', 'Project', 'Freelancer', 'Client', 'Amount', 'Date', 'Status'].map(h => <th key={h} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--navy)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {proposals.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>#{p.id}</td>
                <td style={{ padding: '12px 16px' }}>{p.projectTitle}</td>
                <td style={{ padding: '12px 16px' }}>{p.freelancerName}</td>
                <td style={{ padding: '12px 16px' }}>{p.clientName}</td>
                <td style={{ padding: '12px 16px' }}>₹{Number(p.proposedAmount).toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 16px' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '12px 16px' }}><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
