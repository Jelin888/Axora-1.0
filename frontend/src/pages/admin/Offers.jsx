import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import api from '../../services/api'
import { toast } from 'react-toastify'

const empty = { title: '', description: '', imageUrl: '', startDate: '', endDate: '', status: 'ACTIVE' }

export default function AdminOffers() {
  const [offers, setOffers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)

  useEffect(() => { load() }, [])
  const load = () => api.get('/admin/offers').then(res => setOffers(res.data.data)).catch(() => {})

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/offers', form)
      toast.success('Offer created')
      setForm(empty); setShowForm(false); load()
    } catch (err) { toast.error('Failed to create offer') }
  }

  const remove = async (id) => {
    try { await api.delete(`/admin/offers/${id}`); toast.success('Offer deleted'); load() } catch (e) {}
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ color: 'var(--navy)' }}>Offers & Promotions</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}><Plus size={16} /> New Offer</button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="card" style={{ marginBottom: 24 }}>
          <div className="form-group"><label>Title</label>
            <input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-group"><label>Description</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-2">
            <div className="form-group"><label>Start Date</label>
              <input className="form-control" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
            <div className="form-group"><label>End Date</label>
              <input className="form-control" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
          </div>
          <button className="btn btn-primary">Create Offer</button>
        </form>
      )}
      <div className="grid grid-3">
        {offers.map(o => (
          <div key={o.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <h4 style={{ color: 'var(--navy)' }}>{o.title}</h4>
              <span className={`badge ${o.status === 'ACTIVE' ? 'badge-completed' : 'badge-pending'}`}>{o.status}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{o.description}</p>
            <button className="btn btn-outline btn-sm" onClick={() => remove(o.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
