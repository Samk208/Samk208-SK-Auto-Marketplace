-- ==============================================
-- SUPABASE STORAGE SETUP - RUN IN SQL EDITOR
-- Create buckets and RLS policies for car images and avatars
-- Dashboard: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/editor
-- ==============================================

-- ==============================================
-- CREATE STORAGE BUCKETS
-- ==============================================

-- 1. Create car-images bucket (5 MB limit, public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-images',
  'car-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Create avatars bucket (2 MB limit, public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- ==============================================
-- CAR IMAGES BUCKET POLICIES
-- ==============================================

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view car images" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload car images" ON storage.objects;

DROP POLICY IF EXISTS "Users can update their own car images" ON storage.objects;

DROP POLICY IF EXISTS "Users can delete their own car images" ON storage.objects;

-- 1. Allow ANYONE to view car images (public read)
CREATE POLICY "Anyone can view car images" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'car-images');

-- 2. Allow authenticated users to upload car images
CREATE POLICY "Authenticated users can upload car images" ON storage.objects FOR
INSERT
    TO authenticated
WITH
    CHECK (
        bucket_id = 'car-images'
        AND auth.role () = 'authenticated'
    );

-- 3. Allow users to update their own car images
-- Images are stored in folders named by user ID: {user_id}/{car_id}/{filename}
CREATE POLICY "Users can update their own car images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'car-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to delete their own car images
CREATE POLICY "Users can delete their own car images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'car-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ==============================================
-- AVATARS BUCKET POLICIES
-- ==============================================

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- 1. Allow ANYONE to view avatars (public read)
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'avatars');

-- 2. Allow authenticated users to upload avatars (must be in their own folder)
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ==============================================
-- VERIFICATION QUERIES (Run after the above)
-- ==============================================

-- Verify buckets were created successfully
SELECT
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE
    name IN ('car-images', 'avatars')
ORDER BY name;

-- Verify RLS policies were created (should see 8 policies)
SELECT policyname, cmd, tablename
FROM pg_policies
WHERE
    tablename = 'objects'
    AND schemaname = 'storage'
    AND policyname LIKE '%car images%'
    OR policyname LIKE '%avatars%'
ORDER BY policyname;

-- Expected Results:
-- 1. Two buckets: car-images (5 MB, public) and avatars (2 MB, public)
-- 2. Eight policies: 4 for car-images + 4 for avatars (SELECT, INSERT, UPDATE, DELETE)

-- ✅ SETUP COMPLETE!