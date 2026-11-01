import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ChatWindow from '../components/ChatWindow'
import { useAuth } from '../context/AuthContext'
import UserAvatar from '../components/UserAvatar'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/conversations').then(res => {
      setConversations(res.data.data)
      if (res.data.data.length > 0) setSelected(res.data.data[0])
    }).catch(() => {})
  }, [])

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>Messages</h1>
      <div className="card" style={{ padding: 0, display: 'flex', height: 560, overflow: 'hidden' }}>
        <div style={{ width: 280, borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
          {conversations.length === 0 ? (
            <div className="empty-state" style={{ padding: 20 }}>No conversations yet.</div>
          ) : conversations.map(c => {
            const other = c.members?.find(m => m.id !== user.id)
            return (
              <div key={c.id} onClick={() => setSelected(c)}
                style={{
                  padding: '14px 18px', cursor: 'pointer',
                  background: selected?.id === c.id ? '#EEF2FF' : 'transparent',
                  borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center'
                }}>
                <UserAvatar user={other} size="sm" showBadge badgeRole={other?.role} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{other?.fullName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.lastMessage?.content || 'No messages yet'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ flex: 1 }}>
          <ChatWindow conversation={selected} />
        </div>
      </div>
    </div>
  )
}
