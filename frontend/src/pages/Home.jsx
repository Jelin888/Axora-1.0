import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import { Users, Briefcase, MessageSquare, FolderOpen, ShieldCheck, FileText, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { icon: Users, title: 'Freelancer Marketplace', desc: 'Browse thousands of skilled freelancers across every category.' },
  { icon: Briefcase, title: 'Project Marketplace', desc: 'Post projects and receive proposals from qualified talent.' },
  { icon: MessageSquare, title: 'Real-Time Messaging', desc: 'Chat directly with clients and freelancers via AXORA Messenger.' },
  { icon: FolderOpen, title: 'Portfolio Showcase', desc: 'Freelancers showcase completed work to win more projects.' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Pay safely via UPI with full transaction transparency.' },
  { icon: FileText, title: 'Proposal Management', desc: 'Track, accept and manage proposals in one clean dashboard.' },
]

export default function Home() {
  const [offers, setOffers] = useState([])
  useEffect(() => { api.get('/offers').then(r => setOffers(r.data.data)).catch(() => {}) }, [])
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)',
        color: 'white', padding: '90px 0 100px', textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 44, fontWeight: 800, maxWidth: 760, margin: '0 auto 20px', lineHeight: 1.2 }}>
            Where Talent Meets Opportunity
          </h1>
          <p style={{ fontSize: 17, color: '#C4D3EA', maxWidth: 620, margin: '0 auto 36px', lineHeight: 1.6 }}>
            AXORA connects skilled freelancers with clients looking for the right talent to bring their ideas to life.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/find-freelancers" className="btn btn-white">Find a Freelancer <ArrowRight size={16} /></Link>
            <Link to="/register" className="btn btn-primary">Post a Project <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {offers.length > 0 && (
        <section style={{ padding: '40px 0 0' }}>
          <div className="container grid grid-2">
            {offers.slice(0, 2).map(o => (
              <div key={o.id} className="card" style={{ borderLeft: '4px solid var(--blue-accent)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue-accent)', letterSpacing: 1 }}>{o.title}</div>
                <p style={{ margin: '6px 0', fontSize: 15 }}>{o.description}</p>
                {o.endDate && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Valid until {o.endDate}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, color: 'var(--navy)', marginBottom: 12 }}>Everything you need to succeed</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 48 }}>A complete toolkit for freelancers and clients alike.</p>
          <div className="grid grid-3">
            {features.map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'left' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, background: '#EEF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                }}>
                  <f.icon size={22} color="var(--navy)" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--navy)' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, color: 'var(--navy)', marginBottom: 48 }}>How It Works</h2>
          <div className="grid grid-2">
            <HowItWorks title="For Freelancers" steps={['Create Profile', 'Showcase Portfolio', 'Find Projects', 'Send Proposal', 'Work With Clients', 'Get Paid']} />
            <HowItWorks title="For Clients" steps={['Create Account', 'Post Project', 'Receive Proposals', 'Choose Freelancer', 'Collaborate', 'Make Payment']} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function HowItWorks({ title, steps }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', background: 'var(--navy)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0
              }}>{i + 1}</div>
              {i < steps.length - 1 && <div style={{ width: 2, height: 24, background: 'var(--border)' }} />}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, paddingBottom: i < steps.length - 1 ? 24 : 0 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
