# SK AutoSphere - Database Integration Action Plan

**Created:** 2025-01-09
**Status:** Ready for Implementation
**Estimated Time:** 2-3 days for complete integration

---

## 🎯 Executive Summary

Your SK AutoSphere project now has:
- ✅ **Complete database documentation** (DATABASE-SCHEMA.md)
- ✅ **5 migration files** capturing current + enhancements
- ✅ **TypeScript types** for type-safe database access
- ✅ **Seed data** for testing
- ✅ **Comprehensive setup guide** (supabase/README.md)

**Current State:** Database exists in Supabase, but not properly integrated into codebase.

**Goal:** Fully integrate Supabase into your Next.js app so data flows from database to UI.

---

## 📊 What Was Created

### 1. Documentation
- `docs/DATABASE-SCHEMA.md` - Complete schema documentation with examples
- `supabase/README.md` - Step-by-step setup and troubleshooting guide

### 2. Database Migrations
| File | Purpose | Status |
|------|---------|--------|
| `20250109000000_baseline_schema.sql` | Captures current state (profiles + cars) | ⚠️ Run if starting fresh |
| `20250109000001_add_profile_fields.sql` | Adds 7 missing fields to profiles | 🔄 Apply next |
| `20250109000002_add_car_fields.sql` | Adds 8 fields to cars (multilingual, analytics) | 🔄 Apply next |
| `20250109000003_create_messaging_tables.sql` | Creates conversations + messages | 🔄 Apply next |
| `20250109000004_create_favorites_table.sql` | Creates favorites table | 🔄 Apply next |

### 3. TypeScript Types
- `src/types/database.types.ts` - Type-safe Supabase client

### 4. Seed Data
- `supabase/seed/sample_data.sql` - Test data (3 sellers, 3 buyers, 5 cars, chats)

### 5. Configuration
- `supabase/config.toml` - Supabase CLI configuration
- `.env.local` - Already configured ✅

---

## 🚀 Immediate Actions Required

### Day 1: Database Setup (2-3 hours)

#### Step 1: Install Supabase CLI (if needed)

```bash
# Check if installed
supabase --version

# If not installed:
npm install -g supabase

# Login
supabase login
```

#### Step 2: Link Your Project

```bash
# From project root
supabase link --project-ref teyloksuvmmhqixjqoch
```

#### Step 3: Apply Migrations

**Option A: All at once (recommended)**
```bash
supabase db push
```

**Option B: One by one (if you want control)**
```bash
# Skip baseline if your tables already exist
supabase db push --file supabase/migrations/20250109000001_add_profile_fields.sql
supabase db push --file supabase/migrations/20250109000002_add_car_fields.sql
supabase db push --file supabase/migrations/20250109000003_create_messaging_tables.sql
supabase db push --file supabase/migrations/20250109000004_create_favorites_table.sql
```

**Option C: Via SQL Editor (no CLI needed)**
1. Go to https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/editor
2. Copy contents of each migration file
3. Paste and click "Run"

#### Step 4: Load Test Data (Optional)

```bash
supabase db execute --file supabase/seed/sample_data.sql
```

#### Step 5: Verify Setup

```bash
# Check tables exist
supabase db diff

# Or in SQL Editor:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

**Expected tables:**
- profiles ✅
- cars ✅
- conversations ✅
- messages ✅
- favorites ✅

---

### Day 2: Storage Setup (1 hour)

#### Create Storage Buckets

1. Go to Supabase Dashboard → Storage
2. Create bucket: **car-images**
   - Public: Yes
   - Max file size: 5 MB
   - Allowed: image/jpeg, image/png, image/webp
3. Create bucket: **avatars**
   - Public: Yes
   - Max file size: 2 MB
   - Allowed: image/jpeg, image/png, image/webp

#### Apply RLS Policies

Copy the storage policies from `supabase/README.md` and run in SQL Editor.

---

### Day 3: Code Integration (4-6 hours)

#### Update Your Components to Use Real Data

**Example: HomePage with Real Cars**

```typescript
// src/app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export default async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Fetch featured cars
  const { data: featuredCars } = await supabase
    .from('cars')
    .select(`
      *,
      dealer:profiles!dealer_id(full_name, avatar_url)
    `)
    .eq('featured', true)
    .eq('status', 'published')
    .limit(4);

  return (
    <>
      <HeroSection />
      <FeaturedCars cars={featuredCars || []} />
    </>
  );
}
```

**Example: Browse Page with Filtering**

```typescript
// src/app/cars/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function CarsPage({ searchParams }: { searchParams: { make?: string } }) {
  const supabase = createServerComponentClient({ cookies });

  let query = supabase
    .from('cars')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (searchParams.make) {
    query = query.ilike('make', `%${searchParams.make}%`);
  }

  const { data: cars } = await query;

  return <CarGrid cars={cars || []} />;
}
```

**Example: Authentication Flow**

```typescript
// app/actions/auth.ts
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const supabase = createServerActionClient({ cookies });

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('fullName') as string,
        role: formData.get('role') as 'buyer' | 'seller',
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });

  if (error) throw error;
  redirect('/auth/verify-email');
}
```

---

## ✅ Verification Checklist

After completing integration:

### Database
- [ ] All 5 tables exist (profiles, cars, conversations, messages, favorites)
- [ ] RLS policies enabled on all tables
- [ ] Indexes created (check with `\di` in SQL editor)
- [ ] Triggers working (test by updating a row)

### Storage
- [ ] car-images bucket created and public
- [ ] avatars bucket created and public
- [ ] RLS policies applied to storage.objects
- [ ] Test upload works

### Code
- [ ] TypeScript types imported correctly
- [ ] Server Components fetch real data
- [ ] Client Components use createClientComponentClient
- [ ] Server Actions use createServerActionClient
- [ ] No TypeScript errors related to database types

### Features
- [ ] Homepage shows real featured cars
- [ ] Browse page shows real cars from database
- [ ] Can create new listing (seller flow)
- [ ] Can view car details
- [ ] Can send message (messaging flow)
- [ ] Can favorite cars

---

## 🐛 Common Issues & Solutions

### Issue: "relation 'profiles' does not exist"
**Solution:** Run baseline migration or check if tables exist:
```sql
SELECT * FROM public.profiles LIMIT 1;
```

### Issue: "permission denied for table profiles"
**Solution:** Check RLS policies are applied:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Issue: TypeScript errors with database types
**Solution:** Regenerate types:
```bash
npx supabase gen types typescript --project-id teyloksuvmmhqixjqoch > src/types/database.types.ts
```

### Issue: Can't upload images to storage
**Solution:**
1. Check bucket exists and is public
2. Verify RLS policies on storage.objects
3. Check file size/MIME type limits

---

## 📈 Expected Outcomes

After completing this integration:

### Before (Current State)
- ❌ Mock data everywhere
- ❌ "Coming soon" placeholders
- ❌ No real authentication
- ❌ No persistent data
- ❌ 35% feature completion

### After (Target State)
- ✅ Real data from Supabase
- ✅ Working authentication flow
- ✅ Users can create listings
- ✅ Buyers can browse and message
- ✅ 70% feature completion

---

## 🎯 Priority Feature Implementation Order

### Week 1: Core Data Flow (P0)
1. ✅ Database schema applied
2. ✅ Storage buckets created
3. Fetch cars on homepage
4. Fetch cars on browse page
5. View car details

### Week 2: Authentication (P0)
6. Signup flow
7. Login flow
8. Email verification
9. Protected routes
10. User profile display

### Week 3: Listing Management (P0)
11. Create listing form
12. Photo upload to Storage
13. Update listing
14. Delete listing
15. Publish/unpublish

### Week 4: Messaging (P1)
16. Create conversation
17. Send message
18. Real-time message delivery
19. Message history
20. Unread badge

---

## 📚 Reference Documents

| Document | Purpose | Location |
|----------|---------|----------|
| Database Schema | Complete schema docs with examples | `docs/DATABASE-SCHEMA.md` |
| Setup Guide | Step-by-step Supabase setup | `supabase/README.md` |
| Codebase Analysis | Gap analysis and recommendations | (Previous agent output) |
| PRD | Product requirements | `docs/PRD.md` |
| Vision Doc | Complete feature specifications | `docs/High-Level Vision & Specifications.txt` |

---

## 🆘 Getting Help

### Supabase Dashboard
- Project: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch
- SQL Editor: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/editor
- Table Editor: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/editor
- Storage: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/storage/buckets

### Documentation
- Supabase Docs: https://supabase.com/docs
- Next.js + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

---

## ✨ Success Metrics

Track your progress with these metrics:

| Metric | Current | Target | Notes |
|--------|---------|--------|-------|
| Tables in database | 2 | 5 | profiles, cars, conversations, messages, favorites |
| TypeScript coverage | 40% | 90% | With generated types |
| Real data integration | 10% | 100% | All components use Supabase |
| Feature completion | 35% | 70% | Core MVP features working |
| Time to integrate | N/A | 2-3 days | Following this plan |

---

**Ready to get started?** Begin with Day 1: Database Setup! 🚀

Questions? Check `supabase/README.md` or `docs/DATABASE-SCHEMA.md` for detailed guides.
