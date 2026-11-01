import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, MapPin, IndianRupee, Github, Linkedin, Globe, Briefcase, Camera } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PortfolioCard from '../components/PortfolioCard'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import UserAvatar from '../components/UserAvatar'
import ProfilePictureModal from '../components/ProfilePictureModal'

export default function FreelancerProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [freelancer, setFreelancer] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const isOwner = user?.id === freelancer?.userId

  const loadData = async () => {
    try {
      const res = await api.get(`/freelancers/${id}`)
      setFreelancer(res.data.data)
      const pf = await api.get(`/portfolio/freelancer/${res.data.data.userId}`)
      setPortfolio(pf.data.data)
      const rv = await api.get(`/users/${res.data.data.userId}/reviews`)
      setReviews(rv.data.data)
    } catch (e) { /* not found */ } finally { setLoading(false) }
  }

  useEffect(() => {
    loadData()
  }, [id])

  if (loading) return <div className="container" style={{ padding: 60 }}>Loading...</div>
  if (!freelancer) return <div className="container" style={{ padding: 60 }}>Freelancer not found.</div>

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="card" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <UserAvatar
            user={freelancer}
            size="2xl"
            showBadge
            badgeRole="ROLE_FREELANCER"
            editable={isOwner}
            onEdit={() => setModalOpen(true)}
          />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ color: 'var(--navy)', margin: 0 }}>{freelancer.fullName}</h1>
              {isOwner && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Camera size={14} color="var(--blue-accent)" /> Change Photo
                </button>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 10, marginTop: 4 }}>{freelancer.professionalTitle}</p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={15} fill="#FBBF24" stroke="#FBBF24" /> {freelancer.averageRating?.toFixed(1) || 'New'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={15} /> {freelancer.location || 'Remote'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IndianRupee size={15} /> {freelancer.hourlyRate}/hr</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={15} /> {freelancer.completedProjects} projects</span>
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
              {freelancer.githubUrl && <a href={freelancer.githubUrl} target="_blank" rel="noreferrer"><Github size={18} color="var(--navy)" /></a>}
              {freelancer.linkedinUrl && <a href={freelancer.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin size={18} color="var(--navy)" /></a>}
              {freelancer.websiteUrl && <a href={freelancer.websiteUrl} target="_blank" rel="noreferrer"><Globe size={18} color="var(--navy)" /></a>}
            </div>
          </div>
        </div>

        {freelancer.bio && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ color: 'var(--navy)', marginBottom: 10 }}>About</h3>
            <p style={{ color: 'var(--text-dark)', lineHeight: 1.6 }}>{freelancer.bio}</p>
          </div>
        )}

        {freelancer.skills && freelancer.skills.length > 0 && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ color: 'var(--navy)', marginBottom: 10 }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[...freelancer.skills].map((s, i) => (
                <span key={i} style={{ fontSize: 12, background: '#EEF2FF', color: 'var(--navy)', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        <h3 style={{ color: 'var(--navy)', marginBottom: 16 }}>Portfolio</h3>
        {portfolio.length === 0 ? (
          <div className="empty-state" style={{ marginBottom: 24 }}>No portfolio projects yet.</div>
        ) : (
          <div className="grid grid-3" style={{ marginBottom: 24 }}>
            {portfolio.map(p => <PortfolioCard key={p.id} item={p} />)}
          </div>
        )}

        <h3 style={{ color: 'var(--navy)', marginBottom: 16 }}>Reviews</h3>
        {reviews.length === 0 ? (
          <div className="empty-state">No reviews yet.</div>
        ) : (
          <div className="grid grid-2">
            {reviews.map(r => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? '#FBBF24' : 'none'} stroke="#FBBF24" />)}
                </div>
                <p style={{ fontSize: 14, marginBottom: 8 }}>{r.comment}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {r.reviewerName}, on "{r.projectTitle}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <ProfilePictureModal isOpen={modalOpen} onClose={() => { setModalOpen(false); loadData(); }} />
      <Footer />
    </div>
  )
}
