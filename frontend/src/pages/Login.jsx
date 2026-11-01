import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import logo from '../assets/axora-logo.png'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (evt) => {
    evt.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      const dest = user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : user.role === 'ROLE_FREELANCER' ? '/freelancer/dashboard' : '/client/dashboard'
      navigate(dest)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)', padding: 20 }}>
      <div className="card" style={{ width: 420, maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={logo} alt="AXORA" style={{ height: 44, marginBottom: 8 }} />
          <h2 style={{ color: 'var(--navy)' }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Login to your AXORA account</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 18, color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--blue-accent)', fontWeight: 600 }}>Register</Link>
        </p>
        <div style={{ marginTop: 18, padding: 12, background: '#F8FAFC', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          Demo accounts (local dev only): <br />
          jelinjelin888@gmail.com / Jelin@_@888 · john@axora.com / Freelancer@123 · client1@axora.com / Client@123
        </div>
      </div>
    </div>
  )
}
