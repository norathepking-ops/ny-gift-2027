import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { PRODUCTS } from '../lib/products'
import { ACCOUNTS } from '../lib/pins'
import Countdown from '../components/Countdown'
import ProductCard from '../components/ProductCard'

export default function OrderPage() {
  const router = useRouter()
  const [account, setAccount] = useState('')
  const [name, setName] = useState('')
  const [quantities, setQuantities] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    const deadline = new Date('2026-07-30T12:00:00+07:00')
    if (new Date() > deadline) {
      setIsClosed(true)
    }

    const acc = localStorage.getItem('nygift_account')
    const nm = localStorage.getItem('nygift_name')
    if (!acc) {
      router.push('/')
      return
    }
    setAccount(acc)
    setName(nm)

    async function loadOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('account_slug', acc)

      if (error) {
        console.error('Load error:', error)
      } else if (data) {
        const q = {}
        data.forEach(row => {
          q[row.product_id] = row.quantity
        })
        setQuantities(q)
      }
      setLoading(false)
    }
    loadOrders()
  }, [router])

  function updateQty(productId, delta, absolute = false) {
    if (isClosed) return
    setQuantities(prev => {
      const current = prev[productId] || 0
      let next = absolute ? delta : current + delta
      if (next < 0) next = 0
      const updated = { ...prev }
      if (next === 0) delete updated[productId]
      else updated[productId] = next
      return updated
    })
  }

  async function saveOrder() {
    if (isClosed) {
      setMessage('⛔ ปิดรับรายการแล้ว ไม่สามารถบันทึกได้')
      return
    }
    setSaving(true)
    setMessage('')

    await supabase
      .from('orders')
      .delete()
      .eq('account_slug', account)

    const rows = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([pid, qty]) => ({
        account_slug: account,
        product_id: parseInt(pid),
        quantity: qty
      }))

    if (rows.length > 0) {
      const { error } = await supabase.from('orders').insert(rows)
      if (error) {
        setMessage('❌ บันทึกไม่สำเร็จ: ' + error.message)
        setSaving(false)
        return
      }
    }

    setMessage('✅ บันทึกรายการเรียบร้อยแล้ว!')
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  function logout() {
    localStorage.removeItem('nygift_account')
    localStorage.removeItem('nygift_name')
    router.push('/')
  }

  const totalPrice = Object.entries(quantities).reduce((sum, [pid, qty]) => {
    const p = PRODUCTS.find(x => x.id === parseInt(pid))
    return sum + (p ? p.price * qty : 0)
  }, 0)

  if (loading) {
    return (
      <div className="container">
        <div className="loading">กำลังโหลดข้อมูล...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎁 แบบฟอร์มสั่งของขวัญปีใหม่ 2569</h1>
        <p>เลือกสินค้าที่ต้องการ</p>
      </div>

      <Countdown />

      <div className="user-bar">
        <div>
          <span style={{ color: '#666' }}>สวัสดี, </span>
          <span className="user-name">{name}</span>
        </div>
        <button className="btn btn-secondary" onClick={logout} style={{ fontSize: '14px', padding: '8px 16px' }}>
          🚪 ออกจากระบบ
        </button>
      </div>

      <div className="note-box">
        💡 หมายเหตุ: กระเช้าแบรนด์ที่จัดหามาอาจจะมีรูปแบบหรือราคาเล็กน้อย Update เนื่องจากแคตตาล็อคของขวัญปีใหม่ 2570 จะออกให้เลือกซื้อประมาณเดือนต.ค. 69
      </div>

      {message && (
        <div className={message.startsWith('✅') ? 'success-msg' : 'error-msg'}>
          {message}
        </div>
      )}

      {isClosed && (
        <div className="closed-msg">
          ⛔ ปิดรับรายการแล้ว (30 ก.ค. 2569 เวลา 12:00 น.)<br/>
          คุณสามารถดูรายการที่เคยสั่งไว้ได้ แต่ไม่สามารถแก้ไขได้
        </div>
      )}

      <div className="product-grid">
        {PRODUCTS.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            quantity={quantities[p.id] || 0}
            onChange={updateQty}
            isClosed={isClosed}
          />
        ))}
      </div>

      <div className="total-bar">
        <div>
          <div className="total-label">รวมทั้งหมด</div>
          <div className="total-amount">{totalPrice.toLocaleString()} บาท</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={saveOrder}
          disabled={saving || isClosed}
        >
          {saving ? 'กำลังบันทึก...' : '💾 บันทึกรายการ'}
        </button>
      </div>
    </div>
  )
}
