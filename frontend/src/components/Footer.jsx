import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/axora-logo.png'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy-dark)', color: '#B9C6DC', padding: '48px 0 24px' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <img src={logo} alt="AXORA" style={{ height: 28 }} />
              <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>AXORA</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Connect. Create. Collaborate.</p>
          </div>
          <div>
            <h4 style={footerHeading}>Marketplace</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><Link to="/find-freelancers" style={footerLink}>Find Freelancers</Link></li>
              <li><Link to="/projects" style={footerLink}>Find Projects</Link></li>
              <li><Link to="/how-it-works" style={footerLink}>How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={footerHeading}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><Link to="/about" style={footerLink}>About Us</Link></li>
              <li><Link to="/register" style={footerLink}>Join AXORA</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={footerHeading}>Account</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><Link to="/login" style={footerLink}>Login</Link></li>
              <li><Link to="/register" style={footerLink}>Register</Link></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, fontSize: 12, textAlign: 'center' }}>
          © {new Date().getFullYear()} AXORA. All rights reserved. Built for freelancers and businesses worldwide.
        </div>
      </div>
    </footer>
  )
}

const footerHeading = { color: 'white', fontSize: 14, fontWeight: 700, marginBottom: 12 }
const footerLink = { fontSize: 13, color: '#B9C6DC' }
