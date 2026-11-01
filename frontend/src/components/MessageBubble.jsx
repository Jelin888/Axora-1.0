import React from 'react'
import { Check, CheckCheck } from 'lucide-react'

export default function MessageBubble({ message, isMine }) {
  const time = message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  return (
    <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
      <div style={{
        maxWidth: '70%',
        background: isMine ? 'var(--navy)' : '#EEF2F7',
        color: isMine ? 'white' : 'var(--text-dark)',
        padding: '10px 14px',
        borderRadius: isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
        fontSize: 14,
      }}>
        <p style={{ margin: 0, lineHeight: 1.4 }}>{message.content}</p>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'flex-end', marginTop: 4, fontSize: 10, opacity: 0.75 }}>
          <span>{time}</span>
          {isMine && (message.status === 'READ' ? <CheckCheck size={12} /> : <Check size={12} />)}
        </div>
      </div>
    </div>
  )
}
