import { useState } from 'react'
import { useRouter } from 'next/router'
import { PIN_MAP, ACCOUNTS } from '../lib/pins'
import Countdown from '../components/Countdown'

export default function LoginPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleLogin() {
    const trimmed = pin.trim()
    if (!PIN_MAP[trimmed]) {
      setError('รหัสไม่ถูกต้อง กรุณาลองใหม่')
      return
    }
    const account = PIN_MAP[trimmed]
    const name = ACCOUNTS[account]
    localStorage.setItem('nygift_account', account)
    localStorage.setItem('nygift_name', name)
    router.push('/order')
  }

  function handleAdmin() {
    const adminPin = prompt('กรอกรหัส Admin:')
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '9999'
    if (adminPin === correctPin) {
      localStorage.setItem('nygift_admin', 'true')
      router.push('/admin')
    } else {
      alert('รหัส Admin ไม่ถูกต้อง')
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎁 แบบฟอร์มสั่งของขวัญปีใหม่ 2569</h1>
        <p>NY Gift 2027</p>
      </div>

      <Countdown />

      <div className="login-box">
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔐</div>
        <h2 style={{ margin: '0 0 8px' }}>เข้าสู่ระบบ</h2>
        <p style={{ color: '#666', margin: '0 0 20px' }}>กรอกรหัส 4 หลักที่ได้รับ</p>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ''))
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="____"
          className="pin-input"
        />
        {error && <div style={{ color: '#c62828', marginBottom: '12px', fontSize: '14px' }}>{error}</div>}
        <button className="btn btn-primary" onClick={handleLogin} style={{ width: '100%' }}>
          เข้าสู่ระบบ
        </button>
      </div>

      <div className="center-link">
        <button className="btn btn-secondary" onClick={handleAdmin} style={{ fontSize: '14px' }}>
          👤 ดูสรุปรายการทั้งหมด (Admin)
        </button>
      </div>
    </div>
  )
}
