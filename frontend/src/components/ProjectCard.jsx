import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Briefcase, IndianRupee } from 'lucide-react'

const statusClass = {
  OPEN: 'badge-open',
  IN_PROGRESS: 'badge-progress',
  COMPLETED: 'badge-completed',
  CANCELLED: 'badge-cancelled',
}

export default function ProjectCard({ project }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)' }}>{project.title}</h3>
        <span className={`badge ${statusClass[project.status] || 'badge-pending'}`}>{project.status?.replace('_', ' ')}</span>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {project.description}
      </p>
      {project.requiredSkills && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.requiredSkills.split(',').slice(0, 4).map((s, i) => (
            <span key={i} style={{ fontSize: 11, background: '#EEF2FF', color: 'var(--navy)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>{s.trim()}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IndianRupee size={14} /> {Number(project.budget).toLocaleString('en-IN')}</span>
        {project.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {project.deadline}</span>}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={14} /> {project.proposalCount ?? 0} proposals</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {project.clientName}</span>
        <Link to={`/projects/${project.id}`} className="btn btn-outline btn-sm">View Details</Link>
      </div>
    </div>
  )
}
