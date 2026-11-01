import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function HowItWorks() {
  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--navy)', marginBottom: 16 }}>How AXORA Works</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
          AXORA makes it simple for freelancers and clients to connect, collaborate, and get work done —
          from creating a profile to getting paid securely via UPI. Register today to get started.
        </p>
      </div>
      <Footer />
    </div>
  )
}
