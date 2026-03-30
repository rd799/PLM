-- ============================================
-- NSCA PLM — Database Schema
-- Supabase PostgreSQL
-- ============================================

-- 1. Users (extend Supabase auth.users)
CREATE TABLE IF NOT EXISTS plm_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'public' CHECK (role IN ('admin','tp_rd','nv_rd','tp_sx','nv_sx','tp_kcs','nv_kcs','public')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Industries (Ngành)
CREATE TABLE IF NOT EXISTS plm_industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  icon TEXT DEFAULT '🏭',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Groups (Nhóm SP)
CREATE TABLE IF NOT EXISTS plm_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES plm_industries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products
CREATE TABLE IF NOT EXISTS plm_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  revision TEXT DEFAULT 'Rev.A',
  series TEXT,
  application TEXT,
  description_public TEXT,
  description_internal TEXT,
  main_image TEXT,
  industry_id UUID REFERENCES plm_industries(id),
  group_id UUID REFERENCES plm_groups(id),
  lifecycle_stage TEXT DEFAULT 'concept' CHECK (lifecycle_stage IN ('concept','design','prototype','validation','pre_prod','production','obsolete')),
  tags TEXT[] DEFAULT '{}',
  -- Section publish statuses
  profile_status TEXT DEFAULT 'draft' CHECK (profile_status IN ('draft','pending','rejected','published')),
  specs_status TEXT DEFAULT 'draft',
  drawings_status TEXT DEFAULT 'draft',
  process_status TEXT DEFAULT 'draft',
  bom_status TEXT DEFAULT 'draft',
  qc_status TEXT DEFAULT 'draft',
  -- Confirmations from SX/KCS
  profile_sx_confirmed BOOLEAN DEFAULT false,
  specs_sx_confirmed BOOLEAN DEFAULT false,
  drawings_sx_confirmed BOOLEAN DEFAULT false,
  process_sx_confirmed BOOLEAN DEFAULT false,
  bom_sx_confirmed BOOLEAN DEFAULT false,
  qc_kcs_confirmed BOOLEAN DEFAULT false,
  -- Meta
  health_score INT DEFAULT 0,
  created_by UUID REFERENCES plm_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tech Specs
CREATE TABLE IF NOT EXISTS plm_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT,
  unit TEXT,
  standard TEXT,
  scope TEXT DEFAULT 'public' CHECK (scope IN ('rd','sx','public')),
  sort_order INT DEFAULT 0,
  is_draft BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Drawings & Documents
CREATE TABLE IF NOT EXISTS plm_drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  doc_number TEXT,
  url TEXT, -- Google Drive link
  revision TEXT DEFAULT 'Rev.A',
  doc_type TEXT DEFAULT 'other',
  scope TEXT DEFAULT 'rd' CHECK (scope IN ('rd','sx','public')),
  is_draft BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Process Steps
CREATE TABLE IF NOT EXISTS plm_process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cycle_time_seconds INT DEFAULT 0,
  setup_time_seconds INT DEFAULT 0,
  workers INT DEFAULT 1,
  worker_level TEXT,
  equipment TEXT,
  safety_notes TEXT,
  x INT DEFAULT 60,
  y INT DEFAULT 60,
  width INT DEFAULT 160,
  is_draft BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Process Connections
CREATE TABLE IF NOT EXISTS plm_process_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  from_step_id UUID REFERENCES plm_process_steps(id) ON DELETE CASCADE,
  to_step_id UUID REFERENCES plm_process_steps(id) ON DELETE CASCADE
);

-- 9. Work Instructions
CREATE TABLE IF NOT EXISTS plm_work_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES plm_process_steps(id) ON DELETE CASCADE,
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  step_number INT DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  duration_seconds INT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BOM Items
CREATE TABLE IF NOT EXISTS plm_bom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  part_number TEXT,
  bom_group TEXT DEFAULT 'main' CHECK (bom_group IN ('main','component','consumable','packaging')),
  quantity DECIMAL DEFAULT 1,
  unit TEXT DEFAULT 'cái',
  material TEXT,
  standard TEXT,
  tech_description TEXT,
  supplier_name TEXT,
  supplier_code TEXT,
  supplier_catalog_url TEXT,
  drawing_url TEXT,
  images TEXT[] DEFAULT '{}',
  is_draft BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. QC Criteria
CREATE TABLE IF NOT EXISTS plm_qc_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  method TEXT,
  target_value TEXT,
  min_value DECIMAL,
  max_value DECIMAL,
  equipment TEXT,
  category TEXT DEFAULT 'final' CHECK (category IN ('incoming','in_process','final')),
  standard TEXT,
  is_draft BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. QC Records (KCS điền)
CREATE TABLE IF NOT EXISTS plm_qc_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  criteria_id UUID REFERENCES plm_qc_criteria(id) ON DELETE CASCADE,
  lot_number TEXT,
  actual_value TEXT,
  result TEXT DEFAULT 'pending' CHECK (result IN ('pass','fail','pending')),
  inspector_id UUID REFERENCES plm_users(id),
  evidence_urls TEXT[] DEFAULT '{}',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Change Logs
CREATE TABLE IF NOT EXISTS plm_changelogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  revision_from TEXT,
  revision_to TEXT,
  changes JSONB DEFAULT '[]',
  reason TEXT,
  published_by UUID REFERENCES plm_users(id),
  approved_by UUID REFERENCES plm_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Feedback
CREATE TABLE IF NOT EXISTS plm_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  section TEXT,
  message TEXT NOT NULL,
  from_user_id UUID REFERENCES plm_users(id),
  from_user_name TEXT,
  from_role TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 15. Product Timeline
CREATE TABLE IF NOT EXISTS plm_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  section TEXT,
  user_id UUID REFERENCES plm_users(id),
  user_name TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Draft Snapshots (lưu bản nháp gần nhất trước khi ban hành)
CREATE TABLE IF NOT EXISTS plm_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES plm_products(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  revision TEXT,
  data JSONB NOT NULL, -- snapshot toàn bộ data của section
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_industry ON plm_products(industry_id);
CREATE INDEX IF NOT EXISTS idx_products_group ON plm_products(group_id);
CREATE INDEX IF NOT EXISTS idx_specs_product ON plm_specs(product_id);
CREATE INDEX IF NOT EXISTS idx_drawings_product ON plm_drawings(product_id);
CREATE INDEX IF NOT EXISTS idx_bom_product ON plm_bom(product_id);
CREATE INDEX IF NOT EXISTS idx_process_product ON plm_process_steps(product_id);
CREATE INDEX IF NOT EXISTS idx_qc_product ON plm_qc_criteria(product_id);
CREATE INDEX IF NOT EXISTS idx_timeline_product ON plm_timeline(product_id);
CREATE INDEX IF NOT EXISTS idx_changelog_product ON plm_changelogs(product_id);
CREATE INDEX IF NOT EXISTS idx_feedback_product ON plm_feedback(product_id);

-- ============================================
-- RLS (Row Level Security) — cơ bản
-- ============================================
ALTER TABLE plm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE plm_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plm_drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE plm_bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE plm_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE plm_qc_criteria ENABLE ROW LEVEL SECURITY;

-- Policy: tạm thời cho phép tất cả authenticated users (sẽ refine sau)
CREATE POLICY "Allow all for authenticated" ON plm_products FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON plm_specs FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON plm_drawings FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON plm_bom FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON plm_process_steps FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON plm_qc_criteria FOR ALL USING (true);
