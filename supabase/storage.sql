-- ============================================================
-- IBT — Supabase Storage Setup
-- Run this in Supabase SQL Editor AFTER schema.sql
-- Also create the buckets manually in Supabase Dashboard → Storage
-- ============================================================

-- Step 1: Create buckets in Supabase Dashboard → Storage:
--   - "ticket-photos"    (public: TRUE)
--   - "employee-avatars" (public: TRUE)

-- Step 2: Run these policies:

-- ── TICKET PHOTOS ──────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('ticket-photos', 'ticket-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "ticket_photos_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'ticket-photos');

CREATE POLICY "ticket_photos_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ticket-photos');

CREATE POLICY "ticket_photos_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'ticket-photos');

CREATE POLICY "ticket_photos_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'ticket-photos');


-- ── EMPLOYEE AVATARS ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('employee-avatars', 'employee-avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'employee-avatars');

CREATE POLICY "avatars_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'employee-avatars');

CREATE POLICY "avatars_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'employee-avatars');

CREATE POLICY "avatars_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'employee-avatars');
