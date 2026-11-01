import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

// List of the user's active/completed project workspaces
export default function Workspaces() {
  const { user } = useAuth()
  const [contracts, setContracts] = useState([])
  useEffect(() => { api.get('/contracts/my').then(r => setContracts(r.data.data)).catch(() => {}) }, [])
  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>Project Workspaces</h1>
      {contracts.length === 0 ? <div className="empty-state">No workspaces yet. One is created when a proposal is accepted.</div> : (
        <div className="grid grid-2">
          {contracts.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <h4 style={{ color: 'var(--navy)' }}>{c.project.title}</h4>
                <span className={`badge ${c.project.status === 'COMPLETED' ? 'badge-completed' : 'badge-progress'}`}>{c.project.status.replace('_', ' ')}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>With {user.id === c.client.id ? c.freelancer.fullName : c.client.fullName} · {c.progressPercent}% done</p>
              <Link to={`/workspace/${c.project.id}`} className="btn btn-outline btn-sm">Open Workspace</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
