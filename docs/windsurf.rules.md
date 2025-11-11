# Windsurf Rules for SK AutoSphere

Note: Derived from Rules/.cursorrules. Original remains unchanged. Current app runs React + Vite; Next.js patterns in the rules are retained where applicable and can be enabled later.

## Project Context
- Frontend: React (Vite) with TypeScript, Tailwind, shadcn/ui (optional)
- Backend: Supabase (PostgreSQL, Auth, Storage, Realtime)
- AI: Google Gemini API (server-side only)
- Mobile: React Native + Expo (future)

## Code Style
- TypeScript strict. No `any`; prefer `unknown` if truly needed.
- Prefer `type` over `interface` for object shapes.
- Use Zod for runtime validation at boundaries.
- Enforce ESLint + Prettier (add config later if missing).

## React Guidelines
- Prefer server-origin data fetching via API routes or server functions.
- Component design:
  - Keep components pure; lift state up; co-locate logic with feature folders.
  - Use Suspense-friendly APIs where possible.
- Loading and error states are mandatory for async flows.

## File Structure (Vite React now; Next.js later)
```
src/
  components/
    ui/
    car/
    layout/
  lib/
    supabase/
    ai/
  features/
    auth/
    listings/
    favorites/
  hooks/
  types/
```

## Naming
- Files: kebab-case (e.g., `car-card.tsx`, `use-translation.ts`).
- Components/Types: PascalCase (`CarCard`, `UserProfile`).
- Functions/vars: camelCase (`getCar`, `createListing`).
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`).

## Supabase Patterns
- Create a typed client. Never expose service role on client.
- Select specific columns, not `*`.
- Handle errors explicitly and return typed results.

Example:
```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function listCars(limit = 20) {
  const { data, error } = await supabase
    .from('cars')
    .select('id, make, model, year, price, images, seller:profiles(full_name, avatar_url)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
```

## AI (Gemini)
- Use server-only endpoints (e.g., Vite dev server middleware or backend API).
- Never expose `GEMINI_API_KEY` to the client.
- Specify outputs and temperature in prompts.

## Security
- Do not commit `.env.local` or secrets.
- Use `VITE_` prefix only for truly public values.
- Verify auth and roles on protected actions.

## Error Handling
- Client: try/catch + user feedback (e.g., toast), and console log for diagnostics.
- Server: catch, log, return structured JSON errors.

## Testing
- Unit: Vitest for utilities and components.
- E2E: Playwright for critical flows (auth, listing, favorites).

## i18n
- Centralize keys (e.g., `locales/translations.ts`).
- Use descriptive keys (`feature_action_description`).

## Performance & a11y
- Optimize images (e.g., width/height set, lazy loading).
- Keep bundle size small; code-split feature modules.
- Semantic HTML, focus order, keyboard nav, ARIA where needed.

## Git & Workflow
- Conventional Commits (e.g., `feat(auth): add email signup`).
- Feature branches: `feature/FEATURE-ID-description`.
- Run lint and type-check before PR.
- Link PR to relevant PRD section.

## References
- See `Rules/PRD.md`, `Rules/02-TECHNICAL-STACK.md`, `Rules/03-FEATURES-CORE.md`, `Rules/04-FEATURES-AI.md`, `Rules/05-DATABASE-SCHEMA.md`.
- Full context: `Rules/CLAUDE.md`.
```
