import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, FileText, CreditCard, Tag, BarChart3 } from 'lucide-react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import AdminUsers from './Users'
import AdminProjects from './Projects'
import AdminProposals from './Proposals'
import AdminPayments from './Payments'
import AdminOffers from './Offers'
import AdminReports from './Reports'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data.data)).catch(() => {})
  }, [])

  return (
    <div>
      <Navbar />
      <div className="dash-shell">
        <aside className="dash-sidebar">
          <SideLink to="" icon={LayoutDashboard} label="Dashboard" end />
          <SideLink to="users" icon={Users} label="Users" />
          <SideLink to="projects" icon={Briefcase} label="Projects" />
          <SideLink to="proposals" icon={FileText} label="Proposals" />
          <SideLink to="payments" icon={CreditCard} label="Payments" />
          <SideLink to="offers" icon={Tag} label="Offers" />
          <SideLink to="reports" icon={BarChart3} label="Reports" />
        </aside>
        <main className="dash-main">
          <Routes>
            <Route index element={<Overview stats={stats} />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="proposals" element={<AdminProposals />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="reports" element={<AdminReports />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function SideLink({ to, icon: Icon, label, end }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}>
      <Icon size={18} /> {label}
    </NavLink>
  )
}

function Overview({ stats }) {
  if (!stats) return <div className="skeleton" style={{ height: 200 }} />
  const cards = [
    ['Total Users', stats.totalUsers], ['Freelancers', stats.totalFreelancers], ['Clients', stats.totalClients],
    ['Total Projects', stats.totalProjects], ['Active Projects', stats.activeProjects], ['Completed Projects', stats.completedProjects],
    ['Total Proposals', stats.totalProposals], ['Transactions', stats.totalTransactions],
    ['Total Revenue', `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`],
  ]
  return (
    <div>
      <h1 style={{ color: 'var(--navy)', marginBottom: 24 }}>Admin Dashboard</h1>
      <div className="grid grid-3">
        {cards.map(([label, value]) => (
          <div key={label} className="stat-card">
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
