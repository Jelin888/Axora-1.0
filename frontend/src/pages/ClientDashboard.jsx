import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { LayoutDashboard, Briefcase, FileText, MessageSquare, CreditCard, Bell, Plus, Camera } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import UserAvatar from '../components/UserAvatar'
import ProfilePictureModal from '../components/ProfilePictureModal'
import { SideLink, Stat } from './FreelancerDashboard'
import Messages from './Messages'
import Payments from './Payments'
import Notifications from './Notifications'
import Workspaces from './Workspaces'
import ProjectCard from '../components/ProjectCard'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/projects', { params: { size: 50 } })
        setProjects(res.data.data.content.filter(p => p.clientId === user.id))
      } catch (e) {}
    })()
  }, [])

  const active = projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'OPEN').length
  const completed = projects.filter(p => p.status === 'COMPLETED').length
  const totalProposals = projects.reduce((s, p) => s + (p.proposalCount || 0), 0)

  return (
    <div>
      <Navbar />
      <div className="dash-shell">
        <aside className="dash-sidebar">
          <SideLink to="" icon={LayoutDashboard} label="Overview" end />
          <SideLink to="projects" icon={Briefcase} label="My Projects" />
          <SideLink to="workspaces" icon={FileText} label="Workspaces" />
          <SideLink to="messages" icon={MessageSquare} label="Messages" />
          <SideLink to="payments" icon={CreditCard} label="Payments" />
          <SideLink to="notifications" icon={Bell} label="Notifications" />
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              color: 'var(--navy)',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              borderRadius: 8,
              marginTop: 10,
              transition: 'background 0.15s ease',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <Camera size={18} color="var(--blue-accent)" />
            <span>Profile & Photo</span>
          </button>
        </aside>
        <main className="dash-main">
          <Routes>
            <Route index element={
              <div>
                {/* Client Welcome Profile Banner */}
                <div
                  className="card"
                  style={{
                    marginBottom: 28,
                    background: 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 20,
                    padding: 24,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <UserAvatar
                      user={user}
                      size="2xl"
                      editable
                      onEdit={() => setModalOpen(true)}
                      showBadge
                      badgeRole={user.role}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h1 style={{ color: 'var(--navy)', fontSize: 24, margin: 0 }}>Welcome, {user.fullName}</h1>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 20,
                          background: '#DCFCE7',
                          color: '#15803D',
                          textTransform: 'uppercase',
                        }}>
                          Client
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
                        {user.email} · Post projects, evaluate proposals, and manage hires.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Camera size={15} color="var(--blue-accent)" /> Photo & Profile
                    </button>
                    <Link to="/create-project" className="btn btn-primary btn-sm">
                      <Plus size={16} /> Post Project
                    </Link>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Manage your projects and proposals.</p>
                <div className="grid grid-4" style={{ marginBottom: 32 }}>
                  <Stat label="Posted Projects" value={projects.length} />
                  <Stat label="Active Projects" value={active} />
                  <Stat label="Completed Projects" value={completed} />
                  <Stat label="Received Proposals" value={totalProposals} />
                </div>
                <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Recent Projects</h3>
                <div className="grid grid-2">
                  {projects.slice(0, 4).map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
              </div>
            } />
            <Route path="projects" element={
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h1 style={{ color: 'var(--navy)' }}>My Projects</h1>
                  <Link to="/create-project" className="btn btn-primary btn-sm"><Plus size={16} /> Post Project</Link>
                </div>
                <div className="grid grid-2">
                  {projects.length === 0 ? <div className="empty-state">No projects posted yet.</div> :
                    projects.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
              </div>
            } />
            <Route path="workspaces" element={<Workspaces />} />
            <Route path="messages" element={<Messages />} />
            <Route path="payments" element={<Payments />} />
            <Route path="notifications" element={<Notifications />} />
          </Routes>
        </main>
      </div>

      <ProfilePictureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
