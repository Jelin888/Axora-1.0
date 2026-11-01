import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function CreateProject() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', requiredSkills: '', categoryId: '', budget: '', deadline: '', projectType: 'FIXED_PRICE'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data)).catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/projects', { ...form, categoryId: form.categoryId || null })
      toast.success('Project posted successfully!')
      navigate(`/projects/${res.data.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post project')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '40px 24px', maxWidth: 700 }}>
        <h1 style={{ color: 'var(--navy)', marginBottom: 24 }}>Post a New Project</h1>
        <form onSubmit={submit} className="card">
          <div className="form-group">
            <label>Project Title</label>
            <input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Build an E-Commerce Website" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" rows={5} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Required Skills (comma-separated)</label>
            <input className="form-control" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} placeholder="React, Spring Boot, MySQL" />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Project Type</label>
              <select className="form-control" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })}>
                <option value="FIXED_PRICE">Fixed Price</option>
                <option value="HOURLY">Hourly</option>
              </select>
            </div>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Budget (₹)</label>
              <input className="form-control" type="number" required value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input className="form-control" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Posting...' : 'Post Project'}</button>
        </form>
      </div>
      <Footer />
    </div>
  )
}
