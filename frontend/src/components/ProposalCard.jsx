import React from 'react'
import { IndianRupee, Clock } from 'lucide-react'
import UserAvatar from './UserAvatar'

const statusClass = { PENDING: 'badge-pending', ACCEPTED: 'badge-accepted', REJECTED: 'badge-rejected', WITHDRAWN: 'badge-cancelled' }

export default function ProposalCard({ proposal, onAccept, onReject, showActions }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserAvatar
            user={{ fullName: proposal.freelancerName, profilePhotoUrl: proposal.freelancerProfilePhotoUrl }}
            size="md"
          />
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--navy)', margin: 0 }}>{proposal.freelancerName}</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>for "{proposal.projectTitle}"</p>
          </div>
        </div>
        <span className={`badge ${statusClass[proposal.status] || 'badge-pending'}`}>{proposal.status}</span>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-dark)', lineHeight: 1.5 }}>{proposal.coverLetter}</p>
      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IndianRupee size={14} /> {Number(proposal.proposedAmount).toLocaleString('en-IN')}</span>
        {proposal.estimatedDeliveryDays && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {proposal.estimatedDeliveryDays} days</span>}
      </div>
      {showActions && proposal.status === 'PENDING' && (
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="btn btn-primary btn-sm" onClick={() => onAccept(proposal.id)}>Accept</button>
          <button className="btn btn-outline btn-sm" onClick={() => onReject(proposal.id)}>Reject</button>
        </div>
      )}
    </div>
  )
}
