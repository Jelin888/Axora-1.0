import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, FileText, MessageSquare, CreditCard, Bell, Briefcase, Camera } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import UserAvatar from '../components/UserAvatar'
import ProfilePictureModal from '../components/ProfilePictureModal'
import Portfolio from './Portfolio'
import Proposals from './Proposals'
import Messages from './Messages'
import Payments from './Payments'
import Notifications from './Notifications'
import Workspaces from './Workspaces'

export default function FreelancerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ proposals: [], payments: [], contracts: [] })
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const p = await api.get('/proposals/my')
        const pay = await api.get('/payments/my')
        const c = await api.get('/contracts/my')
        setStats({ proposals: p.data.data, payments: pay.data.data, contracts: c.data.data })
      } catch (e) {}
    })()
  }, [])

  const active = stats.contracts.filter(c => c.project.status === 'IN_PROGRESS').length
  const completed = stats.contracts.filter(c => c.project.status === 'COMPLETED').length
  const pending = stats.proposals.filter(p => p.status === 'PENDING').length
  const earnings = stats.payments.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div>
      <Navbar />
      <div className="dash-shell">
        <aside className="dash-sidebar">
          <SideLink to="" icon={LayoutDashboard} label="Overview" end />
          <SideLink to="portfolio" icon={FolderOpen} label="Portfolio" />
          <SideLink to="proposals" icon={FileText} label="Proposals" />
          <SideLink to="workspaces" icon={Briefcase} label="Workspaces" />
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
            className="sidebar-profile-btn"
          >
            <Camera size={18} color="var(--blue-accent)" />
            <span>Profile & Photo</span>
          </button>
        </aside>
        <main className="dash-main">
          <Routes>
            <Route index element={
              <div>
                {/* User Welcome Profile Banner */}
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
                          background: '#EEF2FF',
                          color: 'var(--blue-accent)',
                          textTransform: 'uppercase',
                        }}>
                          Freelancer
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
                        {user.email} · Manage your proposals, contracts, and earnings.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Camera size={15} color="var(--blue-accent)" /> Change Photo & Profile
                  </button>
                </div>

                <div className="grid grid-4" style={{ marginBottom: 32 }}>
                  <Stat label="Pending Proposals" value={pending} />
                  <Stat label="Active Projects" value={active} />
                  <Stat label="Completed Projects" value={completed} />
                  <Stat label="Total Earnings" value={`₹${earnings.toLocaleString('en-IN')}`} />
                </div>
                <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Recent Proposals</h3>
                {stats.proposals.slice(0, 5).map(p => (
                  <div key={p.id} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{p.projectTitle}</span>
                    <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            } />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="proposals" element={<Proposals />} />
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

export function SideLink({ to, icon: Icon, label, end }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}>
      <Icon size={18} /> {label}
    </NavLink>
  )
}

export function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
