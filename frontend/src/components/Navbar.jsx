import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, LogOut, LayoutDashboard, ChevronDown, Camera, Settings, User as UserIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/axora-logo-full.png'
import UserAvatar from './UserAvatar'
import ProfilePictureModal from './ProfilePictureModal'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const menuRef = useRef(null)

  const dashboardPath = user?.role === 'ROLE_ADMIN'
    ? '/admin/dashboard'
    : user?.role === 'ROLE_FREELANCER'
      ? '/freelancer/dashboard'
      : '/client/dashboard'

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 10px rgba(11, 31, 58, 0.06)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="AXORA" style={{ height: 56, width: 'auto' }} />
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="nav-desktop">
            <Link to="/find-freelancers" style={navLinkStyle}>Find Freelancers</Link>
            <Link to="/projects" style={navLinkStyle}>Find Projects</Link>
            <Link to="/how-it-works" style={navLinkStyle}>How It Works</Link>
            <Link to="/about" style={navLinkStyle}>About</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }} className="nav-desktop">
            {user ? (
              <>
                <Link
                  to="/notifications"
                  style={{
                    color: 'var(--navy)',
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F1F5F9',
                    transition: 'background 0.15s ease',
                  }}
                  title="Notifications"
                >
                  <Bell size={18} />
                </Link>

                <Link to={dashboardPath} className="btn btn-primary btn-sm">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>

                {/* User Avatar Chip & Dropdown */}
                <div style={{ position: 'relative' }} ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                      background: menuOpen ? '#EEF2FF' : '#F8FAFC',
                      border: '1px solid var(--border)',
                      borderRadius: 24,
                      padding: '4px 10px 4px 4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    title="User account menu"
                  >
                    <UserAvatar user={user} size="sm" showBadge />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.fullName?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} color="var(--text-muted)" style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: 250,
                        background: 'var(--white)',
                        borderRadius: 12,
                        boxShadow: '0 10px 30px rgba(11, 31, 58, 0.15)',
                        border: '1px solid var(--border)',
                        padding: '12px 0',
                        zIndex: 100,
                        animation: 'fadeIn 0.15s ease-out',
                      }}
                    >
                      {/* User Info Header */}
                      <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <UserAvatar user={user} size="md" />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.fullName}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email}
                          </div>
                          <span style={{
                            display: 'inline-block',
                            marginTop: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: '#EEF2FF',
                            color: 'var(--blue-accent)',
                            textTransform: 'uppercase',
                          }}>
                            {user.role?.replace('ROLE_', '')}
                          </span>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div style={{ padding: '6px 0' }}>
                        <button
                          onClick={() => { setMenuOpen(false); setModalOpen(true) }}
                          style={dropdownItemStyle}
                        >
                          <Camera size={16} color="var(--blue-accent)" />
                          <span>Manage Profile & Photo</span>
                        </button>

                        <Link
                          to={dashboardPath}
                          onClick={() => setMenuOpen(false)}
                          style={dropdownItemStyle}
                        >
                          <LayoutDashboard size={16} color="var(--navy)" />
                          <span>Dashboard</span>
                        </Link>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border)', padding: '6px 0 0' }}>
                        <button
                          onClick={() => { setMenuOpen(false); logout(); navigate('/') }}
                          style={{ ...dropdownItemStyle, color: 'var(--danger)' }}
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={navLinkStyle}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>

          <button className="nav-mobile-toggle" onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--navy)' }}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div style={{ background: 'var(--bg-light)', borderTop: '1px solid var(--border)', padding: 16 }} className="nav-mobile-menu">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  <UserAvatar user={user} size="md" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{user.fullName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                </div>
              )}
              <Link to="/find-freelancers" style={navLinkStyle} onClick={() => setOpen(false)}>Find Freelancers</Link>
              <Link to="/projects" style={navLinkStyle} onClick={() => setOpen(false)}>Find Projects</Link>
              <Link to="/how-it-works" style={navLinkStyle} onClick={() => setOpen(false)}>How It Works</Link>
              <Link to="/about" style={navLinkStyle} onClick={() => setOpen(false)}>About</Link>
              {user ? (
                <>
                  <button
                    onClick={() => { setOpen(false); setModalOpen(true) }}
                    className="btn btn-outline btn-sm"
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    <Camera size={16} /> Manage Profile & Photo
                  </button>
                  <Link to={dashboardPath} style={navLinkStyle} onClick={() => setOpen(false)}>Dashboard</Link>
                  <button onClick={() => { logout(); navigate('/'); setOpen(false) }} className="btn btn-outline btn-sm">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" style={navLinkStyle} onClick={() => setOpen(false)}>Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 900px) {
            .nav-desktop { display: none !important; }
            .nav-mobile-toggle { display: block !important; }
          }
        `}</style>
      </header>

      {/* Profile Picture & Settings Modal */}
      <ProfilePictureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

const navLinkStyle = { color: 'var(--navy)', fontSize: 14, fontWeight: 500 }

const dropdownItemStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 16px',
  border: 'none',
  background: 'none',
  textAlign: 'left',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-dark)',
  cursor: 'pointer',
  transition: 'background 0.15s ease',
}
