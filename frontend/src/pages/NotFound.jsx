import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <h1 style={{ fontSize: 64, color: 'var(--navy)' }}>404</h1>
      <p style={{ color: 'var(--text-muted)' }}>Page not found</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  )
}
