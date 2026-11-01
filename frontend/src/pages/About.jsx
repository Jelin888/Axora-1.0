import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--navy)', marginBottom: 16 }}>About AXORA</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          AXORA is a professional marketplace platform built to help freelancers and businesses connect,
          collaborate and grow. Our mission is to make freelancing simple, secure and rewarding for everyone involved.
        </p>
      </div>
      <Footer />
    </div>
  )
}
