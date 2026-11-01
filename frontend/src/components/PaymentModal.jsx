import React, { useState } from 'react'
import { X, QrCode } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function PaymentModal({ project, receiverId, amount, milestoneId, onClose, onSuccess }) {
  const [step, setStep] = useState('confirm') // confirm -> qr -> done
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(false)

  const initiate = async () => {
    setLoading(true)
    try {
      const res = await api.post('/payments/create', {
        projectId: project.id,
        milestoneId: milestoneId || null,
        receiverId,
        amount,
      })
      setPayment(res.data.data)
      setStep('qr')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  const confirmPaid = async () => {
    setLoading(true)
    try {
      await api.put(`/payments/${payment.id}/mark-success`)
      toast.success('Payment successful!')
      setStep('done')
      onSuccess && onSuccess()
    } catch (e) {
      toast.error('Failed to confirm payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlayStyle}>
      <div className="card" style={{ width: 420, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ color: 'var(--navy)' }}>Make Payment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
        </div>

        {step === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row label="Project" value={project.title} />
            <Row label="Amount" value={`₹${Number(amount).toLocaleString('en-IN')}`} />
            <Row label="Payment Status" value="PENDING" />
            <button className="btn btn-primary btn-full" style={{ marginTop: 10 }} onClick={initiate} disabled={loading}>
              Pay via UPI
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              AXORA never stores your UPI PIN, card, or bank details.
            </p>
          </div>
        )}

        {step === 'qr' && payment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 160, height: 160, background: '#F1F5F9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={90} color="var(--navy)" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', wordBreak: 'break-all' }}>{payment.upiIntentUrl}</p>
            <a href={payment.upiIntentUrl} className="btn btn-primary btn-full">Pay Now</a>
            <button className="btn btn-outline btn-full" onClick={confirmPaid} disabled={loading}>
              I've completed the payment
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Transaction ID: {payment.transactionId}</p>
          </div>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: 18 }}>Payment Successful!</p>
            <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(11,31,58,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
}
