# SK AutoSphere — Investigative Report

This report contains the outputs requested: a typecheck-only report and a structured investigation mapping the frontend features to the Supabase backend, with an images deep-dive.

## BLOCK A — TYPECHECK REPORT (JSON)
```json
{
  "typecheck": {
    "tool": "npm",
    "command": "npx tsc --noEmit",
    "passed": false,
    "errors": [
      {
        "file": "src/components/seller/MyListingsTab.tsx",
        "line": 141,
        "column": 65,
        "code": "TS2722",
        "message": "Cannot invoke an object which is possibly 'undefined'."
      },
      {
        "file": "src/components/seller/ProfileTab.tsx",
        "line": 3,
        "column": 21,
        "code": "TS2305",
        "message": "Module '../../types' has no exported member 'ToastMessage'."
      },
      {
        "file": "src/components/seller/ProfileTab.tsx",
        "line": 23,
        "column": 49,
        "code": "TS2551",
        "message": "Property 'fullName' does not exist on type 'User'. Did you mean 'full_name'?"
      },
      {
        "file": "src/components/seller/ProfileTab.tsx",
        "line": 27,
        "column": 45,
        "code": "TS2551",
        "message": "Property 'avatarUrl' does not exist on type 'User'. Did you mean 'avatar_url'?"
      },
      {
        "file": "src/components/seller/SellerDashboard.tsx",
        "line": 27,
        "column": 44,
        "code": "TS2339",
        "message": "Property 'role' does not exist on type 'never'."
      },
      {
        "file": "src/components/seller/SellerDashboard.tsx",
        "line": 50,
        "column": 31,
        "code": "TS2339",
        "message": "Property 'full_name' does not exist on type 'never'."
      },
      {
        "file": "src/components/seller/SellerDashboard.tsx",
        "line": 81,
        "column": 13,
        "code": "TS2322",
        "message": "Type '{ ... }[]' is not assignable to type 'Car[]'. Missing properties such as 'location', 'imageUrls'."
      },
      {
        "file": "src/components/seller/SellerDashboard.tsx",
        "line": 93,
        "column": 13,
        "code": "TS2322",
        "message": "Type '((message: string, type?: \"error\" | \"success\" | \"info\" | undefined) => void) | undefined' is not assignable to type '(message: string, type?: any) => void'."
      },
      {
        "file": "src/components/ui/Select.tsx",
        "line": 49,
        "column": 75,
        "code": "TS2322",
        "message": "Type 'RefObject<HTMLButtonElement | null>' is not assignable to type 'RefObject<HTMLButtonElement>'."
      },
      {
        "file": "src/lib/constants.ts",
        "line": 2,
        "column": 32,
        "code": "TS2307",
        "message": "Cannot find module './types' or its corresponding type declarations."
      },
      {
        "file": "src/locales/translations.ts",
        "line": 2,
        "column": 15,
        "code": "TS2305",
        "message": "Module '../types' has no exported member 'Language'."
      }
    ],
    "warnings": [
      {
        "file": "src/components/home/CarListingPage.tsx",
        "line": 127,
        "column": 6,
        "ruleOrCode": "react-hooks/exhaustive-deps",
        "message": "useCallback missing dependency 'supabase'. Either include it or remove the dependency array."
      },
      {
        "file": "src/app/actions/cars.ts",
        "line": 141,
        "column": 61,
        "ruleOrCode": "@typescript-eslint/no-explicit-any",
        "message": "Unexpected any. Specify a different type."
      },
      {
        "file": "src/app/actions/cars.ts",
        "line": 208,
        "column": 61,
        "ruleOrCode": "@typescript-eslint/no-explicit-any",
        "message": "Unexpected any. Specify a different type."
      }
    ]
  }
}
```

## BLOCK B — INVESTIGATION SUMMARY (MARKDOWN)

### 1) Frontend Feature Inventory

| Feature | Where in Code (paths) | Route/Entry Point | Status (wired / latent / broken) | Requires Images? (Y/N) |
|---|---|---|---|---|
| Home (Hero + Featured Cars) | src/app/page.tsx, src/components/home/HeroSection.tsx, src/components/home/FeaturedCars.tsx, src/components/car/CarCard.tsx | / | wired | Y |
| Listings index (placeholder) | src/app/cars/page.tsx | /cars | latent | N |
| Favorites (placeholder) | src/app/favorites/page.tsx | /favorites | latent | N |
| Seller Dashboard | src/app/seller-dashboard/*, src/components/seller/* | /seller-dashboard | wired but type-broken | Y |
| Messages (likely) | src/app/messages/* | /messages | latent | N |
| Auth (helpers present) | src/lib/supabase/* (@supabase/ssr) | n/a | wired infra only | N |
| i18n/translations | src/locales/translations.ts, hooks/useTranslation | n/a | wired | N |
| AI recs/chat modal (home) | src/components/home/{AIRecommendations,ChatModal}.tsx | / (sections) | latent until wired with data | N |

Notes:
- Home fetches featured cars via server action `getFeaturedCars` and maps to UI `Car` in `src/app/page.tsx`.
- Seller Dashboard and Seller tabs show multiple TS mismatches with DB/UI types.
- `CarCard` uses plain `<img>` from `car.imageUrls[0]`.

### 2) Supabase / Backend Resources

| Resource (table/view/RPC/storage) | Definition Source (path/migration) | Key Columns/Args | RLS (on/off & brief summary) | Used by Frontend? (Y/N) |
|---|---|---|---|---|
| profiles (table) | supabase/migrations/20250109000000_baseline_schema.sql; 20250109000001_add_profile_fields.sql | id (PK, auth.users FK), full_name, avatar_url, role, language_preference, country, phone_number, verification_status, seller_rating, business_name, created_at | ON. Public SELECT; update own row | Y |
| cars (table) | baseline + 20250109000002_add_car_fields.sql | id, make, model, year, price, currency, description, description_en/fr/sw, location_country, location_city, images text[], status as constrained text, specifications jsonb, dealer_id (profiles FK), featured, view_count, inquiry_count, ai_generated, shipping_available, created_at, updated_at | ON. Public can SELECT published; dealer can manage own | Y |
| increment_car_views (RPC) | 20250109000002_add_car_fields.sql | car_id uuid | n/a (SECURITY DEFINER) | Y |
| conversations (table) | 20250109000003_create_messaging_tables.sql | id, car_id, buyer_id, seller_id, last_message_at, created_at | ON. User is buyer/seller | N |
| messages (table) | 20250109000003_create_messaging_tables.sql | id, conversation_id, sender_id, content, content_translated, read_at, created_at | ON. User in conversation; update own | N |
| favorites (table) | 20250109000004_create_favorites_table.sql | id, user_id, car_id, created_at | ON. Own favorites | N |
| storage buckets | n/a in migrations | — | — | N (images use external URLs) |

### 3) Feature ↔ Backend Mapping

| Feature | Expected Data/Endpoint (from FE) | Actual Supabase Resource | Schema/Type Match? (Y/N) | Notes |
|---|---|---|---|---|
| Home Featured Cars | `getFeaturedCars(limit)` -> cars where featured=true, status='published'; FE expects `images` -> `imageUrls` | public.cars | Y (via mapping) | Mapping in `src/app/page.tsx` converts DB shape to UI.
| Listing Card | `Car` with `location.city/country`, `imageUrls[0]` | public.cars: `location_city/country`, `images text[]` | Y (via mapping) | Works if data returned.
| Seller Dashboard | Expects `profile.role`, `profile.full_name`, etc.; also `Car[]` in UI shape | profiles, cars | N | Multiple TS errors indicate mismatches and undefined types.
| Favorites | Visual-only toggle in `useFavorites` | favorites | Needs Confirmation | No wired queries/mutations located in reviewed UI.
| Messages | UI directory present | conversations/messages | Needs Confirmation | FE calls not found in pages reviewed.
| Auth | Supabase SSR clients | @supabase/ssr | Y | Requires valid `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`.

### 4) Homepage & Images — Deep Dive Findings

- `CarCard.tsx:53` renders `<img src={car.imageUrls[0]}>`. Next.js images config is irrelevant for `<img>` tags.
- Data mapping in `src/app/page.tsx:10-28` converts DB rows to UI `Car`. If `result.success` is false or `result.data` is empty, the grid shows nothing.
- `getFeaturedCars` applies `{ featured: true, status: 'published' }` filters (`src/app/actions/cars.ts:383-389`). Seed includes matching rows with Unsplash URLs (`supabase/seed/sample_data.sql`).
- Supabase clients read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (`src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`). If these are missing/invalid at runtime, all queries fail -> no cars -> no images. [Needs Confirmation]
- RLS allows public SELECT of published cars; not a blocker for homepage if env is correct.
- No storage buckets are defined in migrations; images are full external URLs, so no signed URL code is necessary.

### 5) Notable Gaps & Risks (No Fixes)

- High • FE/Contract: UI `Car` vs DB `cars` shape mismatch in Seller Dashboard (expects `location` object, `imageUrls`). TS2322 and likely runtime issues.
- High • FE: `User` type mismatches (`fullName` vs `full_name`, `avatarUrl` vs `avatar_url`). Several TS errors in seller components.
- High • BE/Config: Supabase env reliance. Missing/invalid env leads to empty homepage and no images.
- Medium • FE: `Select` ref typing issue in `src/components/ui/Select.tsx`.
- Medium • FE: `any` usage in actions.
- Medium • FE: Hooks dependency warning in `CarListingPage`.
- Low • Infra: `next.config.ts` has no image config; fine for `<img>`, but will be needed for `next/image` if adopted.

### 6) Fast Manual Verifications (Read-only)

- rg -n "createServerSupabaseClient|createClient" src/lib/supabase
- rg -n "from\(['\"]cars['\"]\)" -S src app
- rg -n "featured.*status.*'published'" -S src/app/actions/cars.ts
- rg -n "images\.domains|remotePatterns" next.config.*
- rg -n "NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY" -S
- rg -n "profiles:dealer_id" -S src/app/actions/cars.ts
- rg -n "increment_car_views" -S
- Inspect supabase/migrations/* for RLS and constraints (done)
- Inspect supabase/seed/sample_data.sql to confirm featured/published (done)
