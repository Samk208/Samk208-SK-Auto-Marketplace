# Supabase Storage Setup Guide

**Project:** SK AutoSphere
**Date:** 2025-11-11
**Status:** ⚠️ REQUIRED - Storage buckets not yet created

---

## 🎯 Overview

SK AutoSphere requires two Supabase Storage buckets for handling image uploads:

1. **car-images** - For vehicle listing photos
2. **avatars** - For user profile pictures

---

## 📋 Step-by-Step Setup

### Step 1: Access Supabase Storage

Navigate to your Supabase project's storage section:

```
https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/storage/buckets
```

---

### Step 2: Create car-images Bucket

Click **"New Bucket"** and configure:

**Bucket Settings:**

```
Name: car-images
Public: ✅ Yes (Allow public access)
File size limit: 5 MB (5242880 bytes)
Allowed MIME types: image/jpeg, image/png, image/webp
```

**Why these settings:**

- **Public:** Allows car images to be viewed without authentication
- **5MB limit:** Balances image quality with performance
- **WebP support:** Modern format with better compression

---

### Step 3: Create avatars Bucket

Click **"New Bucket"** again and configure:

**Bucket Settings:**

```
Name: avatars
Public: ✅ Yes (Allow public access)
File size limit: 2 MB (2097152 bytes)
Allowed MIME types: image/jpeg, image/png, image/webp
```

**Why these settings:**

- **2MB limit:** Smaller than car images, sufficient for profile pictures
- **WebP support:** Same as car images for consistency

---

### Step 4: Apply RLS Policies

After creating both buckets, apply Row Level Security policies to control access.

**Navigate to:**

```
SQL Editor: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/editor
```

**Run this SQL:**

```sql
-- ==============================================
-- CAR IMAGES BUCKET POLICIES
-- ==============================================

-- 1. Allow ANYONE to view car images (public read)
CREATE POLICY "Anyone can view car images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');

-- 2. Allow authenticated users to upload car images
CREATE POLICY "Authenticated users can upload car images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'car-images'
  AND auth.role() = 'authenticated'
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

-- 1. Allow ANYONE to view avatars (public read)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 2. Allow authenticated users to upload avatars
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
```

---

## 🧪 Testing Your Setup

### Test 1: Verify Buckets Exist

Run this in SQL Editor:

```sql
SELECT
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name IN ('car-images', 'avatars');
```

**Expected Result:**

```
name         | public | file_size_limit | allowed_mime_types
-------------|--------|-----------------|--------------------
car-images   | true   | 5242880         | {image/jpeg,image/png,image/webp}
avatars      | true   | 2097152         | {image/jpeg,image/png,image/webp}
```

---

### Test 2: Verify RLS Policies

Run this in SQL Editor:

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
ORDER BY policyname;
```

**Expected Result:**
You should see 8 policies total:

- 4 policies for `car-images` (SELECT, INSERT, UPDATE, DELETE)
- 4 policies for `avatars` (SELECT, INSERT, UPDATE, DELETE)

---

### Test 3: Test Upload from Code

Once setup is complete, test with this code snippet:

```typescript
// Test car image upload
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

async function testUpload() {
  // Create a test file (in real app, this comes from file input)
  const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("Not authenticated");
    return;
  }

  const fileName = `${user.id}/test-car/test-${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from("car-images")
    .upload(fileName, file);

  if (error) {
    console.error("Upload failed:", error);
  } else {
    console.log("Upload successful:", data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("car-images")
      .getPublicUrl(fileName);

    console.log("Public URL:", urlData.publicUrl);
  }
}
```

---

## 📂 File Organization Structure

### Car Images

```
car-images/
├── {user_id_1}/
│   ├── {car_id_1}/
│   │   ├── image-1.webp
│   │   ├── image-2.webp
│   │   └── image-3.webp
│   └── {car_id_2}/
│       ├── image-1.webp
│       └── image-2.webp
└── {user_id_2}/
    └── {car_id_3}/
        └── image-1.webp
```

### Avatars

```
avatars/
├── {user_id_1}/
│   └── avatar.webp
├── {user_id_2}/
│   └── avatar.webp
└── {user_id_3}/
    └── avatar.webp
```

**Benefits of this structure:**

- Easy to find all images for a user
- Easy to delete all images when a car/user is deleted
- RLS policies work naturally (check folder name = user ID)

---

## 🔒 Security Considerations

### What's Protected:

✅ Only authenticated users can upload
✅ Users can only update/delete their own files
✅ Public read access for all images (required for marketplace)

### What's NOT Protected:

⚠️ Image URLs are public - anyone with the URL can view
⚠️ No file content validation (relies on MIME type checking)

### Recommendations:

1. **Enable virus scanning** (Supabase Pro feature)
2. **Monitor storage usage** to prevent abuse
3. **Implement rate limiting** on upload endpoints
4. **Validate file sizes** in client code before upload

---

## 🚨 Troubleshooting

### Issue: "new row violates row-level security policy"

**Cause:** RLS policies not applied or user not authenticated

**Solution:**

```typescript
// Ensure user is authenticated before upload
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) {
  throw new Error("Must be logged in to upload");
}
```

---

### Issue: "File size exceeds limit"

**Cause:** File larger than bucket's size limit

**Solution:**

```typescript
// Compress images before upload
import imageCompression from "browser-image-compression";

const compressed = await imageCompression(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp",
});
```

---

### Issue: "Storage bucket not found"

**Cause:** Bucket doesn't exist or wrong name

**Solution:**

- Verify bucket name spelling (case-sensitive)
- Check bucket exists in Supabase dashboard
- Ensure you're using correct project

---

## 📊 Storage Limits

### Free Tier Limits (Current):

- **Storage:** 1 GB total
- **Bandwidth:** 2 GB per month
- **API Requests:** 50,000 per month

### Estimated Usage:

- **Average car listing:** 6 images × 500 KB = 3 MB
- **Average avatar:** 200 KB
- **~300 car listings** = 900 MB (within free tier)

### When to Upgrade:

- Exceed 1 GB storage
- Need more than 2 GB bandwidth/month
- Want virus scanning
- Need CDN acceleration

---

## ✅ Success Checklist

After completing setup, verify:

- [ ] `car-images` bucket created with correct settings
- [ ] `avatars` bucket created with correct settings
- [ ] 8 RLS policies applied successfully
- [ ] Test upload works without errors
- [ ] Public URLs are accessible
- [ ] RLS prevents unauthorized deletes

---

## 🔗 Next Steps

Once storage is set up:

1. **Implement Upload Component**

   - Create `src/components/car/PhotoUploader.tsx`
   - Add image compression
   - Show upload progress

2. **Update Car Creation Flow**

   - Upload images when creating listing
   - Store URLs in `cars.images` array
   - Delete old images when updating

3. **Implement Avatar Upload**
   - Add to profile settings page
   - Crop/resize on client side
   - Update `profiles.avatar_url`

---

## 📚 Resources

- **Supabase Storage Docs:** https://supabase.com/docs/guides/storage
- **RLS Policy Examples:** https://supabase.com/docs/guides/auth/row-level-security
- **Image Compression Library:** https://github.com/Donaldcwl/browser-image-compression

---

**Setup Time:** ~15 minutes
**Difficulty:** ⭐⭐☆☆☆ (Easy)
**Priority:** 🔥 HIGH (Required for car listings)
