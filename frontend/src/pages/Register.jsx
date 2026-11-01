import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import logo from '../assets/axora-logo.png'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'FREELANCER' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.fullName) e.fullName = 'Full name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      e.password = 'Password must be at least 8 characters with at least 1 letter and 1 number'
    }
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (evt) => {
    evt.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await register(form)
      const dest = user.role === 'ROLE_FREELANCER' ? '/freelancer/dashboard' : '/client/dashboard'
      navigate(dest)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)', padding: 20 }}>
      <div className="card" style={{ width: 460, maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={logo} alt="AXORA" style={{ height: 44, marginBottom: 8 }} />
          <h2 style={{ color: 'var(--navy)' }}>Create your account</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Join AXORA as a freelancer or client</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input className="form-control" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>I am a...</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['FREELANCER', 'CLIENT'].map(r => (
                <button type="button" key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={form.role === r ? 'btn btn-primary btn-full' : 'btn btn-outline btn-full'}>
                  {r === 'FREELANCER' ? 'Freelancer' : 'Client'}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 18, color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--blue-accent)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
