import React from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, IndianRupee } from 'lucide-react'
import UserAvatar from './UserAvatar'

export default function FreelancerCard({ freelancer }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center', alignItems: 'center' }}>
      <UserAvatar
        user={freelancer}
        size="xl"
        showBadge
        badgeRole="ROLE_FREELANCER"
      />
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>{freelancer.fullName}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{freelancer.professionalTitle || 'Freelancer'}</p>
      </div>
      {freelancer.location && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <MapPin size={13} /> {freelancer.location}
        </span>
      )}
      {freelancer.skills && freelancer.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          {[...freelancer.skills].slice(0, 3).map((s, i) => (
            <span key={i} style={{ fontSize: 11, background: '#EEF2FF', color: 'var(--navy)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 13, color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={14} fill="#FBBF24" stroke="#FBBF24" /> {freelancer.averageRating?.toFixed(1) || 'New'}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IndianRupee size={14} /> {freelancer.hourlyRate || '—'}/hr</span>
      </div>
      <Link to={`/freelancers/${freelancer.id}`} className="btn btn-primary btn-sm btn-full">View Profile</Link>
    </div>
  )
}
