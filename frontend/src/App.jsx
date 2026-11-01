import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import FindFreelancers from './pages/FindFreelancers'
import FreelancerProfile from './pages/FreelancerProfile'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import CreateProject from './pages/CreateProject'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import NotFound from './pages/NotFound'
import FreelancerDashboard from './pages/FreelancerDashboard'
import ClientDashboard from './pages/ClientDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import Workspace from './pages/Workspace'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/find-freelancers" element={<FindFreelancers />} />
      <Route path="/freelancers/:id" element={<FreelancerProfile />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />

      <Route path="/create-project" element={
        <ProtectedRoute allowedRoles={['ROLE_CLIENT']}>
          <CreateProject />
        </ProtectedRoute>
      } />

      <Route path="/freelancer/dashboard/*" element={
        <ProtectedRoute allowedRoles={['ROLE_FREELANCER']}>
          <FreelancerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/client/dashboard/*" element={
        <ProtectedRoute allowedRoles={['ROLE_CLIENT']}>
          <ClientDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/dashboard/*" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/workspace/:projectId" element={
        <ProtectedRoute allowedRoles={['ROLE_CLIENT', 'ROLE_FREELANCER']}>
          <Workspace />
        </ProtectedRoute>
      } />

      {/* Generic aliases used by Navbar/redirects */}
      <Route path="/notifications" element={
        <ProtectedRoute>
          <RedirectToDashboardNotifications />
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

// Small helper so the bell icon in the navbar routes to the right dashboard's Notifications tab
function RedirectToDashboardNotifications() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const path = user.role === 'ROLE_ADMIN' ? '/admin/dashboard'
    : user.role === 'ROLE_FREELANCER' ? '/freelancer/dashboard/notifications'
    : '/client/dashboard/notifications'
  return <Navigate to={path} replace />
}
