import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { PRODUCTS } from '../lib/products'
import { ACCOUNT_LIST } from '../lib/pins'
import Countdown from '../components/Countdown'

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')

  useEffect(() => {
    const isAdmin = localStorage.getItem('nygift_admin')
    if (!isAdmin) {
      router.push('/')
      return
    }
    loadData()
  }, [router])

  async function loadData() {
    const { data, error } = await supabase.from('orders').select('*')
    if (error) {
      console.error(error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  function logout() {
    localStorage.removeItem('nygift_admin')
    router.push('/')
  }

  // Summary by person
  const summaryByPerson = {}
  ACCOUNT_LIST.forEach(acc => {
    summaryByPerson[acc.slug] = { name: acc.name, items: [], total: 0 }
  })
  orders.forEach(row => {
    const p = PRODUCTS.find(x => x.id === row.product_id)
    if (p && summaryByPerson[row.account_slug]) {
      summaryByPerson[row.account_slug].items.push(`${p.name} x${row.quantity}`)
      summaryByPerson[row.account_slug].total += p.price * row.quantity
    }
  })

  // Summary by product
  const summaryByProduct = {}
  PRODUCTS.forEach(p => {
    summaryByProduct[p.id] = { ...p, totalQty: 0, totalPrice: 0 }
  })
  orders.forEach(row => {
    if (summaryByProduct[row.product_id]) {
      summaryByProduct[row.product_id].totalQty += row.quantity
      summaryByProduct[row.product_id].totalPrice += row.price * row.quantity
    }
  })

  const grandTotal = Object.values(summaryByPerson).reduce((s, x) => s + x.total, 0)

  function exportCSV() {
    let csv = '\uFEFFชื่อ,สินค้า,จำนวน,ราคาต่อชิ้น,รวม\n'
    orders.forEach(row => {
      const p = PRODUCTS.find(x => x.id === row.product_id)
      const name = ACCOUNT_LIST.find(x => x.slug === row.account_slug)?.name || row.account_slug
      if (p) {
        csv += `${name},${p.name},${row.quantity},${p.price},${p.price * row.quantity}\n`
      }
    })
    csv += `,,,รวมทั้งหมด,${grandTotal}\n`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'ny-gift-2027-summary.csv'
    link.click()
  }

  if (loading) {
    return (
      <div className="container admin-container">
        <div className="loading">กำลังโหลดข้อมูล...</div>
      </div>
    )
  }

  return (
    <div className="container admin-container">
      <div className="header">
        <h1>📊 สรุปรายการสั่งซื้อทั้งหมด</h1>
        <p>Admin Dashboard - NY Gift 2027</p>
      </div>

      <Countdown />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div className="tab-bar">
          <button className={`tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>
            📊 สรุปตามบุคคล
          </button>
          <button className={`tab ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')}>
            📦 สรุปตามสินค้า
          </button>
          <button className={`tab ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')}>
            📝 ข้อมูลดิบ
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-green" onClick={exportCSV} style={{ fontSize: '14px', padding: '10px 20px' }}>
            📥 Export CSV
          </button>
          <button className="btn btn-secondary" onClick={logout} style={{ fontSize: '14px', padding: '10px 20px' }}>
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="grand-total">
        💰 ยอดรวมทั้งหมด: {grandTotal.toLocaleString()} บาท
      </div>

      {activeTab === 'summary' && (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>รายการที่สั่ง</th>
                <th style={{ textAlign: 'right' }}>รวม (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNT_LIST.map(acc => {
                const s = summaryByPerson[acc.slug]
                return (
                  <tr key={acc.slug}>
                    <td style={{ fontWeight: 600 }}>{acc.name}</td>
                    <td style={{ color: s.items.length ? '#333' : '#999' }}>
                      {s.items.length ? s.items.join(', ') : 'ยังไม่ได้สั่ง'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {s.total.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'items' && (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>สินค้า</th>
                <th style={{ textAlign: 'right' }}>ราคา</th>
                <th style={{ textAlign: 'center' }}>จำนวนที่สั่งทั้งหมด</th>
                <th style={{ textAlign: 'right' }}>ยอดรวม</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map(p => {
                const s = summaryByProduct[p.id]
                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td style={{ textAlign: 'right' }}>{p.price.toLocaleString()}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{s.totalQty}</td>
                    <td style={{ textAlign: 'right' }}>{s.totalPrice.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'raw' && (
        <pre className="raw-pre">{JSON.stringify(orders, null, 2)}</pre>
      )}
    </div>
  )
}
