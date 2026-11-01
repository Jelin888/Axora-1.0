import React, { useEffect, useRef, useState } from 'react'
import { Send, Paperclip } from 'lucide-react'
import MessageBubble from './MessageBubble'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import UserAvatar from './UserAvatar'

export default function ChatWindow({ conversation }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const otherMember = conversation?.members?.find(m => m.id !== user.id)

  useEffect(() => {
    if (!conversation) return
    loadMessages()
    const interval = setInterval(loadMessages, 5000) // simple polling since this is REST-based messaging
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    try {
      const res = await api.get(`/conversations/${conversation.id}/messages`)
      setMessages(res.data.data)
    } catch (e) { /* silent poll failure */ }
  }

  const send = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      await api.post(`/conversations/${conversation.id}/messages`, { content: text })
      setText('')
      loadMessages()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  if (!conversation) {
    return <div className="empty-state">Select a conversation to start chatting</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <UserAvatar user={otherMember} size="sm" showBadge badgeRole={otherMember?.role} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{otherMember?.fullName || 'Conversation'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Project-related conversation</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#FAFBFD' }}>
        {messages.length === 0 && <div className="empty-state">No messages yet. Say hello 👋</div>}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} isMine={m.senderId === user.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: 14, borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }} title="Attachments (demo)">
          <Paperclip size={20} />
        </button>
        <input
          className="form-control"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="btn btn-primary btn-sm" onClick={send} disabled={loading}>
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
