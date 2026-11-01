import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import UserAvatar from '../../components/UserAvatar'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [keyword, setKeyword] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => { load() }, [role])

  const load = async () => {
    try {
      const res = await api.get('/admin/users', { params: { keyword: keyword || undefined, role: role || undefined, size: 50 } })
      setUsers(res.data.data.content)
    } catch (e) {}
  }

  const toggleStatus = async (u) => {
    const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    try {
      await api.put(`/admin/users/${u.id}/status`, { status: newStatus })
      toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'suspended'}`)
      load()
    } catch (e) { toast.error('Failed to update status') }
  }

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>User Management</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-control" style={{ maxWidth: 280 }} placeholder="Search users..." value={keyword}
          onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
        <select className="form-control" style={{ maxWidth: 200 }} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="FREELANCER">Freelancers</option>
          <option value="CLIENT">Clients</option>
          <option value="ADMIN">Admins</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={load}>Search</button>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
              {['Name', 'Email', 'Role', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--navy)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <UserAvatar user={u} size="xs" />
                    <span>{u.fullName}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>{u.role?.replace('ROLE_', '')}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge ${u.status === 'ACTIVE' ? 'badge-completed' : 'badge-cancelled'}`}>{u.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(u)}>
                    {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
