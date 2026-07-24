-- ============================================================
-- สร้างตารางสำหรับเก็บรายการสั่งซื้อของขวัญปีใหม่ 2569
-- รันคำสั่งนี้ใน SQL Editor ของ Supabase
-- ============================================================

-- ลบตารางเก่าถ้ามี (ระวัง: ข้อมูลจะหาย)
-- DROP TABLE IF EXISTS orders;

-- สร้างตาราง orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_slug TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง index สำหรับค้นหาเร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_orders_account ON orders(account_slug);
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);

-- เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: อนุญาตให้ทุกคนอ่านและเขียนได้ (ควบคุมด้วย PIN ฝั่งเว็บแทน)
CREATE POLICY "Allow all" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- หรือถ้าต้องการให้ปลอดภัยกว่านี้ ใช้แบบนี้แทน:
-- CREATE POLICY "Allow select" ON orders FOR SELECT USING (true);
-- CREATE POLICY "Allow insert" ON orders FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow update" ON orders FOR UPDATE USING (true);
-- CREATE POLICY "Allow delete" ON orders FOR DELETE USING (true);
