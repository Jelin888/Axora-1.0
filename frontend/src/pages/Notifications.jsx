import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import api from '../services/api'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => { load() }, [])
  const load = () => api.get('/notifications').then(res => setNotifications(res.data.data)).catch(() => {})

  const markRead = async (id) => {
    try { await api.put(`/notifications/${id}/read`); load() } catch (e) {}
  }

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>Notifications</h1>
      {notifications.length === 0 ? <div className="empty-state">No notifications yet.</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} className="card"
              style={{
                display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer',
                background: n.isRead ? 'white' : '#F0F6FF'
              }}>
              <Bell size={18} color="var(--navy)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: n.isRead ? 400 : 600 }}>{n.message}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
