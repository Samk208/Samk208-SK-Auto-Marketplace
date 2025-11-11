# SK AutoSphere - Supabase Setup Guide

This directory contains database migrations, seed data, and configuration for the SK AutoSphere project.

---

## 📁 Directory Structure

```
supabase/
├── config.toml           # Supabase CLI configuration
├── migrations/           # Database schema migrations
│   ├── 20250109000000_baseline_schema.sql
│   ├── 20250109000001_add_profile_fields.sql
│   ├── 20250109000002_add_car_fields.sql
│   ├── 20250109000003_create_messaging_tables.sql
│   └── 20250109000004_create_favorites_table.sql
├── functions/            # Edge Functions (serverless)
└── seed/                 # Sample data for testing
    └── sample_data.sql
```

---

## 🚀 Quick Start

### 1. Install Supabase CLI (if not already installed)

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (via npm)
npm install -g supabase

# Verify installation
supabase --version
```

### 2. Link Your Supabase Project

```bash
# From project root
supabase login

# Link to your remote project
supabase link --project-ref teyloksuvmmhqixjqoch
```

### 3. Check Current Database Status

```bash
# See what migrations have been applied
supabase migration list

# Check database schema
supabase db diff
```

---

## 📊 Applying Migrations

### Option A: Apply All Migrations at Once

```bash
# From project root
supabase db push

# This will apply all migrations in /supabase/migrations/ in order
```

### Option B: Apply Migrations Individually

```bash
# Apply baseline schema
supabase db push --file supabase/migrations/20250109000000_baseline_schema.sql

# Apply profile enhancements
supabase db push --file supabase/migrations/20250109000001_add_profile_fields.sql

# Apply car enhancements
supabase db push --file supabase/migrations/20250109000002_add_car_fields.sql

# Apply messaging tables
supabase db push --file supabase/migrations/20250109000003_create_messaging_tables.sql

# Apply favorites table
supabase db push --file supabase/migrations/20250109000004_create_favorites_table.sql
```

### Option C: Run Migrations via SQL Editor (Supabase Dashboard)

1. Go to https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/editor
2. Copy the contents of each migration file
3. Paste into SQL Editor
4. Click "Run"

---

## 🌱 Seeding Test Data

### Load Sample Data

```bash
# Apply seed data (development only!)
supabase db execute --file supabase/seed/sample_data.sql

# Or via SQL Editor in Supabase Dashboard
```

**WARNING:** This creates fake users and test data. Only use in development/staging!

### What Gets Seeded

- **3 seller profiles** (Korean dealers)
- **3 buyer profiles** (African importers)
- **5 car listings** (4 published, 1 draft)
- **2 conversations** (buyer-seller chats)
- **5 messages** (sample chat history)
- **4 favorites** (saved cars)

---

## 🪣 Setting Up Storage Buckets

### Create Storage Buckets for Images

1. Go to Supabase Dashboard → Storage
2. Create two buckets:

#### Bucket 1: `car-images`

**Settings:**
- Name: `car-images`
- Public: ✅ Yes (publicly accessible)
- File size limit: 5 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

**RLS Policy:**
```sql
-- Anyone can view images
CREATE POLICY "Public car images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- Only authenticated sellers can upload
CREATE POLICY "Authenticated sellers can upload car images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'car-images' AND
  auth.role() = 'authenticated'
);

-- Only owners can delete their images
CREATE POLICY "Sellers can delete their own car images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'car-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Bucket 2: `avatars`

**Settings:**
- Name: `avatars`
- Public: ✅ Yes
- File size limit: 2 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

**RLS Policy:**
```sql
-- Anyone can view avatars
CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Storage Folder Structure

```
car-images/
  ├── {seller_id}/
  │   ├── {car_id}/
  │   │   ├── image-1.webp
  │   │   ├── image-2.webp
  │   │   └── ...

avatars/
  ├── {user_id}/
  │   └── avatar.webp
```

---

## 🔄 Updating TypeScript Types

After applying migrations, regenerate TypeScript types:

```bash
# Generate types from remote database
npx supabase gen types typescript --project-id teyloksuvmmhqixjqoch > src/types/database.types.ts

# Or from local database (if using local development)
npx supabase gen types typescript --local > src/types/database.types.ts
```

---

## 🛠️ Creating New Migrations

### Generate a New Migration

```bash
# Create a new migration file
supabase migration new add_reviews_table

# Edit the generated file in supabase/migrations/
```

### Migration Best Practices

1. **One change per migration** (e.g., add table, add column, create index)
2. **Always include rollback** (use `IF NOT EXISTS`, `IF EXISTS`)
3. **Test locally first** before pushing to production
4. **Name migrations descriptively** (e.g., `add_email_to_profiles.sql`)
5. **Include comments** explaining the change

---

## 📋 Verification Checklist

After applying migrations, verify:

### Database Schema

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Expected tables:
-- profiles, cars, conversations, messages, favorites
```

### RLS Policies

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- All tables should have rowsecurity = true
```

### Indexes

```sql
-- Check indexes exist
SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public';

-- Should see indexes on:
-- cars.dealer_id, cars.status, cars.created_at
-- conversations.buyer_id, conversations.seller_id
-- messages.conversation_id
```

### Triggers

```sql
-- Check triggers
SELECT trigger_name, event_object_table FROM information_schema.triggers;

-- Expected triggers:
-- set_updated_at_profiles, set_updated_at_cars
-- on_auth_user_created
-- on_message_created, on_conversation_created
```

---

## 🔐 Security Configuration

### Enable Email Auth

Go to Supabase Dashboard → Authentication → Providers → Email:
- ✅ Enable email signup
- ✅ Enable email confirmations
- ✅ Require email confirmation
- Set redirect URL: `http://localhost:3000/auth/callback` (dev) or `https://yourdomain.com/auth/callback` (prod)

### Configure OAuth Providers

#### Google OAuth
1. Go to Authentication → Providers → Google
2. Enable Google provider
3. Add credentials from Google Cloud Console

#### Kakao OAuth (for Korean users)
1. Go to Authentication → Providers → Kakao
2. Enable Kakao provider
3. Add credentials from Kakao Developers

---

## 🧪 Testing Migrations

### Local Development Setup

```bash
# Start local Supabase (requires Docker)
supabase start

# Apply migrations to local DB
supabase db reset

# Generate types from local DB
supabase gen types typescript --local > src/types/database.types.ts

# Stop local Supabase
supabase stop
```

### Test Data Integrity

```bash
# Run test queries
supabase db execute --file tests/test_queries.sql
```

---

## 📚 Additional Resources

- [Supabase Migrations Documentation](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [TypeScript Type Generation](https://supabase.com/docs/guides/api/generating-types)

---

## ⚠️ Troubleshooting

### Migration Fails

```bash
# Check for syntax errors
supabase db lint

# View migration history
supabase migration list

# Rollback last migration (if needed)
supabase db reset --version 20250109000003
```

### RLS Blocking Queries

```bash
# Temporarily disable RLS for debugging (development only!)
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

# Re-enable after debugging
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
```

### Storage Upload Fails

- Check bucket exists and is public
- Verify RLS policies on `storage.objects`
- Check file size limits
- Verify MIME type is allowed

---

## 🎯 Next Steps

1. ✅ Apply all migrations
2. ✅ Set up storage buckets
3. ✅ Load seed data (development)
4. ✅ Regenerate TypeScript types
5. ✅ Test authentication flow
6. ✅ Test CRUD operations on cars
7. ✅ Test messaging functionality

---

**Need help?** Check Supabase docs or contact the development team.
