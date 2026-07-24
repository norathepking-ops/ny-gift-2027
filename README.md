# 🎁 แบบฟอร์มสั่งของขวัญปีใหม่ 2569 (NY Gift 2027)

เว็บแอปสำหรับให้ทีมกรอกรายการสั่งของขวัญปีใหม่ พร้อมระบบ Login ด้วย PIN และเก็บข้อมูลลง Supabase Database

---

## 🚀 ขั้นตอนการ Deploy (ทำตามทีละขั้นตอน)

### ✅ ขั้นตอนที่ 1: สร้าง Supabase Project

1. ไปที่ [https://supabase.com](https://supabase.com)
2. สมัคร/ล็อกอิน → คลิก **"New Project"**
3. ตั้งชื่อโปรเจกต์: `ny-gift-2027`
4. ตั้งรหัสผ่าน Database (จดไว้ให้ดี)
5. รอสักครู่ให้สร้างเสร็จ
6. เมื่อเสร็จแล้ว ไปที่ **Project Settings → API**
7. คัดลอกค่าสองอย่างนี้เก็บไว้:
   - `URL` (เช่น `https://xxxxxxxxxxxx.supabase.co`)
   - `anon public` API Key

### ✅ ขั้นตอนที่ 2: สร้างตาราง Database

1. ใน Supabase ไปที่ **SQL Editor → New Query**
2. เปิดไฟล์ `sql/setup.sql` จากโปรเจกต์นี้
3. คัดลอกโค้ดทั้งหมด แล้ววางลงใน SQL Editor
4. กด **Run** → ตาราง `orders` จะถูกสร้างขึ้น

### ✅ ขั้นตอนที่ 3: อัปโหลดโค้ดขึ้น GitHub

1. สร้าง Repository ใหม่บน GitHub (ชื่ออะไรก็ได้ เช่น `ny-gift-2027`)
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ny-gift-2027.git
   git push -u origin main
   ```

### ✅ ขั้นตอนที่ 4: Deploy บน Vercel

1. ไปที่ [https://vercel.com](https://vercel.com)
2. ล็อกอินด้วย GitHub → คลิก **"Add New Project"**
3. เลือก Repository `ny-gift-2027`
4. ในหน้า **Configure Project**:
   - Framework Preset: `Next.js`
   - เพิ่ม Environment Variables (กด "Add" ทีละตัว):
     | Key | Value |
     |-----|-------|
     | `NEXT_PUBLIC_SUPABASE_URL` | URL จาก Supabase |
     | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key จาก Supabase |
     | `NEXT_PUBLIC_ADMIN_PIN` | `9999` (หรือรหัส Admin ที่ต้องการ) |
5. กด **Deploy**
6. รอสักครู่ → จะได้ URL เช่น `https://ny-gift-2027.vercel.app`

---

## 📁 โครงสร้างไฟล์

```
ny-gift-2027/
├── pages/
│   ├── _app.js              # Layout หลัก
│   ├── index.js             # หน้า Login
│   ├── order.js             # หน้าเลือกสินค้า
│   └── admin.js             # หน้าดูสรุป (Admin)
├── components/
│   ├── Countdown.js         # นับถอยหลัง
│   └── ProductCard.js       # การ์ดสินค้าแต่ละชิ้น
├── lib/
│   ├── supabase.js          # เชื่อมต่อ Supabase
│   ├── pins.js              # รหัส PIN และชื่อบัญชี
│   └── products.js          # รายการสินค้า 25 ชิ้น
├── styles/
│   └── globals.css          # CSS ทั้งหมด
├── sql/
│   └── setup.sql            # สร้างตาราง Supabase
├── .gitignore
├── next.config.js
├── package.json
├── .env.local.example
└── README.md
```

---

## 🔐 รหัส PIN ที่ใช้ Login

| ชื่อ | PIN |
|------|-----|
| k'Malee | 2354, 2355 |
| k'Nutthaporn | 2210, 2211 |
| k'Khamron | 2374 |
| k'Sida | 2670, 2671 |
| k'Aunyaporn | 2270, 2274 |
| k'Pornpun | 2112, 2113 |
| k'Thanittasa | 2072, 2083 |
| k'Wipavun | 2102, 2103 |
| k'Kanokwan | 2074 |
| k'Weeraya | 2470, 2471 |
| k'Worawuth | 2082 |

---

## 🛠 การแก้ไขข้อมูล

### แก้ไขรหัส PIN
ไปที่ไฟล์ `lib/pins.js` แล้วแก้ `PIN_MAP`

### แก้ไขรายการสินค้า
ไปที่ไฟล์ `lib/products.js` แล้วแก้ `PRODUCTS`

### แก้ไขวันปิดรับ
ไปที่ไฟล์ `components/Countdown.js` และ `pages/order.js`
แก้ `2026-07-30T12:00:00+07:00` เป็นวันที่ต้องการ

### แก้ไขรหัส Admin
ตั้งค่า Environment Variable `NEXT_PUBLIC_ADMIN_PIN` บน Vercel
หรือแก้ค่า default ใน `pages/index.js`

---

## ⚠️ หมายเหตุสำคัญ

- ระบบนี้ใช้ **Client-side PIN validation** (ตรวจสอบรหัสฝั่งเบราว์เซอร์)
- ถ้าต้องการความปลอดภัยมากขึ้น ควรเพิ่ม **Server-side validation**
- ข้อมูลทั้งหมดเก็บใน Supabase Database สามารถดู/แก้ไขได้ที่ Supabase Dashboard → Table Editor

---

## 📞 ติดต่อ/สอบถาม

ถ้ามีปัญหาในการ Deploy หรือต้องการให้ปรับแต่งเพิ่มเติม สามารถแจ้งได้เลยครับ 🙏
