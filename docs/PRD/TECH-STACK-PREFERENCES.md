# SK AutoSphere - Tech Stack Preferences

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Status:** ✅ LOCKED - Agent Must Follow  
**Project:** SK AutoSphere (Web App + Future Mobile App)

---

## 🔒 CRITICAL RULES FOR AI AGENTS

**BEFORE YOU START:**
1. **READ THIS ENTIRE DOCUMENT** before making any technology choices
2. **YOU CANNOT CHANGE** any decisions marked with ✅ LOCKED without explicit user approval
3. **IF NOT SPECIFIED:** You may recommend solutions, but always prefer ecosystem-native options (Next.js plugins, Supabase features, etc.)
4. **ALWAYS ASK FIRST** before:
   - Changing a locked technology
   - Adding a new major dependency
   - Introducing a conflicting library
   - Switching from a specified solution

**WHY THIS MATTERS:**
- Prevents package conflicts and dependency hell
- Maintains consistency across the codebase
- Leverages existing integrations (Supabase, Next.js, etc.)
- Reduces bundle size by avoiding redundant libraries

---

## 📱 PLATFORM ARCHITECTURE

### Web Application (Current - Phase 1-2)
- **Status:** ✅ LOCKED - In Development
- **Framework:** Next.js 14.2.x (App Router)
- **Target:** Desktop + Mobile Web (PWA)
- **Deployment:** Netlify (primary), Vercel (backup consideration)

### Mobile Application (Future - Phase 3)
- **Status:** 🔮 PLANNED - Not Yet Started
- **Framework:** React Native with Expo (when implemented)
- **Target:** iOS + Android
- **Deployment:** EAS Build (Expo Application Services)

---

## 🎨 FRONTEND - WEB APPLICATION

### 1. Core Framework & Runtime

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **JavaScript Framework** | Next.js 14.2.x (App Router) | ✅ LOCKED | Server Components, built-in optimization, excellent DX |
| **React Version** | React 18.3.x | ✅ LOCKED | Concurrent features, Suspense, Server Components |
| **TypeScript** | TypeScript 5.x | ✅ LOCKED | Type safety, better IDE support, fewer runtime errors |
| **Node.js Version** | Node.js 20 LTS | ✅ LOCKED | Stable, long-term support, modern features |
| **Package Manager** | npm (default) | ✅ LOCKED | Simple, no extra config, works everywhere |

**Agent Rules:**
- ❌ DO NOT suggest Remix, Gatsby, or other React frameworks
- ❌ DO NOT downgrade React version
- ❌ DO NOT use JavaScript instead of TypeScript
- ✅ CAN suggest Next.js plugins that enhance functionality

---

### 2. UI Framework & Styling

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **CSS Framework** | Tailwind CSS 3.4.x | ✅ LOCKED | Utility-first, purged output <50KB, mobile-first |
| **Component Library** | shadcn/ui (Radix UI primitives) | ✅ LOCKED | Accessible, customizable, no vendor lock-in, copy-paste |
| **Icon Library** | lucide-react | ✅ LOCKED | Tree-shakeable, consistent style, maintained |
| **Form Components** | Radix UI (via shadcn/ui) | ✅ LOCKED | Accessible, unstyled primitives |
| **Animation Library** | tailwindcss-animate | ✅ LOCKED | Built-in with shadcn/ui, simple, performant |
| **CSS-in-JS** | NONE | ✅ LOCKED | Avoid runtime CSS-in-JS (slower TTI) |

**Agent Rules:**
- ❌ DO NOT suggest Material UI, Chakra UI, Ant Design, or other heavy component libraries
- ❌ DO NOT suggest Styled Components, Emotion, or other runtime CSS-in-JS
- ❌ DO NOT add Framer Motion unless user explicitly requests advanced animations
- ✅ CAN suggest additional Tailwind plugins (e.g., typography, forms)
- ✅ CAN add shadcn/ui components not yet installed

**Currently Installed shadcn/ui Components:**
- Button, Card, Input, Label, Select
- Dialog, Sheet, Tabs
- Badge, Avatar
- Dropdown Menu

**Available to Add (if needed):**
- Data Table, Combobox, Command
- Toast, Alert, Accordion
- Slider, Toggle, Switch

---

### 3. State Management

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Server State** | TanStack Query (React Query) 5.x | 🟡 TO INSTALL | Caching, background refetching, optimistic updates |
| **Client State** | React Context API + useState | ✅ LOCKED | Simple, built-in, no extra dependencies |
| **Form State** | React Hook Form 7.x + Zod 3.x | 🟡 TO INSTALL | Uncontrolled inputs, schema validation, small bundle |
| **Global State (if needed)** | Zustand 4.x | ⚪ OPTIONAL | Only if Context API insufficient |

**Agent Rules:**
- ❌ DO NOT suggest Redux, MobX, Recoil, or Jotai
- ❌ DO NOT use Formik (heavier than React Hook Form)
- ✅ INSTALL TanStack Query for all server state (cars, messages, profiles)
- ✅ INSTALL React Hook Form + Zod for all forms
- ✅ Use Context API for: auth state, language preference, theme
- ⚠️ ASK BEFORE adding Zustand (only if Context becomes unmanageable)

**Current Context Providers:**
- `LanguageContext` - User's language preference
- `AuthContext` - Supabase auth session (handled by Supabase)

**Forms Requiring React Hook Form:**
- Car listing creation form
- User profile edit form
- Search/filter form
- Contact seller form

---

### 4. Routing & Navigation

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Routing** | Next.js App Router | ✅ LOCKED | Built-in, file-based, Server Components support |
| **Navigation Components** | Next.js `<Link>` | ✅ LOCKED | Prefetching, client-side navigation |
| **Deep Linking** | Next.js dynamic routes | ✅ LOCKED | Built-in `[id]` and `[...slug]` routes |
| **Scroll Restoration** | Next.js built-in | ✅ LOCKED | Automatic scroll position restoration |

**Agent Rules:**
- ❌ DO NOT suggest React Router, Reach Router, or other routing libraries
- ❌ DO NOT use `<a>` tags for internal navigation (use `<Link>`)
- ✅ Use Next.js App Router conventions (app directory)
- ✅ Use `useRouter` hook for programmatic navigation

---

### 5. Internationalization (i18n)

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **i18n Solution** | Custom implementation | ✅ LOCKED | Lightweight (~2KB), only 4 languages needed |
| **Translation Format** | JSON files | ✅ LOCKED | Simple key-value structure |
| **Hook** | Custom `useTranslation()` | ✅ LOCKED | Already implemented |
| **Languages** | English, Korean, French, Swahili | ✅ LOCKED | Target markets |

**Agent Rules:**
- ❌ DO NOT install next-intl, react-i18next, or other i18n libraries
- ❌ DO NOT change to YAML, PO, or other translation formats
- ✅ USE existing `useTranslation()` hook from `src/hooks/useTranslation.ts`
- ✅ ADD missing translations to existing JSON files

**Translation Files:**
- `src/lib/i18n/en.json`
- `src/lib/i18n/ko.json`
- `src/lib/i18n/fr.json` (incomplete)
- `src/lib/i18n/sw.json` (incomplete)

---

### 6. Image Handling & Optimization

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Image Component** | Next.js `<Image>` | ✅ LOCKED | Auto-optimization, lazy loading, WebP conversion |
| **Image Upload** | Supabase Storage | ✅ LOCKED | CDN, RLS policies, 5GB free tier |
| **Client Compression** | browser-image-compression | 🟡 TO INSTALL | Compress before upload to save bandwidth |
| **Image Formats** | WebP (primary), AVIF (fallback) | ✅ LOCKED | Best compression, wide support |

**Agent Rules:**
- ❌ DO NOT use `<img>` tags for local images (use Next.js `<Image>`)
- ❌ DO NOT install Cloudinary, Uploadcare, or other image CDNs
- ✅ INSTALL browser-image-compression for client-side compression
- ✅ USE Supabase Storage for all uploaded images
- ✅ Configure Next.js remotePatterns for Supabase CDN

**Image Optimization Config:**
```javascript
// next.config.mjs
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 31536000,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'teyloksuvmmhqixjqoch.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

---

### 7. PWA & Offline Support

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **PWA Plugin** | next-pwa 5.x | 🟡 TO INSTALL | Service worker, offline caching, installable |
| **Offline Strategy** | NetworkFirst for API, CacheFirst for images | 🟡 TO CONFIGURE | Balance freshness and speed |
| **Workbox** | Via next-pwa | 🟡 TO INSTALL | Service worker utilities |

**Agent Rules:**
- ✅ INSTALL next-pwa when implementing offline features
- ✅ Configure caching strategies per resource type
- ⚠️ ASK BEFORE enabling PWA in development (can interfere with HMR)

---

### 8. Analytics & Monitoring

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Error Tracking** | Sentry | ⚪ OPTIONAL | Production error monitoring |
| **Analytics** | Netlify Analytics (basic) | ✅ LOCKED | Built-in, privacy-friendly |
| **Session Recording** | PostHog | ⚪ OPTIONAL | Only if needed for UX research |
| **Performance** | Lighthouse CI | 🟡 TO CONFIGURE | Automated performance audits |

**Agent Rules:**
- ✅ Use Netlify Analytics (included with hosting)
- ⚠️ ASK BEFORE adding Sentry (requires paid plan for production)
- ⚠️ ASK BEFORE adding Google Analytics (privacy concerns)
- ✅ Set up Lighthouse CI in GitHub Actions

---

## 🔧 BACKEND - WEB APPLICATION

### 9. Backend Runtime & API

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **API Architecture** | Next.js API Routes + Server Actions | ✅ LOCKED | Integrated, type-safe, no CORS issues |
| **Server Functions** | Supabase Edge Functions (Deno) | ✅ LOCKED | Global deployment, <100ms cold start |
| **Language** | TypeScript | ✅ LOCKED | Same language as frontend |

**Agent Rules:**
- ❌ DO NOT create separate Express/Fastify/Nest.js backend
- ❌ DO NOT use Python, Go, or other languages for backend
- ✅ USE Next.js Server Actions for mutations (preferred)
- ✅ USE Next.js API Routes for RESTful endpoints
- ✅ USE Supabase Edge Functions for:
  - Long-running operations (AI generation)
  - Scheduled jobs (cron jobs)
  - Webhooks (Stripe, external APIs)

**API Endpoints (if needed):**
- `/api/v1/*` - RESTful endpoints
- `/api/ai/*` - AI operations
- `/api/webhooks/*` - External webhooks

**Server Actions (preferred for forms):**
- `app/actions/listings.ts` - Car CRUD operations
- `app/actions/messages.ts` - Messaging operations
- `app/actions/profiles.ts` - Profile updates

---

### 10. Database & Storage

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Database** | PostgreSQL 17 (Supabase) | ✅ LOCKED | Relational, RLS, full-text search, JSON support |
| **ORM/Query Builder** | Supabase Client (REST API) | ✅ LOCKED | Type-safe, automatic joins, RLS enforcement |
| **File Storage** | Supabase Storage | ✅ LOCKED | S3-compatible, CDN, RLS policies |
| **Database Migrations** | Supabase CLI | ✅ LOCKED | Version controlled SQL migrations |

**Agent Rules:**
- ❌ DO NOT use Prisma, Drizzle, TypeORM, or other ORMs
- ❌ DO NOT use MongoDB, Firebase, or other databases
- ❌ DO NOT use AWS S3, Cloudinary, or other storage providers
- ✅ USE Supabase JavaScript client for all queries
- ✅ CREATE migrations with `supabase migration new`
- ✅ GENERATE TypeScript types with `supabase gen types typescript`

**Database Config:**
- Project ID: `teyloksuvmmhqixjqoch`
- Region: `ap-northeast-1` (Tokyo - closest to Seoul)
- PostgreSQL Version: 17
- Connection Pooling: PgBouncer (15 concurrent on free tier)

---

### 11. Authentication & Authorization

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Auth Provider** | Supabase Auth | ✅ LOCKED | Integrated with DB, RLS policies, OAuth support |
| **Session Management** | Supabase Auth (JWT in httpOnly cookies) | ✅ LOCKED | Secure, automatic refresh |
| **OAuth Providers** | Google OAuth (configured) | ✅ LOCKED | Quick signup for buyers |
| **Future OAuth** | Kakao OAuth (Korean sellers) | 🟡 PLANNED | Phase 2 feature |

**Agent Rules:**
- ❌ DO NOT use NextAuth, Auth0, Clerk, or other auth providers
- ❌ DO NOT store sessions in localStorage (security risk)
- ✅ USE Supabase Auth hooks: `useSupabaseUser()`, `useSession()`
- ✅ USE middleware for session refresh
- ✅ ENFORCE RLS policies (Row Level Security)

**Auth Configuration:**
- Password: min 8 chars, 1 uppercase, 1 number
- Session: 7 days
- Refresh token: 30 days
- Email verification: Required (enable in Supabase dashboard)

---

### 12. Real-Time Features

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Real-Time Engine** | Supabase Realtime (WebSocket) | ✅ LOCKED | PostgreSQL CDC, presence, broadcast |
| **Use Cases** | Messaging, listing updates, online status | ✅ LOCKED | Native integration with database |

**Agent Rules:**
- ❌ DO NOT use Socket.io, Pusher, Ably, or other real-time services
- ✅ USE Supabase Realtime for all real-time features
- ✅ SUBSCRIBE to `postgres_changes` for database events
- ✅ USE `channel.on()` for real-time subscriptions

**Real-Time Subscriptions:**
```typescript
supabase
  .channel('conversation:123')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: 'conversation_id=eq.123'
  }, handleNewMessage)
  .subscribe();
```

---

### 13. AI & Machine Learning

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **LLM Provider** | Google Gemini API | ✅ LOCKED | Free tier, multimodal (text + images), fast |
| **Primary Model** | gemini-2.0-flash-exp | ✅ LOCKED | Experimental, free, 1500 requests/day |
| **Fallback Model** | gemini-1.5-flash | 🟡 CONFIGURED | Stable, paid tier, if free tier exhausted |
| **SDK** | @google/generative-ai | 🟡 TO INSTALL | Official Gemini SDK |

**Agent Rules:**
- ❌ DO NOT use OpenAI, Anthropic Claude, or other LLM providers without approval
- ❌ DO NOT use LangChain, LlamaIndex (overkill for our use case)
- ✅ INSTALL @google/generative-ai package
- ✅ USE Gemini for:
  - Vehicle description generation (4 languages)
  - Real-time message translation
  - Image analysis (Phase 2)
- ✅ CACHE translations in Redis (Upstash)

**API Keys:**
- Environment variable: `GEMINI_API_KEY`
- Get key from: https://aistudio.google.com/apikey

---

### 14. Caching & Rate Limiting

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Redis** | Upstash Redis (serverless) | 🟡 TO CONFIGURE | Free tier 10K requests/day, low latency |
| **Rate Limiting** | @upstash/ratelimit | 🟡 TO INSTALL | Sliding window algorithm |
| **Use Cases** | AI translation cache, rate limiting, session data | ✅ LOCKED | Reduce AI costs, prevent abuse |

**Agent Rules:**
- ❌ DO NOT use Redis Labs, AWS ElastiCache, or other Redis providers
- ✅ INSTALL @upstash/redis and @upstash/ratelimit
- ✅ CACHE AI responses for 7 days
- ✅ IMPLEMENT rate limiting for:
  - AI generation: 10 requests/hour per user
  - Messaging: 60 messages/minute per user
  - Login attempts: 5 per 15 minutes per IP

**Upstash Configuration:**
```env
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token
```

---

### 15. Email & Notifications

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Email (Transactional)** | Supabase Auth (built-in) | ✅ LOCKED | Verification emails, password reset |
| **Email (Marketing)** | TBD | ⚪ FUTURE | Phase 2 - when needed |
| **Push Notifications** | TBD | ⚪ FUTURE | Phase 2 - web push or mobile |

**Agent Rules:**
- ✅ USE Supabase Auth for transactional emails
- ⚠️ ASK BEFORE adding SendGrid, Mailgun, Resend, or other email services
- ⚠️ ASK BEFORE adding Firebase Cloud Messaging or OneSignal

---

### 16. Payments (Phase 3)

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Payment Processor** | Stripe | 🔮 PLANNED | Industry standard, escrow support |
| **Alternative** | PayPal | ⚪ OPTIONAL | Some African buyers prefer PayPal |

**Agent Rules:**
- ⚠️ ASK BEFORE implementing any payment logic (Phase 3 feature)
- ✅ Use Stripe API (when implemented)
- ❌ DO NOT store credit card information (PCI DSS compliance)

---

## 🛠️ DEVELOPMENT TOOLS

### 17. Code Quality & Linting

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Linter** | ESLint | ✅ LOCKED | Next.js built-in config |
| **Formatter** | Prettier | ✅ LOCKED | Consistent code style |
| **TypeScript Checker** | tsc --noEmit | ✅ LOCKED | Type checking without compilation |
| **Pre-commit Hooks** | Husky + lint-staged | ⚪ OPTIONAL | Enforce quality before commit |

**Agent Rules:**
- ✅ RUN `npm run lint` before committing
- ✅ RUN `npm run type-check` before building
- ✅ FIX all ESLint errors (not warnings)
- ⚠️ ASK BEFORE adding ESLint plugins

---

### 18. Testing

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Unit Testing** | Vitest | 🟡 PLANNED | Fast, Vite-based, Jest-compatible |
| **Component Testing** | React Testing Library | 🟡 PLANNED | User-centric testing |
| **E2E Testing** | Playwright | 🟡 PLANNED | Cross-browser, reliable |
| **Mocking** | MSW (Mock Service Worker) | 🟡 PLANNED | Mock API requests |

**Agent Rules:**
- ⚠️ ASK BEFORE installing testing libraries (Phase 2 task)
- ❌ DO NOT use Jest (slower than Vitest)
- ❌ DO NOT use Cypress (Playwright is better)
- ✅ When implementing tests:
  - Use Vitest for unit tests
  - Use React Testing Library for component tests
  - Use Playwright for E2E tests

---

## 🚀 DEPLOYMENT & INFRASTRUCTURE

### 19. Hosting & CDN

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Web Hosting** | Netlify | ✅ LOCKED | Edge network, auto HTTPS, generous free tier |
| **Alternative** | Vercel | ⚪ BACKUP | If Netlify issues arise |
| **CDN** | Netlify CDN | ✅ LOCKED | 100+ edge locations |

**Agent Rules:**
- ❌ DO NOT use AWS Amplify, Cloudflare Pages without approval
- ✅ DEPLOY to Netlify via Git push
- ✅ CONFIGURE netlify.toml (already exists)

**Netlify Configuration:**
```toml
# netlify.toml (existing)
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/api/*"
  to = "https://teyloksuvmmhqixjqoch.supabase.co/:splat"
  status = 200
```

---

### 20. CI/CD

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **CI Platform** | GitHub Actions | 🟡 TO CONFIGURE | Free for public repos, integrated |
| **Deployment** | Netlify auto-deploy on push | ✅ LOCKED | Simple, automatic |
| **Lighthouse CI** | @lhci/cli | 🟡 TO CONFIGURE | Automated performance audits |

**Agent Rules:**
- ✅ CREATE `.github/workflows/deploy.yml` for CI/CD
- ✅ RUN on pull requests:
  - TypeScript check
  - ESLint
  - Build test
  - Lighthouse CI
- ✅ AUTO-DEPLOY on merge to main

---

### 21. Environment Variables

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Local Development** | .env.local | ✅ LOCKED | Standard Next.js convention |
| **Production** | Netlify Environment Variables | ✅ LOCKED | Secure, not in code |

**Agent Rules:**
- ❌ DO NOT commit .env files to git
- ✅ USE .env.local for development
- ✅ ADD production vars to Netlify dashboard
- ✅ PREFIX public vars with `NEXT_PUBLIC_`

**Required Environment Variables:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Google Gemini AI
GEMINI_API_KEY=

# Upstash Redis
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Optional (Phase 3)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

---

## 📱 MOBILE APP (PHASE 3 - FUTURE)

### 22. Mobile Framework (When Implemented)

| Category | Technology | Status | Rationale |
|----------|-----------|---------|-----------|
| **Framework** | React Native with Expo | 🔮 PLANNED | Code sharing with web, easier deployment |
| **Build System** | EAS Build | 🔮 PLANNED | Expo's cloud build service |
| **State Management** | Zustand | 🔮 PLANNED | Lighter than Redux, async-friendly |
| **Navigation** | Expo Router | 🔮 PLANNED | File-based routing like Next.js |

**Agent Rules:**
- ⚠️ DO NOT START mobile app development without explicit approval
- ✅ WHEN APPROVED: Use Expo (not bare React Native)
- ✅ REUSE: Business logic, API clients, types from web app
- ✅ SHARE: Supabase client configuration

---

## 📦 PACKAGE INSTALLATION CHECKLIST

### Currently Installed ✅
- [x] next (14.2.14)
- [x] react (18.3.1)
- [x] react-dom (18.3.1)
- [x] @supabase/ssr
- [x] @supabase/supabase-js
- [x] tailwindcss (3.4.15)
- [x] clsx
- [x] tailwind-merge
- [x] lucide-react
- [x] shadcn/ui components (partial)

### To Install 🟡
```bash
# State Management
npm install @tanstack/react-query @tanstack/react-query-devtools

# Form Handling
npm install react-hook-form zod @hookform/resolvers

# AI Integration
npm install @google/generative-ai

# Caching & Rate Limiting
npm install @upstash/redis @upstash/ratelimit

# Image Optimization
npm install browser-image-compression

# PWA Support
npm install next-pwa

# Testing (Phase 2)
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test

# Lighthouse CI
npm install -D @lhci/cli
```

---

## 🚫 EXPLICITLY FORBIDDEN

### DO NOT INSTALL These Libraries:

**State Management:**
- ❌ Redux / Redux Toolkit
- ❌ MobX
- ❌ Recoil
- ❌ Jotai

**Styling:**
- ❌ Styled Components
- ❌ Emotion
- ❌ Material UI
- ❌ Chakra UI
- ❌ Ant Design

**Forms:**
- ❌ Formik

**i18n:**
- ❌ next-intl
- ❌ react-i18next
- ❌ i18next

**Animation:**
- ❌ Framer Motion (unless explicitly requested)

**Backend:**
- ❌ Express.js
- ❌ Fastify
- ❌ Nest.js
- ❌ Python/Django/Flask

**Database:**
- ❌ Prisma
- ❌ Drizzle
- ❌ TypeORM
- ❌ MongoDB
- ❌ Firebase Firestore

**Auth:**
- ❌ NextAuth
- ❌ Auth0
- ❌ Clerk

---

## 🔄 TECHNOLOGY CHANGE PROCESS

If you believe a technology choice should be changed:

1. **STOP** - Do not make the change
2. **DOCUMENT** - Write why the current choice is insufficient
3. **RESEARCH** - Find 2-3 alternatives with pros/cons
4. **ASK USER** - Present options and rationale
5. **WAIT** - Get explicit approval before proceeding

### Example Request Format:

```
🚨 TECHNOLOGY CHANGE REQUEST

Current Technology: [Name]
Proposed Alternative: [Name]

Why Current is Insufficient:
- [Specific problem 1]
- [Specific problem 2]

Proposed Alternatives:
1. [Option A] - Pros: ... / Cons: ...
2. [Option B] - Pros: ... / Cons: ...

Recommendation: [Your recommendation]

Awaiting user approval before proceeding.
```

---

## 📚 REFERENCE LINKS

### Documentation
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Gemini API: https://ai.google.dev/docs

### Project-Specific
- Supabase Dashboard: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch
- GitHub Repo: [Your repo URL]
- Netlify Dashboard: [Your Netlify URL]

---

## 🎯 SUMMARY FOR AI AGENTS

**YOUR JOB:**
1. Read this document FIRST before making any tech decisions
2. Follow locked (✅) choices without deviation
3. Ask before adding new libraries
4. Prefer ecosystem-native solutions (Next.js, Supabase)
5. When in doubt, ASK the user

**KEY PRINCIPLES:**
- **Simplicity:** Use built-in solutions when available
- **Consistency:** Maintain technology stack coherence
- **Performance:** Every KB matters for 3G users
- **Type Safety:** TypeScript everywhere
- **Security:** RLS policies, httpOnly cookies, no client secrets

**WHEN STUCK:**
- Check this document first
- Read official documentation
- Ask user for clarification
- DO NOT guess or assume

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Next Review:** After Phase 1 completion  
**Status:** ✅ ACTIVE - All Agents Must Follow
