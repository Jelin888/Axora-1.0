import React, { useState, useRef } from 'react'
import {
  X,
  Upload,
  Camera,
  Trash2,
  Check,
  ZoomIn,
  ZoomOut,
  Sparkles,
  User,
  Phone,
  Mail,
  Shield,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { toast } from 'react-toastify'
import UserAvatar from './UserAvatar'
import { AVATAR_PRESETS } from '../utils/avatarPresets'

export default function ProfilePictureModal({ isOpen, onClose }) {
  const { user, updateUser, refreshUser } = useAuth()

  const [activeTab, setActiveTab] = useState('upload') // 'upload' | 'presets' | 'details'
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [presetCategory, setPresetCategory] = useState('All')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  // Profile details state
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [detailsLoading, setDetailsLoading] = useState(false)

  const fileInputRef = useRef(null)

  if (!isOpen) return null

  // File selection & validation
  const handleFileChange = (file) => {
    if (!file) return

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, WEBP, and GIF images are allowed')
      return
    }

    setSelectedFile(file)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setZoom(1)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  // Upload custom photo
  const handleSaveUpload = async () => {
    if (!selectedFile) return
    setLoading(true)

    const formData = new FormData()
    formData.append('photo', selectedFile)

    try {
      const res = await api.post('/users/me/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data?.success) {
        updateUser(res.data.data.user || { profilePhotoUrl: res.data.data.profilePhotoUrl })
        await refreshUser()
        toast.success('Profile picture updated successfully!')
        handleClose()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload profile picture')
    } finally {
      setLoading(false)
    }
  }

  // Save selected preset
  const handleSavePreset = async () => {
    if (!selectedPreset) return
    setLoading(true)

    try {
      const res = await api.put('/users/me', { profilePhotoUrl: selectedPreset })
      if (res.data?.success) {
        updateUser(res.data.data || { profilePhotoUrl: selectedPreset })
        await refreshUser()
        toast.success('Avatar preset applied successfully!')
        handleClose()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set avatar preset')
    } finally {
      setLoading(false)
    }
  }

  // Remove photo
  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture and reset to initials?')) {
      return
    }
    setLoading(true)

    try {
      const res = await api.delete('/users/me/photo')
      if (res.data?.success) {
        updateUser(res.data.data.user || { profilePhotoUrl: null })
        await refreshUser()
        setSelectedFile(null)
        setPreviewUrl(null)
        setSelectedPreset(null)
        toast.info('Profile picture removed')
        handleClose()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove profile picture')
    } finally {
      setLoading(false)
    }
  }

  // Save profile info (name, phone)
  const handleSaveDetails = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      toast.error('Full name cannot be empty')
      return
    }

    setDetailsLoading(true)
    try {
      const res = await api.put('/users/me', {
        fullName: fullName.trim(),
        phone: phone.trim() || null,
      })
      if (res.data?.success) {
        updateUser(res.data.data)
        await refreshUser()
        toast.success('Profile details updated!')
        handleClose()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleClose = () => {
    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setSelectedPreset(null)
    onClose()
  }

  // Preset categories filter
  const categories = ['All', 'Modern', 'Minimalist', 'Tech / AI', 'Playful']
  const filteredPresets = presetCategory === 'All'
    ? AVATAR_PRESETS
    : AVATAR_PRESETS.filter((p) => p.category === presetCategory)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(7, 20, 38, 0.65)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(11, 31, 58, 0.25)',
          width: '100%',
          maxWidth: 620,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAFBFD',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--blue-accent), var(--navy))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Camera size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                Profile Picture & Settings
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                Personalize how you appear across AXORA
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Avatar Summary Bar */}
        <div
          style={{
            padding: '14px 24px',
            background: '#F8FAFC',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <UserAvatar user={user} size="lg" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {user?.profilePhotoUrl ? 'Custom photo active' : 'Initial avatar active'} ·{' '}
                <span style={{ textTransform: 'capitalize' }}>
                  {user?.role?.replace('ROLE_', '').toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {user?.profilePhotoUrl && (
            <button
              onClick={handleRemovePhoto}
              disabled={loading}
              className="btn btn-outline btn-sm"
              style={{
                color: 'var(--danger)',
                borderColor: '#FCA5A5',
                fontSize: 12,
                padding: '6px 12px',
              }}
              title="Remove custom photo and reset to initials"
            >
              <Trash2 size={14} /> Remove Photo
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            background: 'var(--white)',
            padding: '0 24px',
            gap: 24,
          }}
        >
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 4px',
              border: 'none',
              background: 'none',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              color: activeTab === 'upload' ? 'var(--blue-accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'upload' ? '2.5px solid var(--blue-accent)' : '2.5px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <Upload size={16} /> Upload Photo
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 4px',
              border: 'none',
              background: 'none',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              color: activeTab === 'presets' ? 'var(--blue-accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'presets' ? '2.5px solid var(--blue-accent)' : '2.5px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={16} /> Avatar Presets
          </button>

          <button
            onClick={() => setActiveTab('details')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 4px',
              border: 'none',
              background: 'none',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              color: activeTab === 'details' ? 'var(--blue-accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'details' ? '2.5px solid var(--blue-accent)' : '2.5px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={16} /> Edit Info
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: UPLOAD PHOTO */}
          {activeTab === 'upload' && (
            <div>
              {!previewUrl ? (
                /* Dropzone View */
                <div>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: isDragging ? '2px dashed var(--blue-accent)' : '2px dashed #CBD5E1',
                      borderRadius: 14,
                      padding: '40px 24px',
                      textAlign: 'center',
                      background: isDragging ? '#EEF2FF' : '#F8FAFC',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                    />

                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: '#EEF2FF',
                        color: 'var(--blue-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <Upload size={28} />
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
                      Click to upload, or drag & drop image
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 16px' }}>
                      PNG, JPG, WEBP, or GIF (max. 5MB)
                    </p>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      <ImageIcon size={15} /> Select Image from Device
                    </button>
                  </div>

                  <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                    <Shield size={16} color="var(--success)" />
                    <span>Photos are automatically centered, cropped, and optimized for fast display.</span>
                  </div>
                </div>
              ) : (
                /* Preview & Zoom Adjuster View */
                <div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 20,
                      padding: '16px 0',
                    }}
                  >
                    {/* Circular Cropping Frame Viewport */}
                    <div
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid var(--white)',
                        boxShadow: '0 8px 24px rgba(11, 31, 58, 0.15), 0 0 0 3px var(--blue-accent)',
                        position: 'relative',
                        background: '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Crop Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transform: `scale(${zoom})`,
                          transition: 'transform 0.1s ease-out',
                        }}
                      />
                    </div>

                    {/* Zoom Controller */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        maxWidth: 320,
                        background: '#F1F5F9',
                        padding: '8px 16px',
                        borderRadius: 24,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(1, Number((z - 0.1).toFixed(2))))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', display: 'flex' }}
                        title="Zoom out"
                      >
                        <ZoomOut size={16} />
                      </button>

                      <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        style={{ flex: 1, accentColor: 'var(--blue-accent)', cursor: 'pointer' }}
                      />

                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.1).toFixed(2))))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', display: 'flex' }}
                        title="Zoom in"
                      >
                        <ZoomIn size={16} />
                      </button>

                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', minWidth: 36, textAlign: 'right' }}>
                        {zoom.toFixed(1)}x
                      </span>
                    </div>

                    {/* Multi-Size Live Previews */}
                    <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        How it appears across AXORA
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
                        {/* Profile size (80px) */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 68, height: 68, borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '2px solid white' }}>
                            <img src={previewUrl} alt="Preview 68px" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Profile Page</span>
                        </div>

                        {/* Navbar size (38px) */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '2px solid white' }}>
                            <img src={previewUrl} alt="Preview 38px" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Navbar</span>
                        </div>

                        {/* Chat size (28px) */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1.5px solid white' }}>
                            <img src={previewUrl} alt="Preview 28px" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Messages</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 12,
                      marginTop: 20,
                      borderTop: '1px solid var(--border)',
                      paddingTop: 16,
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                      }}
                      disabled={loading}
                    >
                      Choose Different Photo
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveUpload}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={14} className="spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Check size={16} /> Save Profile Picture
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AVATAR PRESETS */}
          {activeTab === 'presets' && (
            <div>
              {/* Category pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPresetCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: presetCategory === cat ? 'var(--navy)' : '#F1F5F9',
                      color: presetCategory === cat ? 'var(--white)' : 'var(--text-muted)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of presets */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: 12,
                  maxHeight: 340,
                  overflowY: 'auto',
                  padding: 4,
                }}
              >
                {filteredPresets.map((preset) => {
                  const isSelected = selectedPreset === preset.url
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.url)}
                      style={{
                        padding: 10,
                        borderRadius: 12,
                        border: isSelected
                          ? '2px solid var(--blue-accent)'
                          : '1px solid var(--border)',
                        background: isSelected ? '#EFF6FF' : '#FAFBFD',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.15s ease',
                        position: 'relative',
                        boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: 'var(--blue-accent)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: 'white',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        }}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? 'var(--blue-accent)' : 'var(--text-dark)',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '100%',
                        }}
                      >
                        {preset.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                  marginTop: 20,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 16,
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSavePreset}
                  disabled={!selectedPreset || loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="spin" /> Applying...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Apply Selected Preset
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EDIT PROFILE INFO */}
          {activeTab === 'details' && (
            <form onSubmit={handleSaveDetails}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={15} color="var(--navy)" /> Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={15} color="var(--navy)" /> Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={15} color="var(--text-muted)" /> Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                  style={{ background: '#F1F5F9', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Email address cannot be changed directly for account security.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={15} color="var(--navy)" /> Account Role
                </label>
                <div style={{ display: 'inline-flex', padding: '6px 12px', background: '#EEF2FF', color: 'var(--navy)', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                  {user?.role?.replace('ROLE_', '')}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                  marginTop: 24,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 16,
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={detailsLoading}
                >
                  {detailsLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
