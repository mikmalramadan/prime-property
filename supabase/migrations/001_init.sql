-- ============================================================
-- 001_init.sql  –  Initial schema
-- Run this in the Supabase Dashboard SQL editor, or with the
-- Supabase CLI: supabase db push
-- ============================================================

-- Users / Agents table (managed by Supabase Auth + custom role)
CREATE TABLE profiles (
  id         UUID REFERENCES auth.users PRIMARY KEY,
  email      TEXT        NOT NULL,
  role       TEXT        NOT NULL CHECK (role IN ('admin', 'superadmin')),
  is_active  BOOLEAN     DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Properties table
CREATE TABLE properties (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_property  TEXT        NOT NULL CHECK (char_length(nama_property) BETWEEN 3 AND 100),
  group_name     TEXT,
  lebar          NUMERIC(6,2) NOT NULL CHECK (lebar > 0),
  panjang        NUMERIC(6,2) NOT NULL CHECK (panjang > 0),
  hadap          TEXT[]      NOT NULL,  -- e.g. ['Utara','Timur']
  tipe           TEXT        NOT NULL CHECK (tipe IN ('Ruko', 'Villa')),
  tingkat        NUMERIC(4,1) NOT NULL CHECK (tingkat BETWEEN 1 AND 10),
  price          BIGINT      NOT NULL CHECK (price > 0),
  carport        BOOLEAN     NOT NULL DEFAULT false,
  status         TEXT        NOT NULL CHECK (status IN ('in_stock', 'sold_out')),
  siap           TEXT        NOT NULL CHECK (siap IN ('siap_huni', 'siap_kosong', 'siap_huni_renovasi')),
  maps_link      TEXT CHECK (maps_link IS NULL OR maps_link LIKE '%google.com/maps%'),
  kawasan        TEXT[]      NOT NULL,
  unit           TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  created_by     UUID REFERENCES profiles(id),
  deleted_at     TIMESTAMPTZ  -- soft delete
);

-- Audit log
CREATE TABLE audit_logs (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id    UUID REFERENCES properties(id),
  user_id        UUID REFERENCES profiles(id),
  action         TEXT        NOT NULL, -- 'create' | 'update' | 'delete'
  changed_fields JSONB,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE properties  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs  ENABLE ROW LEVEL SECURITY;

-- Public read for non-deleted properties (landing page, no auth required)
CREATE POLICY "public_read_properties" ON properties
  FOR SELECT
  USING (deleted_at IS NULL);

-- Authenticated users get full access (admin dashboard)
CREATE POLICY "auth_full_access" ON properties
  FOR ALL
  USING (auth.role() = 'authenticated');
