import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('axora_user')
    const token = localStorage.getItem('axora_token')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('axora_user')
      }
    }
    // Refresh user data from server in background if token exists
    if (token) {
      api.get('/users/me')
        .then((res) => {
          if (res.data?.data) {
            const fresh = {
              id: res.data.data.id,
              fullName: res.data.data.fullName,
              email: res.data.data.email,
              role: res.data.data.role,
              profilePhotoUrl: res.data.data.profilePhotoUrl || null,
              phone: res.data.data.phone || null,
            }
            setUser(fresh)
            localStorage.setItem('axora_user', JSON.stringify(fresh))
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const updateUser = (partial) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      localStorage.setItem('axora_user', JSON.stringify(next))
      return next
    })
  }

  const refreshUser = async () => {
    try {
      const res = await api.get('/users/me')
      if (res.data?.data) {
        const fresh = {
          id: res.data.data.id,
          fullName: res.data.data.fullName,
          email: res.data.data.email,
          role: res.data.data.role,
          profilePhotoUrl: res.data.data.profilePhotoUrl || null,
          phone: res.data.data.phone || null,
        }
        setUser(fresh)
        localStorage.setItem('axora_user', JSON.stringify(fresh))
        return fresh
      }
    } catch {
      // ignore
    }
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data.data
    const userObj = {
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      profilePhotoUrl: data.profilePhotoUrl || null,
    }
    localStorage.setItem('axora_token', data.token)
    localStorage.setItem('axora_user', JSON.stringify(userObj))
    setUser(userObj)
    toast.success(`Welcome back, ${data.fullName}!`)
    return userObj
  }

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload)
    const data = res.data.data
    const userObj = {
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      profilePhotoUrl: data.profilePhotoUrl || null,
    }
    localStorage.setItem('axora_token', data.token)
    localStorage.setItem('axora_user', JSON.stringify(userObj))
    setUser(userObj)
    toast.success('Account created successfully!')
    return userObj
  }

  const logout = () => {
    localStorage.removeItem('axora_token')
    localStorage.removeItem('axora_user')
    setUser(null)
    toast.info('You have been logged out')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
