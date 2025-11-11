# SK AutoSphere Project Rules (Human Summary)

Derived from `Rules/.cursorrules` and adapted to current React + Vite setup. We can evolve toward Next.js later without breaking these principles.

## 1) TypeScript & Validation
- Strict types; no `any`.
- Use Zod at boundaries (API inputs, external data).

## 2) Components & State
- Keep components focused and typed.
- Explicit loading and error UI for async.
- Extract complex logic to hooks or `features/*` modules.

## 3) Structure
- `src/components` (ui, car, layout)
- `src/lib` (supabase, ai)
- `src/features` (auth, listings, favorites)
- `src/hooks`, `src/types`

## 4) Naming
- Files kebab-case. Components/Types PascalCase. Functions camelCase. Constants UPPER_SNAKE_CASE.

## 5) Supabase
- Typed client. No service role on client.
- Select explicit columns. RLS enabled and tested.
- Handle errors and return typed data.

## 6) AI (Gemini)
- Server-only. Never expose key.
- Prompts specify output format and temperature.

## 7) Security & Env
- Secrets in `.env.local` (not committed).
- Only `VITE_` vars can be exposed client-side and only if truly public.

## 8) Errors & Logging
- Client: toast + console for failures.
- Server: structured JSON, HTTP codes, concise logs.

## 9) Tests
- Vitest unit tests. Playwright E2E for core flows.

## 10) Accessibility & Performance
- Semantic HTML, keyboard nav, ARIA.
- Lazy images, code split where needed.

## 11) Git & Workflow
- Conventional Commits.
- Branch: `feature/FEATURE-ID-description`.
- Lint + type-check pre-PR. Reference PRD sections in PRs.

## References
- PRD: `Rules/PRD.md`
- Stack: `Rules/02-TECHNICAL-STACK.md`
- Core features: `Rules/03-FEATURES-CORE.md`
- AI: `Rules/04-FEATURES-AI.md`
- DB schema: `Rules/05-DATABASE-SCHEMA.md`
- Full context: `Rules/CLAUDE.md`
