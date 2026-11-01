import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

const statusClass = { OPEN: 'badge-open', IN_PROGRESS: 'badge-progress', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled' }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')

  const load = () => api.get('/admin/projects', { params: { keyword: keyword || undefined, status: status || undefined, size: 100 } })
    .then(r => setProjects(r.data.data.content)).catch(() => {})
  useEffect(() => { load() }, [status])

  const remove = async (p) => {
    if (!window.confirm(`Remove "${p.title}"? This also removes its proposals and cannot be undone.`)) return
    try { await api.delete(`/admin/projects/${p.id}`); toast.success('Project removed'); load() } catch (e) { toast.error('Failed to remove project') }
  }
  const setProjectStatus = async (p, s) => {
    try { await api.put(`/admin/projects/${p.id}/status`, { status: s }); toast.success('Status updated'); load() } catch (e) { toast.error('Failed to update status') }
  }

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>Project Management</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-control" style={{ maxWidth: 280 }} placeholder="Search projects..." value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
        <select className="form-control" style={{ maxWidth: 200 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option><option>OPEN</option><option>IN_PROGRESS</option><option>COMPLETED</option><option>CANCELLED</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={load}>Search</button>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
            {['Title', 'Client', 'Budget', 'Proposals', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--navy)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>{p.title}</td>
                <td style={{ padding: '12px 16px' }}>{p.clientName}</td>
                <td style={{ padding: '12px 16px' }}>₹{Number(p.budget).toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 16px' }}>{p.proposalCount}</td>
                <td style={{ padding: '12px 16px' }}><span className={`badge ${statusClass[p.status]}`}>{p.status.replace('_', ' ')}</span></td>
                <td style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                  {p.status !== 'CANCELLED' && <button className="btn btn-outline btn-sm" onClick={() => setProjectStatus(p, 'CANCELLED')}>Cancel</button>}
                  <button className="btn btn-danger btn-sm" onClick={() => remove(p)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
