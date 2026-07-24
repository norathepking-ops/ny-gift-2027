import { useState, useEffect } from 'react'

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState('')
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    const deadline = new Date('2026-07-30T12:00:00+07:00')

    function update() {
      const now = new Date()
      const diff = deadline - now
      if (diff <= 0) {
        setTimeLeft('ปิดรับแล้ว')
        setIsClosed(true)
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${days} วัน ${hrs} ชม. ${mins} น. ${secs} วิ.`)
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="countdown-box">
      <div style={{ fontSize: '14px', color: '#666' }}>⏰ เหลือเวลากรอก/แก้ไขข้อมูล</div>
      <div className={`time ${isClosed ? 'closed' : ''}`}>{timeLeft}</div>
      <div style={{ fontSize: '13px', color: '#666' }}>ปิดรับ 30 ก.ค. 2569 เวลา 12:00 น.</div>
    </div>
  )
}
