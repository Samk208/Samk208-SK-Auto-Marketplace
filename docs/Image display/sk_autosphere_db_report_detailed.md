# SK AutoSphere — Supabase Database Audit (Detailed)

**Generated:** 2025-11-12 08:51:22  
**Schema:** `public` (PostgreSQL on Supabase)

---

## 0) Executive Summary

- **Tables:** `profiles`, `cars` (both with **RLS enabled**).  
- **Data present:** 5 cars (2 `featured=true & status='published'`) linked to seller **Test Dealer** (`d5917cbd-aa6b-4492-b21e-cb40f56ebca7`).  
- **Policies:** Public read on both tables; authenticated users can insert cars; owners can update/delete their own cars; temporary **anon insert for seeding** exists.  
- **Constraints:** Multiple `CHECK` constraints (roles, languages, verification status, rating range).  
- **FK:** `cars.dealer_id → profiles.id` (ON UPDATE CASCADE, ON DELETE SET NULL).  
- **Gaps/risks:** No ENUMs (CHECKs used), no timestamp triggers, anon insert policy should be removed for production, frontend wasn’t fetching featured cars (now addressed in prompts).

---

## 1) Environment & Connection (expected)

These env vars are used by SSR queries via `@supabase/ssr`:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

> Server-side example is included in §8 for `Featured Cars` query.

---

## 2) Table: `profiles`

**Purpose:** Marketplace users (buyers/sellers).

### Columns
| Name | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | — | Primary identifier; should map to `auth.uid()` when using Supabase Auth |
| `full_name` | `text` | YES | — | Display name |
| `avatar_url` | `text` | YES | — | URL to avatar (DiceBear used in seed) |
| `role` | `text` | NO | — | **CHECK** allows **only** `'buyer','seller'` |
| `language_preference` | `text` | YES | — | **CHECK** `'en','ko','fr','sw'` |
| `country` | `text` | YES | — |  |
| `phone_number` | `text` | YES | — |  |
| `verification_status` | `text` | YES | — | **CHECK** `'unverified','pending','verified','rejected'` |
| `seller_rating` | `numeric` | YES | — | **CHECK** `0 ≤ rating ≤ 5` |
| `business_name` | `text` | YES | — | Seller company |
| `business_registration` | `text` | YES | — | e.g., KR number |
| `created_at` | `timestamptz` | YES | — |  |
| `updated_at` | `timestamptz` | YES | — |  |

### Constraints (actual expressions captured earlier)
```sql
-- roles
CHECK (role = ANY (ARRAY['buyer','seller']));

-- languages
CHECK (language_preference = ANY (ARRAY['en','ko','fr','sw']));

-- verification statuses
CHECK (verification_status = ANY (ARRAY['unverified','pending','verified','rejected']));

-- rating
CHECK ((seller_rating >= 0) AND (seller_rating <= 5));
```

### RLS (profiles)
```sql
-- Viewable by everyone
USING (true)            -- SELECT

-- Users can insert their own profile
CHECK (auth.uid() = id) -- INSERT

-- Users can update own profile
USING (auth.uid() = id) -- UPDATE
```

---

## 3) Table: `cars`

**Purpose:** Vehicle listings.

### Columns
| Name | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | — | PK |
| `make` | `text` | NO | — | e.g., Hyundai, Kia |
| `model` | `text` | NO | — | Sonata, Sportage |
| `year` | `integer` | NO | — |  |
| `price` | `numeric` | NO | — |  |
| `currency` | `text` | NO | — | 'USD' etc. |
| `description` | `text` | YES | — | Base description |
| `description_en` | `text` | YES | — | Optional localized |
| `description_fr` | `text` | YES | — | Optional localized |
| `description_sw` | `text` | YES | — | Optional localized |
| `location_country` | `text` | NO | — |  |
| `location_city` | `text` | NO | — |  |
| `images` | `text[]` | YES | — | Array of URLs |
| `status` | `text` | NO | — | free text (commonly `'published'`) |
| `featured` | `boolean` | YES | false | homepage flag |
| `specifications` | `jsonb` | YES | — | structured attributes |
| `dealer_id` | `uuid` | NO | — | FK to `profiles.id` |
| `view_count` | `integer` | YES | 0 | optional analytics |
| `inquiry_count` | `integer` | YES | 0 | optional analytics |
| `ai_generated` | `boolean` | YES | false | optional |
| `shipping_available` | `boolean` | YES | false | optional |
| `created_at` | `timestamptz` | YES | — |  |
| `updated_at` | `timestamptz` | YES | — |  |

### Foreign Keys & Indexes
```sql
ALTER TABLE public.cars
  ADD CONSTRAINT cars_dealer_id_fkey
  FOREIGN KEY (dealer_id) REFERENCES public.profiles(id)
  ON UPDATE CASCADE ON DELETE SET NULL;
```

**Recommended Indexes (performance):**
```sql
-- featured & published for homepage
CREATE INDEX IF NOT EXISTS idx_cars_featured_published
  ON public.cars (created_at DESC)
  WHERE featured = true AND status = 'published';

-- lookups by dealer
CREATE INDEX IF NOT EXISTS idx_cars_dealer_id ON public.cars (dealer_id);

-- status-only filters (catalog pages)
CREATE INDEX IF NOT EXISTS idx_cars_status ON public.cars (status);
```

### RLS (cars)
```sql
-- Anyone can view cars (consider narrowing to published only later)
USING (true)                                      -- SELECT

-- Authenticated can create cars
CHECK (auth.role() = 'authenticated')             -- INSERT

-- Owners can update/delete own listing
USING (auth.uid() = dealer_id)                    -- UPDATE/DELETE

-- Temporary policy used during seeding (remove for prod)
CHECK (true)                                      -- INSERT (anon)
```

---

## 4) Known Values & Entities

- **Seller (seeded):**  
  `id = d5917cbd-aa6b-4492-b21e-cb40f56ebca7`  
  `full_name = "Test Dealer"`  
  `role = 'seller'`  
  `verification_status = 'verified'`  
  `seller_rating = 4.8`

- **Cars (seed snapshot):** 5 total / 2 featured & published  
  Brands: Hyundai (Sonata 2022, Tucson 2021), Kia (Sportage 2021, Sorento 2019), Genesis (G70 2020).  
  Locations: Seoul, Busan, Incheon, Daegu, Gwangju.  
  Images: Unsplash URLs.  
  `specifications` include engine, transmission, fuel_type, color, mileage_km.

---

## 5) Integrity & Security Posture

- ✅ **RLS enabled** on both tables.  
- ✅ **FK integrity** for `dealer_id`.  
- ⚠️ **Anon insert policy** exists on `cars` for seeding — **remove in production**:  
  ```sql
  DROP POLICY IF EXISTS "Allow anon insert for seeding" ON public.cars;
  ```
- ⚠️ **Roles are string CHECKs** (no ENUM). Consider ENUM migration (see §9.2).  
- ⚠️ **No timestamp triggers**; `updated_at` relies on application code (see §9.1).

---

## 6) Typical Queries & Diagnostics

### 6.1 Inventory health
```sql
-- How many cars overall / featured / featured+published
SELECT
  COUNT(*) FILTER (WHERE true)                                AS cars_total,
  COUNT(*) FILTER (WHERE featured = true)                     AS cars_featured,
  COUNT(*) FILTER (WHERE status = 'published')                AS cars_published,
  COUNT(*) FILTER (WHERE featured = true AND status='published')
    AS cars_featured_published
FROM public.cars;
```

### 6.2 Seller inventory
```sql
SELECT make, model, year, price, featured, status
FROM public.cars
WHERE dealer_id = 'd5917cbd-aa6b-4492-b21e-cb40f56ebca7'
ORDER BY created_at DESC;
```

### 6.3 Role/constraint audit (current)
```sql
SELECT conname, pg_get_expr(c.conbin, c.conrelid) AS check_expr
FROM   pg_constraint c
JOIN   pg_class t ON t.oid = c.conrelid
JOIN   pg_namespace n ON n.oid = t.relnamespace
WHERE  n.nspname = 'public'
AND    t.relname IN ('profiles','cars')
AND    c.contype = 'c';
```

---

## 7) Frontend Alignment Notes

- The homepage previously passed `[]` to `<FeaturedCars />`. Use SSR fetch with `@supabase/ssr` and `cookies()` to load `featured=true & status='published'` (sample in §8).  
- **Hydration mismatch** came from SVGs using `viewBox="0 0 24"` instead of `viewBox="0 0 24 24"`. Normalize to avoid overlay warnings.  
- For external images (Unsplash / future Supabase storage), configure in `next.config.js`:
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: '*.supabase.co' }
  ]
}
```

---

## 8) Server-side Featured Cars (canonical example)

```ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export async function getFeaturedCarsSSR() {
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            // @ts-expect-error next/headers typing
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const { data, error } = await supabase
    .from('cars')
    .select(`*,
      dealer:profiles!cars_dealer_id_fkey (id, full_name, avatar_url, role)`)
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return { data, error };
}
```

---

## 9) Recommended Migrations

### 9.1 Timestamp trigger (keep `updated_at` accurate)
```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_cars_updated_at ON public.cars;
CREATE TRIGGER trg_cars_updated_at
BEFORE UPDATE ON public.cars
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 9.2 Optional: move string checks to ENUMs
```sql
-- Example: role_enum and verification_status_enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
    CREATE TYPE role_enum AS ENUM ('buyer','seller');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status_enum') THEN
    CREATE TYPE verification_status_enum AS ENUM ('unverified','pending','verified','rejected');
  END IF;
END $$;

ALTER TABLE public.profiles
  ALTER COLUMN role TYPE role_enum USING role::role_enum,
  ALTER COLUMN verification_status TYPE verification_status_enum USING verification_status::verification_status_enum;

-- Drop old CHECKs once migrated.
```

### 9.3 Harden RLS (optional)
```sql
-- Restrict SELECT only to published cars for anon users:
DROP POLICY IF EXISTS "Cars are viewable by everyone." ON public.cars;
CREATE POLICY "Public can view published cars"
ON public.cars FOR SELECT
USING (status = 'published');

-- Remove seeding policy:
DROP POLICY IF EXISTS "Allow anon insert for seeding" ON public.cars;
```

---

## 10) Storage (future-proof)

When moving from Unsplash to Supabase Storage:

1. Create bucket `car-images` (public read).  
2. RLS example for signed uploads by authenticated users (dealer role checks can be added in app layer).  
3. Save public URLs in `cars.images`.  
4. Add Supabase CDN host to `next.config.js` `remotePatterns`.

---

## 11) Quick Validation Checklist

- [ ] `supabase migration list` shows all expected migrations applied.  
- [ ] `cars_dealer_id_fkey` exists.  
- [ ] Indexes created (featured_published, dealer_id, status).  
- [ ] RLS: anon `INSERT` policy removed for production.  
- [ ] Seed data visible on Home and `/cars`.  
- [ ] Frontend `<Image>` domains configured.  
- [ ] No hydration mismatch warnings in dev.  

---

## 12) Appendix — Current Known IDs

```json
{
  "seller_profile": {
    "id": "d5917cbd-aa6b-4492-b21e-cb40f56ebca7",
    "name": "Test Dealer",
    "role": "seller"
  }
}
```

---

**End of Report**
