import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import api from '../services/api'
import PortfolioCard from '../components/PortfolioCard'
import { toast } from 'react-toastify'

const empty = { title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveDemoUrl: '', completionDate: '', category: '' }

export default function Portfolio() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const res = await api.get('/portfolio/my')
      setItems(res.data.data)
    } catch (e) {}
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/portfolio/${editingId}`, form)
        toast.success('Portfolio project updated')
      } else {
        await api.post('/portfolio', form)
        toast.success('Portfolio project added')
      }
      setForm(empty); setShowForm(false); setEditingId(null); load()
    } catch (err) {
      toast.error('Failed to save portfolio project')
    }
  }

  const onEdit = (item) => { setForm(item); setEditingId(item.id); setShowForm(true) }
  const onDelete = async (id) => {
    try { await api.delete(`/portfolio/${id}`); toast.success('Deleted'); load() } catch (e) { toast.error('Failed to delete') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ color: 'var(--navy)' }}>My Portfolio</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(empty) }}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card" style={{ marginBottom: 24 }}>
          <div className="grid grid-2">
            <div className="form-group"><label>Title</label>
              <input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label>Category</label>
              <input className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Description</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-group"><label>Technologies (comma-separated)</label>
            <input className="form-control" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} /></div>
          <div className="grid grid-2">
            <div className="form-group"><label>GitHub URL</label>
              <input className="form-control" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} /></div>
            <div className="form-group"><label>Live Demo URL</label>
              <input className="form-control" value={form.liveDemoUrl} onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Image URL</label>
            <input className="form-control" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
          <button className="btn btn-primary">{editingId ? 'Update' : 'Add'} Project</button>
        </form>
      )}

      {items.length === 0 ? <div className="empty-state">No portfolio projects yet. Add your first one!</div> : (
        <div className="grid grid-3">
          {items.map(item => <PortfolioCard key={item.id} item={item} editable onEdit={onEdit} onDelete={onDelete} />)}
        </div>
      )}
    </div>
  )
}
