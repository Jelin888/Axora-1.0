import React from 'react'
import { Github, ExternalLink, Trash2, Pencil } from 'lucide-react'

export default function PortfolioCard({ item, onEdit, onDelete, editable }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
      )}
      <h4 style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.title}</h4>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.description}</p>
      {item.technologies && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {item.technologies.split(',').map((t, i) => (
            <span key={i} style={{ fontSize: 11, background: '#EEF2FF', color: 'var(--navy)', padding: '3px 8px', borderRadius: 20 }}>{t.trim()}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}><Github size={18} /></a>}
        {item.liveDemoUrl && <a href={item.liveDemoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}><ExternalLink size={18} /></a>}
        {editable && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button onClick={() => onEdit(item)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><Pencil size={16} /></button>
            <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}><Trash2 size={16} /></button>
          </div>
        )}
      </div>
    </div>
  )
}
