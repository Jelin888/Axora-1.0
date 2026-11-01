import React, { useState } from 'react'
import { Camera } from 'lucide-react'

const GRADIENTS = [
  'linear-gradient(135deg, #4F46E5, #7C3AED)', // Indigo -> Violet
  'linear-gradient(135deg, #2563EB, #1D4ED8)', // Royal Blue
  'linear-gradient(135deg, #059669, #0D9488)', // Emerald -> Teal
  'linear-gradient(135deg, #D97706, #EA580C)', // Amber -> Orange
  'linear-gradient(135deg, #DB2777, #E11D48)', // Pink -> Rose
  'linear-gradient(135deg, #0284C7, #0369A1)', // Sky Blue
  'linear-gradient(135deg, #9333EA, #C026D3)', // Purple -> Fuchsia
  'linear-gradient(135deg, #0F766E, #0369A1)', // Teal -> Blue
]

const SIZES = {
  xs: { size: 24, font: 10, icon: 10, badge: 6 },
  sm: { size: 32, font: 12, icon: 12, badge: 8 },
  md: { size: 40, font: 14, icon: 14, badge: 9 },
  lg: { size: 52, font: 18, icon: 16, badge: 10 },
  xl: { size: 72, font: 24, icon: 20, badge: 12 },
  '2xl': { size: 96, font: 32, icon: 24, badge: 14 },
  '3xl': { size: 128, font: 42, icon: 28, badge: 16 },
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getGradient(identifier = '') {
  let hash = 0
  const str = String(identifier)
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % GRADIENTS.length
  return GRADIENTS[index]
}

export default function UserAvatar({
  user,
  src,
  size = 'md',
  showBadge = false,
  badgeRole = null,
  editable = false,
  onEdit = null,
  style = {},
  className = '',
  alt = '',
}) {
  const [imgError, setImgError] = useState(false)

  // Resolve config for size
  const config = typeof size === 'number'
    ? { size, font: Math.round(size * 0.38), icon: Math.round(size * 0.28), badge: Math.max(6, Math.round(size * 0.12)) }
    : (SIZES[size] || SIZES.md)

  const name = user?.fullName || user?.name || alt || ''
  const initials = getInitials(name)
  const photoUrl = src || user?.profilePhotoUrl
  const gradient = getGradient(name || user?.id || 'axora')
  const hasPhoto = Boolean(photoUrl && !imgError)

  const badgeColor = badgeRole === 'ROLE_FREELANCER' ? '#3B82F6'
    : badgeRole === 'ROLE_CLIENT' ? '#10B981'
    : badgeRole === 'ROLE_ADMIN' ? '#8B5CF6'
    : '#10B981' // default online green

  return (
    <div
      className={`user-avatar-wrapper ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: config.size,
        height: config.size,
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
      onClick={editable && onEdit ? onEdit : undefined}
      title={name || alt}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hasPhoto ? '#F1F5F9' : gradient,
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: config.font,
          letterSpacing: '0.02em',
          boxShadow: '0 2px 8px rgba(11, 31, 58, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.9)',
          position: 'relative',
          cursor: editable ? 'pointer' : 'inherit',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        }}
      >
        {hasPhoto ? (
          <img
            src={photoUrl}
            alt={name || 'Avatar'}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <span>{initials}</span>
        )}

        {/* Hover Camera Overlay if editable */}
        {editable && (
          <div
            className="avatar-edit-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(11, 31, 58, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              backdropFilter: 'blur(2px)',
            }}
          >
            <Camera size={config.icon} />
            {config.size >= 80 && (
              <span style={{ fontSize: 10, marginTop: 4, fontWeight: 600 }}>Change</span>
            )}
          </div>
        )}
      </div>

      {/* Role / Online status badge indicator */}
      {showBadge && (
        <span
          style={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            width: config.badge,
            height: config.badge,
            borderRadius: '50%',
            background: badgeColor,
            border: '2px solid #FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      )}

      {editable && (
        <style>{`
          .user-avatar-wrapper:hover .avatar-edit-overlay {
            opacity: 1 !important;
          }
          .user-avatar-wrapper:hover > div {
            transform: scale(1.03);
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25) !important;
          }
        `}</style>
      )}
    </div>
  )
}
