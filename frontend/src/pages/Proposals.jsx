import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ProposalCard from '../components/ProposalCard'

export default function Proposals() {
  const [proposals, setProposals] = useState([])

  useEffect(() => {
    api.get('/proposals/my').then(res => setProposals(res.data.data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 20 }}>My Proposals</h1>
      {proposals.length === 0 ? <div className="empty-state">You haven't submitted any proposals yet.</div> : (
        <div className="grid grid-2">
          {proposals.map(p => <ProposalCard key={p.id} proposal={p} />)}
        </div>
      )}
    </div>
  )
}
