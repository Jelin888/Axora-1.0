import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IndianRupee, Calendar, Briefcase } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProposalCard from '../components/ProposalCard'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function ProjectDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [proposals, setProposals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ coverLetter: '', proposedAmount: '', estimatedDeliveryDays: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [id])

  const load = async () => {
    try {
      const res = await api.get(`/projects/${id}`)
      setProject(res.data.data)
      if (user && user.id === res.data.data.clientId) {
        const pr = await api.get(`/projects/${id}/proposals`)
        setProposals(pr.data.data)
      }
    } catch (e) { /* not found */ } finally { setLoading(false) }
  }

  const submitProposal = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/projects/${id}/proposals`, form)
      toast.success('Proposal submitted successfully')
      setShowForm(false)
      setForm({ coverLetter: '', proposedAmount: '', estimatedDeliveryDays: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit proposal')
    }
  }

  const acceptProposal = async (proposalId) => {
    try {
      await api.put(`/proposals/${proposalId}/accept`)
      toast.success('Proposal accepted')
      load()
    } catch (e) { toast.error('Failed to accept proposal') }
  }

  const rejectProposal = async (proposalId) => {
    try {
      await api.put(`/proposals/${proposalId}/reject`)
      toast.info('Proposal rejected')
      load()
    } catch (e) { toast.error('Failed to reject proposal') }
  }

  if (loading) return <div className="container" style={{ padding: 60 }}>Loading...</div>
  if (!project) return <div className="container" style={{ padding: 60 }}>Project not found.</div>

  const isOwner = user && user.id === project.clientId
  const isFreelancer = user && user.role === 'ROLE_FREELANCER'

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '40px 24px', maxWidth: 900 }}>
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ color: 'var(--navy)' }}>{project.title}</h1>
            <span className={`badge ${{ OPEN: 'badge-open', IN_PROGRESS: 'badge-progress', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled' }[project.status]}`}>{project.status?.replace('_', ' ')}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>Posted by {project.clientName}</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20, fontSize: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IndianRupee size={16} /> ₹{Number(project.budget).toLocaleString('en-IN')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={16} /> {project.deadline}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Briefcase size={16} /> {project.projectType?.replace('_', ' ')}</span>
          </div>
          <h3 style={{ color: 'var(--navy)', marginBottom: 8 }}>Description</h3>
          <p style={{ lineHeight: 1.7, marginBottom: 20 }}>{project.description}</p>
          {project.requiredSkills && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {project.requiredSkills.split(',').map((s, i) => (
                <span key={i} style={{ fontSize: 12, background: '#EEF2FF', color: 'var(--navy)', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>{s.trim()}</span>
              ))}
            </div>
          )}

          {(isOwner || isFreelancer) && project.status !== 'OPEN' && project.status !== 'CANCELLED' && (
            <button className="btn btn-outline" style={{ marginTop: 24, marginRight: 10 }} onClick={() => navigate(`/workspace/${project.id}`)}>Open Workspace</button>
          )}

          {isFreelancer && project.status === 'OPEN' && (
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Submit Proposal'}
            </button>
          )}

          {showForm && (
            <form onSubmit={submitProposal} className="card" style={{ marginTop: 20, background: '#FAFBFD' }}>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea className="form-control" rows={4} required value={form.coverLetter}
                  onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} placeholder="I have experience building similar applications..." />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Proposed Amount (₹)</label>
                  <input className="form-control" type="number" required value={form.proposedAmount}
                    onChange={(e) => setForm({ ...form, proposedAmount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Estimated Delivery (days)</label>
                  <input className="form-control" type="number" value={form.estimatedDeliveryDays}
                    onChange={(e) => setForm({ ...form, estimatedDeliveryDays: e.target.value })} />
                </div>
              </div>
              <button className="btn btn-primary btn-full">Submit Proposal</button>
            </form>
          )}
        </div>

        {isOwner && (
          <>
            <h3 style={{ color: 'var(--navy)', marginBottom: 16 }}>Proposals ({proposals.length})</h3>
            {proposals.length === 0 ? (
              <div className="empty-state">No proposals yet.</div>
            ) : (
              <div className="grid grid-2">
                {proposals.map(p => (
                  <ProposalCard key={p.id} proposal={p} showActions onAccept={acceptProposal} onReject={rejectProposal} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
