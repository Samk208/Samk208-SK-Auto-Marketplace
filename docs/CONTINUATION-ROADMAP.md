# SK AutoSphere - Continuation Roadmap

**Generated:** 2025-11-11
**Current Branch:** claude/review-project-structure-011CV1F3yCzBZys5pxoewfYf
**Project Phase:** Integration & Implementation (Phase 2.5)
**Completion Status:** ~60% → Target: 100% MVP

---

## 📋 Executive Summary

Your SK AutoSphere project has **excellent** documentation and architecture planning but requires **implementation execution** to become functional. This roadmap provides a clear path from current state (60%) to MVP launch (100%).

### Current Strengths ✅
- Comprehensive PRD and technical documentation
- Well-structured Next.js 14 project
- Supabase configured with database schema designed
- Specialized AI agents defined for each role
- Core dependencies installed

### Critical Gaps ⚠️
- Environment variables not configured
- Database migrations not applied
- Missing key dependencies (React Query, Redis, image compression)
- Components using mock data
- Storage buckets not created
- TypeScript types not generated

---

## 🎯 Phase-by-Phase Implementation Plan

### **Phase 1: Foundation Setup** (PRIORITY: P0 - Day 1-2)

**Estimated Time:** 4-6 hours

#### 1.1 Environment Configuration

**Status:** ⚠️ CRITICAL - `.env.local` file missing

**Actions:**
```bash
# Copy the example file
cp .env.example .env.local
```

**Required Credentials (you need to provide):**

1. **Supabase Credentials:**
   - URL: `https://teyloksuvmmhqixjqoch.supabase.co` (confirmed)
   - Anon Key: Get from https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/settings/api

2. **Gemini AI API Key:**
   - Get from: https://aistudio.google.com/app/apikey
   - Free tier: 60 requests/minute

3. **Upstash Redis (Optional for MVP, Required for Phase 2):**
   - Get from: https://console.upstash.com/
   - Free tier: 10,000 commands/day

**Verification:**
```bash
# Test that environment vars are loaded
npm run dev
# Should start without errors
```

---

#### 1.2 Install Missing Dependencies

**Status:** ⚠️ REQUIRED

```bash
# State Management & Data Fetching
npm install @tanstack/react-query @tanstack/react-query-devtools

# Image Optimization
npm install browser-image-compression

# Caching & Rate Limiting (for AI features)
npm install @upstash/redis @upstash/ratelimit

# PWA Support (Phase 2)
npm install next-pwa

# Testing (Optional for now)
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Current Package Status:**
- ✅ Next.js 16.0.1
- ✅ React 19.2.0
- ✅ Supabase SSR 0.7.0
- ✅ Gemini AI 0.24.1
- ✅ React Hook Form 7.66.0
- ✅ Zod 4.1.12
- ❌ TanStack Query - **MISSING**
- ❌ Upstash Redis - **MISSING**
- ❌ browser-image-compression - **MISSING**

---

#### 1.3 Database Migrations

**Status:** ⚠️ UNKNOWN - Need to verify

**Action Required:**

1. **Check current database state:**
   - Visit: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/editor
   - Verify which tables exist

2. **Apply migrations:**

**Option A: Using Supabase CLI** (Recommended)
```bash
# Install CLI if needed
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref teyloksuvmmhqixjqoch

# Check migration status
supabase db diff

# Apply all migrations
supabase db push
```

**Option B: Manual SQL Execution** (If CLI fails)
1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of each migration file from `supabase/migrations/`
3. Run in order:
   - `20250109000001_add_profile_fields.sql`
   - `20250109000002_add_car_fields.sql`
   - `20250109000003_create_messaging_tables.sql`
   - `20250109000004_create_favorites_table.sql`

**Expected Result:**
- 5 tables: `profiles`, `cars`, `conversations`, `messages`, `favorites`
- RLS policies enabled on all tables
- 15+ indexes created
- 3 database functions
- 4 triggers

---

#### 1.4 Storage Buckets Setup

**Status:** ❌ NOT CREATED

**Action Required:**

Navigate to: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/storage/buckets

**Create Bucket #1: car-images**
```javascript
Name: car-images
Public: ✅ Yes
File size limit: 5242880 (5 MB)
Allowed MIME types: image/jpeg, image/png, image/webp
```

**Create Bucket #2: avatars**
```javascript
Name: avatars
Public: ✅ Yes
File size limit: 2097152 (2 MB)
Allowed MIME types: image/jpeg, image/png, image/webp
```

**Apply RLS Policies:**

Go to SQL Editor and run:

```sql
-- Allow public read for car images
CREATE POLICY "car_images_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- Allow authenticated users to upload
CREATE POLICY "car_images_auth_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'car-images'
  AND auth.role() = 'authenticated'
);

-- Same for avatars
CREATE POLICY "avatars_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "avatars_auth_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);
```

---

#### 1.5 Generate TypeScript Types

**Status:** ❌ NOT GENERATED

**Action:**
```bash
# Generate types from live database
npx supabase gen types typescript \
  --project-id teyloksuvmmhqixjqoch \
  > src/types/database.types.ts
```

**Update Supabase Clients:**

The files `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` need to import the generated types:

```typescript
// Add to both files
import type { Database } from '@/types/database.types';

// Update createBrowserClient/createServerClient
createBrowserClient<Database>(...)
createServerClient<Database>(...)
```

---

### **Phase 2: Core Feature Implementation** (PRIORITY: P0 - Day 3-7)

**Estimated Time:** 20-30 hours

#### 2.1 Set Up React Query Provider

**File:** `src/app/providers.tsx` (CREATE NEW)

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Update:** `src/app/layout.tsx`
```typescript
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

#### 2.2 Homepage Integration (P0)

**Current Issue:** Uses empty array `[]` for cars

**Required Changes:**

**File:** `src/app/page.tsx`

**Replace mock data with:**
```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  // Fetch featured cars
  const { data: featuredCars } = await supabase
    .from('cars')
    .select(`
      *,
      dealer:profiles!dealer_id(
        full_name,
        avatar_url,
        verification_status,
        seller_rating
      )
    `)
    .eq('featured', true)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <main>
      <HeroSection />
      <FeaturedCars cars={featuredCars || []} />
      <SearchSection />
    </main>
  );
}
```

---

#### 2.3 Browse Cars Page (P0)

**File:** `src/app/cars/page.tsx`

**Add server-side filtering:**
```typescript
export default async function CarsPage({
  searchParams,
}: {
  searchParams: { make?: string; minPrice?: string; maxPrice?: string };
}) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('cars')
    .select(`
      *,
      dealer:profiles!dealer_id(full_name, avatar_url, verification_status)
    `)
    .eq('status', 'published');

  // Apply filters
  if (searchParams.make) {
    query = query.ilike('make', `%${searchParams.make}%`);
  }

  if (searchParams.minPrice) {
    query = query.gte('price', parseInt(searchParams.minPrice));
  }

  if (searchParams.maxPrice) {
    query = query.lte('price', parseInt(searchParams.maxPrice));
  }

  const { data: cars } = await query
    .order('created_at', { ascending: false })
    .range(0, 11); // 12 items per page

  return <CarsGrid cars={cars || []} />;
}
```

---

#### 2.4 Authentication Flows (P0)

**Files to Create:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/actions/auth.ts` (Server Actions)

**Key Features:**
- Email/Password signup with automatic profile creation
- Google OAuth (optional)
- Role selection (buyer/dealer)
- Email verification

**Reference:** See `docs/ARCHITECTURE-OUTPUT.md` lines 1143-1196

---

#### 2.5 Favorites Integration (P1)

**Current:** Uses localStorage only

**Required:** Sync with Supabase `favorites` table

**Create:** `src/hooks/use-favorites.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useFavorites() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Fetch user's favorites
  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('favorites')
        .select('car_id')
        .eq('user_id', user.id);

      return data?.map(f => f.car_id) || [];
    },
  });

  // Toggle favorite
  const toggleFavorite = useMutation({
    mutationFn: async (carId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const isFavorited = favorites?.includes(carId);

      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('car_id', carId);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, car_id: carId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return {
    favorites: favorites || [],
    toggleFavorite: toggleFavorite.mutate,
    isFavorited: (carId: string) => favorites?.includes(carId) || false,
  };
}
```

---

#### 2.6 Messaging System (P1)

**Files to Create:**
- `src/app/messages/page.tsx`
- `src/components/messaging/ChatWindow.tsx`
- `src/components/messaging/ConversationList.tsx`
- `src/app/actions/messages.ts`

**Key Features:**
- Real-time message delivery via Supabase Realtime
- AI translation (Gemini API)
- Read receipts
- Conversation list with last message preview

**Reference:** `docs/ARCHITECTURE-OUTPUT.md` lines 976-1141

---

### **Phase 3: AI Integration** (PRIORITY: P1 - Day 8-14)

**Estimated Time:** 15-20 hours

#### 3.1 AI Description Generator

**Create:** `src/app/api/ai/generate-description/route.ts`

**Features:**
- Generate 4-language descriptions (EN, KO, FR, SW)
- Cache results in Upstash Redis
- Rate limit: 10 requests/hour per user

**Reference:** `docs/ARCHITECTURE-OUTPUT.md` lines 755-856

---

#### 3.2 AI Message Translation

**Create:** `src/lib/ai/translate-message.ts`

**Features:**
- Auto-detect source language
- Translate to user's preferred language
- Cache translations
- Fallback to original if translation fails

**Reference:** `docs/ARCHITECTURE-OUTPUT.md` lines 858-903

---

#### 3.3 Upstash Redis Setup

**Create:** `src/lib/cache/redis.ts`

```typescript
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});
```

**Create:** `src/lib/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './cache/redis';

export const rateLimiters = {
  aiGeneration: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
  }),

  messaging: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    analytics: true,
  }),
};
```

---

### **Phase 4: Seller Dashboard** (PRIORITY: P1 - Day 15-21)

**Estimated Time:** 20-25 hours

#### 4.1 Dashboard Layout

**Create:** `src/app/seller-dashboard/layout.tsx`

**Features:**
- Sidebar navigation
- Stats overview (total listings, views, inquiries)
- Protected route (seller role required)

---

#### 4.2 Listings Management

**Create:**
- `src/app/seller-dashboard/listings/page.tsx`
- `src/app/seller-dashboard/listings/create/page.tsx`
- `src/app/seller-dashboard/listings/[id]/edit/page.tsx`

**Features:**
- CRUD operations for car listings
- Photo uploader with compression
- AI description generator integration
- Status workflow (draft → published → sold)

---

#### 4.3 Messaging Inbox

**Create:** `src/app/seller-dashboard/messages/page.tsx`

**Features:**
- List all buyer conversations
- Real-time message notifications
- Translation toggle

---

### **Phase 5: Testing & Optimization** (PRIORITY: P2 - Day 22-28)

#### 5.1 Quality Assurance

**Actions:**
- Manual testing of all user flows
- Fix TypeScript errors
- Accessibility audit (WCAG AA)
- Mobile responsiveness testing

---

#### 5.2 Performance Optimization

**Actions:**
- Run Lighthouse audit (target: >90 score)
- Optimize images (WebP format, lazy loading)
- Enable React Query caching
- Add loading skeletons

---

#### 5.3 SEO & Meta Tags

**Actions:**
- Add metadata to all pages
- Generate sitemap
- Add structured data (JSON-LD)
- Configure robots.txt

---

### **Phase 6: Deployment** (PRIORITY: P2 - Day 29-30)

#### 6.1 Netlify Deployment

**Actions:**
1. Create Netlify account
2. Connect GitHub repository
3. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
4. Add environment variables in Netlify dashboard
5. Deploy

---

#### 6.2 Domain Setup

**Actions:**
1. Purchase domain: skautosphere.com
2. Configure DNS in Netlify
3. Enable HTTPS

---

#### 6.3 Monitoring Setup

**Actions:**
- Add Sentry for error tracking
- Set up UptimeRobot for uptime monitoring
- Configure Supabase alerts

---

## 📊 Development Checklist

### Foundation Setup ⏳
- [ ] Create `.env.local` with real credentials
- [ ] Install missing npm packages
- [ ] Apply database migrations
- [ ] Create storage buckets (car-images, avatars)
- [ ] Generate TypeScript types
- [ ] Set up React Query provider

### Core Features ⏳
- [ ] Homepage: Fetch real featured cars
- [ ] Browse page: Server-side filtering
- [ ] Car detail page: Full vehicle info
- [ ] Authentication: Signup/Login flows
- [ ] Favorites: Database persistence
- [ ] Messaging: Real-time chat

### AI Features ⏳
- [ ] Get Gemini API key
- [ ] Get Upstash Redis credentials
- [ ] Implement description generator
- [ ] Implement message translation
- [ ] Set up rate limiting

### Seller Dashboard ⏳
- [ ] Dashboard layout
- [ ] Listings CRUD
- [ ] Photo uploader
- [ ] Messaging inbox
- [ ] Analytics stats

### Testing & Deployment ⏳
- [ ] Manual testing
- [ ] Fix TypeScript errors
- [ ] Lighthouse audit
- [ ] Deploy to Netlify
- [ ] Configure domain
- [ ] Set up monitoring

---

## 🚀 Quick Start (Next Steps)

### Immediate Actions (Today):

1. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env.local

   # Edit with your credentials
   nano .env.local
   ```

   **You need to provide:**
   - Supabase Anon Key (from dashboard)
   - Gemini API Key (get from Google AI Studio)
   - Upstash credentials (optional for MVP)

2. **Install dependencies:**
   ```bash
   npm install @tanstack/react-query @tanstack/react-query-devtools browser-image-compression @upstash/redis @upstash/ratelimit
   ```

3. **Verify database:**
   - Visit Supabase dashboard
   - Check which tables exist
   - Apply missing migrations if needed

4. **Test development server:**
   ```bash
   npm run dev
   ```

---

## 🎯 Success Metrics

### MVP Ready When:
- ✅ Users can browse car listings
- ✅ Users can sign up and log in
- ✅ Sellers can create listings
- ✅ Buyers can message sellers
- ✅ Messages are translated automatically
- ✅ No critical TypeScript errors
- ✅ Lighthouse score >80
- ✅ Deployed to production URL

---

## 📞 Support & Resources

### Documentation References:
- **PRD:** `docs/PRD.md`
- **Architecture:** `docs/ARCHITECTURE-OUTPUT.md`
- **Database Schema:** `docs/DATABASE-SCHEMA.md`
- **Integration Plan:** `docs/INTEGRATION-ACTION-PLAN.md`
- **Supabase Status:** `docs/SUPABASE-STATUS-REPORT.md`

### External Resources:
- Next.js 14 Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- TanStack Query: https://tanstack.com/query/latest
- Gemini API: https://ai.google.dev/docs

---

## ⚡ Estimated Timeline

| Phase | Duration | Effort |
|-------|----------|--------|
| Foundation Setup | 2 days | 6 hours |
| Core Features | 5 days | 30 hours |
| AI Integration | 7 days | 20 hours |
| Seller Dashboard | 7 days | 25 hours |
| Testing & Optimization | 7 days | 15 hours |
| Deployment | 2 days | 5 hours |
| **TOTAL** | **30 days** | **~100 hours** |

**Full-time work:** 3-4 weeks
**Part-time work (20h/week):** 5-6 weeks

---

## 🎉 You're Ready to Continue!

**Current Status:** 60% Complete
**Next Milestone:** 70% (Foundation Setup Complete)
**Target:** 100% MVP Launch

Start with Phase 1 (Foundation Setup) and work through systematically. Let me know when you're ready to begin, and I can help with any specific implementation!
