# SK AutoSphere — Alignment Summary

This summary references details from docs/alignment/ALIGNMENT.json.

## ✅ Fully Aligned
- Supabase-only data access via `@supabase/supabase-js` (no Prisma/Drizzle). Clients at:
  - `src/lib/supabase/client.ts`
  - `src/lib/supabase/server.ts`
- Auth via Supabase with SSR middleware:
  - `middleware.ts` -> `src/lib/supabase/middleware.ts`
- i18n via custom hook and JSON translations (no next-intl/i18next).
- shadcn/ui and lucide-react present.

## 🟡 Missing/Planned (install/configure)
- Prettier (missing from package.json)
- next-pwa (PWA)
- Testing stack (e.g., Vitest/Jest + Testing Library)
- Lighthouse CI (`@lhci/cli`)
- next.config images.remotePatterns for CDN/Supabase when using `<Image>` for listings

## 🔴 Violations (see ALIGNMENT.json)
- next@16.0.1 (preferences lock Next.js 14.2.x)
- react@19.2.0 / react-dom@19.2.0 (preferences lock React 18.3.x)
- tailwindcss@^4 (preferences lock Tailwind 3.4.x)
- Internal navigation uses `<a>`/`<button>` with router.push instead of `next/link` in `src/components/layout/Header.tsx`

## 🔍 Unknowns / Needs Confirmation
- Ensure `.env.local` contains valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for homepage data.
- Confirm whether listing image rendering will migrate to Next `<Image>` and Supabase Storage; if yes, add `remotePatterns`.
- Verify React Hook Form usage across seller forms (some components use local state).

## 📎 Evidence (files inspected)
- package.json
- next.config.ts
- src/app/page.tsx, src/app/cars/page.tsx, src/app/favorites/page.tsx
- src/components/layout/Header.tsx, src/components/car/CarCard.tsx
- src/context/LanguageContext.tsx
- supabase/migrations/*, supabase/seed/sample_data.sql
- src/lib/supabase/client.ts, src/lib/supabase/server.ts
