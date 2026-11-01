import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FreelancerCard from '../components/FreelancerCard'
import api from '../services/api'

export default function FindFreelancers() {
  const [freelancers, setFreelancers] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => { load() }, [page])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/freelancers', { params: { keyword: keyword || undefined, page, size: 9 } })
      setFreelancers(res.data.data.content)
      setTotalPages(res.data.data.totalPages)
    } catch (e) {
      setFreelancers([])
    } finally {
      setLoading(false)
    }
  }

  const onSearch = (e) => {
    e.preventDefault()
    setPage(0)
    load()
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ color: 'var(--navy)', marginBottom: 6 }}>Find Freelancers</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Search skilled freelancers across every category.</p>

        <form onSubmit={onSearch} style={{ display: 'flex', gap: 10, marginBottom: 32, maxWidth: 500 }}>
          <input className="form-control" placeholder="Search by name or title..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <button className="btn btn-primary"><Search size={16} /></button>
        </form>

        {loading ? (
          <div className="grid grid-3">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 260 }} />)}
          </div>
        ) : freelancers.length === 0 ? (
          <div className="empty-state">No freelancers found. Try a different search.</div>
        ) : (
          <>
            <div className="grid grid-3">
              {freelancers.map(f => <FreelancerCard key={f.id} freelancer={f} />)}
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
