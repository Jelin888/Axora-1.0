import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, IndianRupee, Calendar, MessageSquare, Plus } from 'lucide-react'
import Navbar from '../components/Navbar'
import PaymentModal from '../components/PaymentModal'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import UserAvatar from '../components/UserAvatar'

const msClass = { PENDING: 'badge-pending', IN_PROGRESS: 'badge-progress', SUBMITTED: 'badge-open', APPROVED: 'badge-accepted', PAID: 'badge-completed' }
const err = (e, fallback) => toast.error(e.response?.data?.message || fallback)

export default function Workspace() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [contract, setContract] = useState(null)
  const [reviews, setReviews] = useState([])
  const [ms, setMs] = useState({ title: '', amount: '' })
  const [pay, setPay] = useState(null)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await api.get(`/contracts/project/${projectId}`)
      setContract(res.data.data)
      const rv = await api.get(`/projects/${projectId}/reviews`)
      setReviews(rv.data.data)
    } catch (e) { setContract(null) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [projectId])

  if (loading) return <div><Navbar /><div className="container" style={{ padding: 60 }}>Loading...</div></div>
  if (!contract) return <div><Navbar /><div className="container" style={{ padding: 60 }}>Workspace not found (a proposal must be accepted first).</div></div>

  const isClient = user.id === contract.client.id
  const isFreelancer = user.id === contract.freelancer.id
  const other = isClient ? contract.freelancer : contract.client
  const completed = contract.project.status === 'COMPLETED'
  const myReview = reviews.find(r => r.reviewerId === user.id)

  const addMilestone = async (e) => {
    e.preventDefault()
    try { await api.post(`/contracts/${contract.id}/milestones`, ms); setMs({ title: '', amount: '' }); load() } catch (e2) { err(e2, 'Failed to add milestone') }
  }
  const moveMilestone = async (id, status) => {
    try { await api.put(`/milestones/${id}/status`, { status }); load() } catch (e2) { err(e2, 'Not allowed') }
  }
  const setProgress = async (p) => {
    try { await api.put(`/contracts/${contract.id}/progress`, { progressPercent: p }); toast.success('Progress updated'); load() } catch (e2) { err(e2, 'Failed to update progress') }
  }
  const message = async () => {
    try { await api.post('/conversations', { otherUserId: other.id, relatedProjectId: contract.project.id }); navigate(isClient ? '/client/dashboard/messages' : '/freelancer/dashboard/messages') } catch (e2) { err(e2, 'Could not open chat') }
  }
  const submitReview = async (e) => {
    e.preventDefault()
    try { await api.post('/reviews', { projectId: contract.project.id, revieweeId: other.id, ...review }); toast.success('Review submitted'); load() } catch (e2) { err(e2, 'Failed to submit review') }
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '32px 24px', maxWidth: 900 }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <h1 style={{ color: 'var(--navy)', fontSize: 24 }}>{contract.project.title}</h1>
            <span className={`badge ${completed ? 'badge-completed' : 'badge-progress'}`}>{contract.project.status.replace('_', ' ')}</span>
          </div>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: 14, color: 'var(--text-muted)', margin: '12px 0', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserAvatar user={contract.client} size="xs" /> Client: <b>{contract.client.fullName}</b>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserAvatar user={contract.freelancer} size="xs" /> Freelancer: <b>{contract.freelancer.fullName}</b>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IndianRupee size={14} />{Number(contract.project.budget).toLocaleString('en-IN')}</span>
            {contract.project.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} />{contract.project.deadline}</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span>Progress</span><b>{contract.progressPercent}%</b></div>
          <div style={{ height: 10, background: '#E8EDF5', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ width: `${contract.progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--blue-accent), var(--navy))' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {isFreelancer && !completed && [0, 25, 50, 75, 100].map(p => (
              <button key={p} className={contract.progressPercent === p ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'} onClick={() => setProgress(p)}>{p}%</button>
            ))}
            <button className="btn btn-outline btn-sm" onClick={message} style={{ marginLeft: 'auto' }}><MessageSquare size={14} /> Message {other.fullName}</button>
          </div>
        </div>

        <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Milestones</h3>
        {contract.milestones.length === 0 && <div className="empty-state" style={{ padding: 24 }}>No milestones yet.{isClient && ' Add the first one below.'}</div>}
        {contract.milestones.map(m => (
          <div key={m.id} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700 }}>{m.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>₹{Number(m.amount).toLocaleString('en-IN')}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`badge ${msClass[m.status]}`}>{m.status.replace('_', ' ')}</span>
              {isFreelancer && m.status === 'PENDING' && <button className="btn btn-outline btn-sm" onClick={() => moveMilestone(m.id, 'IN_PROGRESS')}>Start</button>}
              {isFreelancer && m.status === 'IN_PROGRESS' && <button className="btn btn-primary btn-sm" onClick={() => moveMilestone(m.id, 'SUBMITTED')}>Submit for review</button>}
              {isClient && m.status === 'SUBMITTED' && <button className="btn btn-primary btn-sm" onClick={() => moveMilestone(m.id, 'APPROVED')}>Approve</button>}
              {isClient && m.status === 'APPROVED' && <button className="btn btn-primary btn-sm" onClick={() => setPay(m)}>Make Payment</button>}
            </div>
          </div>
        ))}

        {isClient && !completed && (
          <form onSubmit={addMilestone} className="card" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginTop: 14 }}>
            <div className="form-group" style={{ flex: 2, minWidth: 180, marginBottom: 0 }}><label>Milestone title</label>
              <input className="form-control" required value={ms.title} onChange={(e) => setMs({ ...ms, title: e.target.value })} placeholder="Frontend development" /></div>
            <div className="form-group" style={{ flex: 1, minWidth: 120, marginBottom: 0 }}><label>Amount (₹)</label>
              <input className="form-control" type="number" min="1" required value={ms.amount} onChange={(e) => setMs({ ...ms, amount: e.target.value })} /></div>
            <button className="btn btn-primary"><Plus size={16} /> Add</button>
          </form>
        )}

        {completed && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Reviews</h3>
            {reviews.map(r => (
              <div key={r.id} className="card" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? '#FBBF24' : 'none'} stroke="#FBBF24" />)}</div>
                <p style={{ fontSize: 14 }}>{r.comment}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>— {r.reviewerName}</p>
              </div>
            ))}
            {!myReview && (
              <form onSubmit={submitReview} className="card">
                <div className="form-group"><label>Rate {other.fullName}</label>
                  <select className="form-control" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                  </select></div>
                <div className="form-group"><label>Review</label>
                  <textarea className="form-control" rows={3} value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} /></div>
                <button className="btn btn-primary">Submit Review</button>
              </form>
            )}
          </div>
        )}
      </div>

      {pay && (
        <PaymentModal project={{ id: contract.project.id, title: contract.project.title }} receiverId={contract.freelancer.id}
          amount={pay.amount} milestoneId={pay.id} onClose={() => setPay(null)} onSuccess={load} />
      )}
    </div>
  )
}
