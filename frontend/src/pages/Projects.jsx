import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProjectCard from '../components/ProjectCard'
import api from '../services/api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => { load() }, [page, status])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/projects', { params: { keyword: keyword || undefined, status: status || undefined, page, size: 9 } })
      setProjects(res.data.data.content)
      setTotalPages(res.data.data.totalPages)
    } catch (e) {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const onSearch = (e) => { e.preventDefault(); setPage(0); load() }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ color: 'var(--navy)', marginBottom: 6 }}>Find Projects</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Browse client projects and submit proposals.</p>

        <form onSubmit={onSearch} style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
          <input className="form-control" style={{ maxWidth: 320 }} placeholder="Search projects..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <select className="form-control" style={{ maxWidth: 200 }} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button className="btn btn-primary"><Search size={16} /></button>
        </form>

        {loading ? (
          <div className="grid grid-3">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220 }} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">No projects found.</div>
        ) : (
          <>
            <div className="grid grid-3">
              {projects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 32 }}>
                <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
                <span style={{ alignSelf: 'center', fontSize: 13 }}>Page {page + 1} of {totalPages}</span>
                <button className="btn btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
