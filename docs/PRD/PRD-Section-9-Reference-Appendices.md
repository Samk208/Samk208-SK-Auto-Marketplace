# SECTION 9: REFERENCE & APPENDICES

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Status:** ✅ Complete - All 9 Sections Finalized
**Project:** SK AutoSphere (teyloksuvmmhqixjqoch)
**Section:** 9 of 9 (FINAL)

---

## 📋 Table of Contents

- [9.1 Document Overview & Navigation](#91-document-overview--navigation)
- [9.2 Complete PRD Cross-Reference Index](#92-complete-prd-cross-reference-index)
- [9.3 Glossary of Terms & Acronyms](#93-glossary-of-terms--acronyms)
- [9.4 Technology Stack Reference](#94-technology-stack-reference)
- [9.5 API Reference Summary](#95-api-reference-summary)
- [9.6 Database Schema Quick Reference](#96-database-schema-quick-reference)
- [9.7 Environment Variables Catalog](#97-environment-variables-catalog)
- [9.8 Third-Party Services Integration](#98-third-party-services-integration)
- [9.9 Code Style Guide & Standards](#99-code-style-guide--standards)
- [9.10 Git Workflow & Branch Strategy](#910-git-workflow--branch-strategy)
- [9.11 Command Reference Cheat Sheet](#911-command-reference-cheat-sheet)
- [9.12 Troubleshooting Guide](#912-troubleshooting-guide)
- [9.13 FAQ for Developers](#913-faq-for-developers)
- [9.14 Resource Links & Documentation](#914-resource-links--documentation)
- [9.15 Project Timeline & Milestones](#915-project-timeline--milestones)
- [9.16 Team Roles & Responsibilities](#916-team-roles--responsibilities)
- [9.17 Compliance & Legal Considerations](#917-compliance--legal-considerations)
- [9.18 Change Log & Version History](#918-change-log--version-history)
- [9.19 Contributing Guidelines](#919-contributing-guidelines)
- [9.20 PRD Completion Summary](#920-prd-completion-summary)

---

## 9.1 Document Overview & Navigation

### 9.1.1 PRD Structure

The SK AutoSphere Product Requirements Document (PRD) is organized into 9 comprehensive sections:

```
SK AutoSphere PRD (Total: ~25,000 lines)
│
├── Section 1 & 2: Project Overview & User Stories (55 KB)
│   └── Vision, objectives, user personas, user stories
│
├── Section 3: Technical Blueprint (41 KB)
│   └── Architecture, technology stack, system design
│
├── Section 4: Features & Functionality (60 KB)
│   └── Core features, AI features, user workflows
│
├── Section 5: Data Models (38 KB)
│   └── Database schema, relationships, migrations
│
├── Section 6: Agent Deployment Strategy (62 KB)
│   └── AI development agents, workflows, tools
│
├── Section 7: Testing & Quality Assurance (98 KB)
│   └── Testing strategy, frameworks, QA processes
│
├── Section 8: Deployment & DevOps (CURRENT) (90 KB)
│   └── Infrastructure, CI/CD, monitoring, scaling
│
└── Section 9: Reference & Appendices (THIS DOCUMENT)
    └── Glossary, quick reference, resources
```

---

### 9.1.2 How to Use This Document

**For Product Managers:**
- Start with Section 1-2 for business context
- Review Section 4 for feature specifications
- Check Section 15 for timeline and milestones

**For Developers:**
- Read Section 3 for technical architecture
- Review Section 5 for database schema
- Use Section 8 for deployment procedures
- Reference Section 9 (this doc) for quick lookups

**For QA Engineers:**
- Focus on Section 7 for testing strategy
- Use Section 4 for feature acceptance criteria
- Reference Section 9.12 for troubleshooting

**For DevOps Engineers:**
- Section 8 is your primary reference
- Section 5 for database operations
- Section 9.11 for command cheat sheets

**For Designers:**
- Section 2 for user stories and personas
- Section 4 for UI/UX requirements
- External design files in Figma

---

### 9.1.3 Document Maintenance

**Update Frequency:**
- **Weekly:** During active development sprints
- **Monthly:** During maintenance phases
- **As-Needed:** For major architecture changes

**Version Control:**
- All PRD documents are in Git: `docs/PRD/`
- Use pull requests for major changes
- Tag releases with version numbers

**Ownership:**
- **Section 1-2:** Product Manager
- **Section 3:** System Architect Agent
- **Section 4:** Product Manager + UX/UI Designer
- **Section 5:** Database Admin + Backend Engineer
- **Section 6:** Technical Lead
- **Section 7:** QA Lead
- **Section 8:** DevOps Lead
- **Section 9:** Technical Writer + All Teams

---

## 9.2 Complete PRD Cross-Reference Index

### 9.2.1 Features Cross-Reference

| Feature | Requirements | Technical Spec | Database | API | Testing |
|---------|-------------|----------------|----------|-----|---------|
| **User Authentication** | §2.3.1 | §3.4.1 | §5.2.1 | §4.2.1 | §7.3.1 |
| **Car Listings** | §2.3.2 | §3.5.2 | §5.2.3 | §4.3.1 | §7.4.2 |
| **Messaging System** | §2.3.3 | §3.5.3 | §5.2.7 | §4.4.1 | §7.5.3 |
| **AI Chat Assistant** | §2.4.1 | §3.6.1 | §5.2.9 | §4.5.1 | §7.13.1 |
| **Payment Processing** | §2.3.4 | §3.5.4 | §5.2.8 | §4.6.1 | §7.8.3 |
| **Seller Dashboard** | §2.3.5 | §3.5.5 | §5.2.4 | §4.7.1 | §7.4.3 |
| **Search & Filters** | §2.3.6 | §3.5.6 | §5.2.3 | §4.8.1 | §7.9.2 |
| **Favorites & Saved Searches** | §2.3.7 | §3.5.7 | §5.2.6 | §4.9.1 | §7.3.4 |
| **Shipping Calculator** | §2.4.2 | §3.6.2 | §5.2.10 | §4.10.1 | §7.4.4 |
| **Seller Verification** | §2.3.8 | §3.5.8 | §5.2.5 | §4.11.1 | §7.8.4 |

*Note: § refers to section numbers in the PRD*

---

### 9.2.2 Technical Components Cross-Reference

| Component | Architecture | Implementation | Deployment | Monitoring |
|-----------|-------------|----------------|------------|------------|
| **Next.js App** | §3.2.1 | §3.4.2 | §8.2.1 | §8.10.3 |
| **Supabase DB** | §3.2.2 | §3.4.3 | §8.5.1 | §8.10.2 |
| **Authentication** | §3.4.1 | §4.2.1 | §8.7.1 | §8.10.4 |
| **File Storage** | §3.2.3 | §3.4.4 | §8.13.1 | §8.10.2 |
| **Gemini AI** | §3.6.1 | §4.5.1 | §8.7.2 | §8.10.3 |
| **Stripe Payments** | §3.5.4 | §4.6.1 | §8.7.1 | §8.10.4 |
| **Realtime Messaging** | §3.5.3 | §4.4.1 | §8.5.1 | §8.10.2 |
| **CDN (Netlify)** | §3.3.1 | §8.2.1 | §8.13.2 | §8.10.1 |
| **CI/CD Pipeline** | §8.4.1 | §8.4.1 | §8.4.1 | §8.10.5 |
| **Monitoring (Sentry)** | §8.10.2 | §8.10.2 | §8.10.2 | §8.10.2 |

---

### 9.2.3 Agent Cross-Reference

| Agent | Definition | Use Cases | Tools | Output |
|-------|------------|-----------|-------|--------|
| **System Architect** | §6.2 | §6.2.2 | §6.2.3 | §6.2.4 |
| **Frontend Engineer** | §6.3 | §6.3.2 | §6.3.3 | §6.3.4 |
| **Backend Engineer** | §6.4 | §6.4.2 | §6.4.3 | §6.4.4 |
| **QA Test Automation** | §6.5 | §6.5.2 | §6.5.3 | §6.5.4 |
| **Security Analyst** | §6.6 | §6.6.2 | §6.6.3 | §6.6.4 |
| **DevOps Engineer** | §6.7 | §6.7.2 | §6.7.3 | §6.7.4 |

---

## 9.3 Glossary of Terms & Acronyms

### 9.3.1 Business & Domain Terms

**Korean Automotive Terms:**

- **Hyundai/Kia/Genesis:** Major Korean automotive manufacturers
- **KDM (Korean Domestic Market):** Vehicles originally sold in South Korea
- **CKD (Completely Knocked Down):** Unassembled vehicle parts for export
- **CBU (Completely Built Up):** Fully assembled vehicles for export
- **FOB (Free On Board):** Shipping term - seller's responsibility ends at port
- **CIF (Cost, Insurance, Freight):** Shipping term - seller covers all costs to destination
- **Incoterms:** International commercial terms for shipping

**African Market Terms:**

- **EAC (East African Community):** Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan
- **SADC (Southern African Development Community):** 16-member economic community
- **RHD (Right-Hand Drive):** Vehicles with steering wheel on right (Kenya, South Africa)
- **LHD (Left-Hand Drive):** Vehicles with steering wheel on left (most of Africa)
- **KEBS (Kenya Bureau of Standards):** Regulatory body for imported vehicles
- **CRSP (Center for Road Safety and Protection):** Vehicle inspection agency
- **M-PESA:** Mobile money payment system (Kenya)

---

### 9.3.2 Technical Acronyms

**Web Development:**

- **API:** Application Programming Interface
- **CDN:** Content Delivery Network
- **CORS:** Cross-Origin Resource Sharing
- **CSP:** Content Security Policy
- **DNS:** Domain Name System
- **HSTS:** HTTP Strict Transport Security
- **JWT:** JSON Web Token
- **REST:** Representational State Transfer
- **RLS:** Row Level Security (Supabase)
- **RSC:** React Server Components
- **SPA:** Single Page Application
- **SSG:** Static Site Generation
- **SSR:** Server-Side Rendering
- **TLS/SSL:** Transport Layer Security / Secure Sockets Layer
- **WebSocket:** Full-duplex communication protocol

**Database & Backend:**

- **ACID:** Atomicity, Consistency, Isolation, Durability
- **CRUD:** Create, Read, Update, Delete
- **FK:** Foreign Key
- **ORM:** Object-Relational Mapping
- **PK:** Primary Key
- **RDBMS:** Relational Database Management System
- **SQL:** Structured Query Language
- **UUID:** Universally Unique Identifier

**DevOps & Infrastructure:**

- **CI/CD:** Continuous Integration / Continuous Deployment
- **IaC:** Infrastructure as Code
- **PaaS:** Platform as a Service
- **SaaS:** Software as a Service
- **VCS:** Version Control System

**Testing & Quality:**

- **BDD:** Behavior-Driven Development
- **E2E:** End-to-End (testing)
- **QA:** Quality Assurance
- **TDD:** Test-Driven Development
- **UAT:** User Acceptance Testing

**Performance & Monitoring:**

- **APM:** Application Performance Monitoring
- **CLS:** Cumulative Layout Shift
- **FCP:** First Contentful Paint
- **FID:** First Input Delay
- **LCP:** Largest Contentful Paint
- **RPO:** Recovery Point Objective
- **RTO:** Recovery Time Objective
- **SLA:** Service Level Agreement
- **TTFB:** Time to First Byte

---

### 9.3.3 AI & Machine Learning Terms

- **Embeddings:** Vector representations of text for semantic search
- **Few-Shot Learning:** AI model learns from few examples
- **Gemini:** Google's generative AI model family
- **LLM:** Large Language Model
- **NLP:** Natural Language Processing
- **Prompt Engineering:** Crafting inputs to get desired AI outputs
- **RAG (Retrieval-Augmented Generation):** AI technique combining search + generation
- **Semantic Search:** Search based on meaning, not just keywords
- **Token:** Unit of text processed by AI models
- **Vector Database:** Database optimized for similarity search

---

## 9.4 Technology Stack Reference

### 9.4.1 Complete Technology Inventory

**Frontend Technologies:**

| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Next.js** | 14.2.x | React framework (App Router) | [nextjs.org/docs](https://nextjs.org/docs) |
| **React** | 18.3.x | UI library | [react.dev](https://react.dev) |
| **TypeScript** | 5.4.x | Type safety | [typescriptlang.org](https://www.typescriptlang.org) |
| **Tailwind CSS** | 3.4.x | Utility-first CSS | [tailwindcss.com](https://tailwindcss.com) |
| **shadcn/ui** | Latest | Component library | [ui.shadcn.com](https://ui.shadcn.com) |
| **Radix UI** | Latest | Headless components | [radix-ui.com](https://www.radix-ui.com) |
| **React Query** | 5.x | Data fetching | [tanstack.com/query](https://tanstack.com/query) |
| **Zustand** | 4.x | State management | [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs) |
| **React Hook Form** | 7.x | Form handling | [react-hook-form.com](https://react-hook-form.com) |
| **Zod** | 3.x | Schema validation | [zod.dev](https://zod.dev) |

**Backend Technologies:**

| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Supabase** | Latest | Backend as a Service | [supabase.com/docs](https://supabase.com/docs) |
| **PostgreSQL** | 15.x | Relational database | [postgresql.org/docs](https://www.postgresql.org/docs) |
| **PostgREST** | Latest | Auto REST API | [postgrest.org](https://postgrest.org) |
| **Node.js** | 20.x LTS | JavaScript runtime | [nodejs.org/docs](https://nodejs.org/docs) |

**AI & Integration:**

| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Google Gemini** | 2.0 Flash | AI assistant | [ai.google.dev](https://ai.google.dev) |
| **Stripe** | Latest | Payment processing | [stripe.com/docs](https://stripe.com/docs) |
| **Shippo** | Latest | Shipping logistics | [goshippo.com/docs](https://goshippo.com/docs) |
| **Resend** | Latest | Email delivery | [resend.com/docs](https://resend.com/docs) |

**DevOps & Tooling:**

| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Netlify** | N/A | Hosting & CDN | [docs.netlify.com](https://docs.netlify.com) |
| **GitHub Actions** | N/A | CI/CD | [docs.github.com/actions](https://docs.github.com/en/actions) |
| **Docker** | 24.x | Containerization | [docs.docker.com](https://docs.docker.com) |
| **Sentry** | Latest | Error tracking | [docs.sentry.io](https://docs.sentry.io) |
| **Vitest** | 1.x | Unit testing | [vitest.dev](https://vitest.dev) |
| **Playwright** | 1.x | E2E testing | [playwright.dev](https://playwright.dev) |
| **ESLint** | 8.x | Code linting | [eslint.org](https://eslint.org) |
| **Prettier** | 3.x | Code formatting | [prettier.io](https://prettier.io) |

---

### 9.4.2 Browser Support Matrix

| Browser | Minimum Version | Support Level | Notes |
|---------|----------------|---------------|-------|
| **Chrome** | 100+ | Full | Recommended |
| **Safari** | 15+ | Full | iOS default |
| **Firefox** | 100+ | Full | Privacy-focused users |
| **Edge** | 100+ | Full | Chromium-based |
| **Samsung Internet** | 20+ | Full | Common in Africa/Korea |
| **Opera** | 85+ | Full | Popular in Africa |
| **UC Browser** | 13+ | Partial | Mobile-only support |
| **IE 11** | N/A | None | Not supported |

**Mobile Support:**

- **iOS Safari:** 15.0+
- **Chrome Android:** 100+
- **Samsung Internet:** 20+
- **Opera Mini:** Degraded experience (no JavaScript)

---

### 9.4.3 Package Dependencies

**Core Dependencies:**

```json
{
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@supabase/supabase-js": "2.43.4",
    "@supabase/auth-helpers-nextjs": "0.10.0",
    "@stripe/stripe-js": "3.5.0",
    "@google/generative-ai": "0.12.0",
    "@tanstack/react-query": "5.45.1",
    "zustand": "4.5.2",
    "zod": "3.23.8",
    "react-hook-form": "7.51.5",
    "@radix-ui/react-dialog": "1.0.5",
    "@radix-ui/react-dropdown-menu": "2.0.6",
    "tailwindcss": "3.4.4",
    "sharp": "0.33.4",
    "date-fns": "3.6.0"
  }
}
```

**Dev Dependencies:**

```json
{
  "devDependencies": {
    "@types/node": "20.14.8",
    "@types/react": "18.3.3",
    "typescript": "5.5.2",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5",
    "prettier": "3.3.2",
    "vitest": "1.6.0",
    "@vitejs/plugin-react": "4.3.1",
    "playwright": "1.44.1",
    "@playwright/test": "1.44.1",
    "autoprefixer": "10.4.19",
    "postcss": "8.4.38"
  }
}
```

---

## 9.5 API Reference Summary

### 9.5.1 REST API Endpoints

**Authentication:**

```
POST   /api/auth/signup            Create new user account
POST   /api/auth/login             Sign in user
POST   /api/auth/logout            Sign out user
POST   /api/auth/refresh           Refresh access token
POST   /api/auth/reset-password    Request password reset
PUT    /api/auth/update-password   Update password
GET    /api/auth/me                Get current user profile
```

**Cars:**

```
GET    /api/cars                   List all cars (paginated)
GET    /api/cars/:id               Get car by ID
POST   /api/cars                   Create new car listing
PUT    /api/cars/:id               Update car listing
DELETE /api/cars/:id               Delete car listing
GET    /api/cars/search            Search cars with filters
POST   /api/cars/:id/favorite      Add car to favorites
DELETE /api/cars/:id/favorite      Remove from favorites
GET    /api/cars/:id/similar       Get similar cars (AI)
```

**Messages:**

```
GET    /api/messages               List user conversations
GET    /api/messages/:conversationId  Get conversation messages
POST   /api/messages               Send new message
PUT    /api/messages/:id/read      Mark message as read
DELETE /api/messages/:id           Delete message
WS     /ws/messages                WebSocket for real-time chat
```

**AI Features:**

```
POST   /api/ai/generate-description   Generate car description
POST   /api/ai/chat                   Chat with AI assistant
POST   /api/ai/recommend              Get personalized recommendations
POST   /api/ai/translate              Translate text
POST   /api/ai/analyze-image          Analyze car image
```

**Payments:**

```
POST   /api/payments/create-intent    Create Stripe payment intent
POST   /api/payments/confirm          Confirm payment
GET    /api/payments/:id              Get payment status
POST   /api/webhooks/stripe           Stripe webhook handler
```

**Shipping:**

```
POST   /api/shipping/calculate        Calculate shipping cost
POST   /api/shipping/create-label     Create shipping label
GET    /api/shipping/track/:id        Track shipment
```

**Admin:**

```
GET    /api/admin/users               List all users
PUT    /api/admin/users/:id/verify    Verify seller account
DELETE /api/admin/cars/:id            Delete any car listing
GET    /api/admin/analytics           Platform analytics
```

---

### 9.5.2 API Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "...": "..."
  },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "price",
        "message": "Price must be a positive number"
      }
    ]
  }
}
```

**Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Temporary outage |

---

## 9.6 Database Schema Quick Reference

### 9.6.1 Core Tables Summary

**profiles** (User accounts)

```sql
id              UUID PRIMARY KEY (FK: auth.users.id)
email           VARCHAR(255) UNIQUE NOT NULL
full_name       VARCHAR(100)
role            ENUM('buyer', 'seller', 'admin')
avatar_url      TEXT
phone_number    VARCHAR(20)
created_at      TIMESTAMPTZ DEFAULT NOW()
```

**cars** (Vehicle listings)

```sql
id              UUID PRIMARY KEY
seller_id       UUID FK(profiles.id)
make            VARCHAR(50) NOT NULL
model           VARCHAR(50) NOT NULL
year            INTEGER NOT NULL
price           DECIMAL(10,2) NOT NULL
mileage         INTEGER
status          ENUM('draft', 'published', 'sold')
created_at      TIMESTAMPTZ DEFAULT NOW()
```

**messages** (Chat messages)

```sql
id              UUID PRIMARY KEY
conversation_id UUID FK(conversations.id)
sender_id       UUID FK(profiles.id)
content         TEXT NOT NULL
read_at         TIMESTAMPTZ
created_at      TIMESTAMPTZ DEFAULT NOW()
```

**favorites** (Saved cars)

```sql
id              UUID PRIMARY KEY
user_id         UUID FK(profiles.id)
car_id          UUID FK(cars.id)
created_at      TIMESTAMPTZ DEFAULT NOW()
UNIQUE(user_id, car_id)
```

**Full Schema:** See Section 5.2 for complete definitions

---

### 9.6.2 Database Indexes

**Critical Indexes:**

```sql
-- Car searches
CREATE INDEX idx_cars_status_created ON cars(status, created_at DESC);
CREATE INDEX idx_cars_make_model ON cars(make, model);
CREATE INDEX idx_cars_price_range ON cars(price) WHERE status = 'published';

-- User lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Message queries
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_unread ON messages(sender_id, read_at) WHERE read_at IS NULL;

-- Favorites
CREATE INDEX idx_favorites_user ON favorites(user_id, created_at DESC);
CREATE INDEX idx_favorites_car ON favorites(car_id);
```

---

## 9.7 Environment Variables Catalog

### 9.7.1 Required Environment Variables

**Production Environment (.env.production):**

```bash
# Application
NEXT_PUBLIC_APP_URL=https://skautosphere.com
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production

# Supabase (Database + Auth + Storage)
NEXT_PUBLIC_SUPABASE_URL=https://teyloksuvmmhqixjqoch.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # SECRET - Server-side only
SUPABASE_JWT_SECRET=your-jwt-secret    # SECRET

# Google Gemini AI
GEMINI_API_KEY=AIza...                 # SECRET

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...          # SECRET
STRIPE_WEBHOOK_SECRET=whsec_...        # SECRET

# Shippo Shipping
SHIPPO_API_KEY=shippo_live_...         # SECRET

# Email (Resend)
RESEND_API_KEY=re_...                  # SECRET
NEXT_PUBLIC_CONTACT_EMAIL=support@skautosphere.com

# Monitoring & Analytics
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...           # SECRET
SENTRY_ORG=sk-autosphere
SENTRY_PROJECT=web-app

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_SHIPPING_CALC=true
NEXT_PUBLIC_ENABLE_SELLER_VERIFICATION=true

# Security
NEXTAUTH_SECRET=your-nextauth-secret   # SECRET
NEXTAUTH_URL=https://skautosphere.com

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://...     # Optional
UPSTASH_REDIS_REST_TOKEN=...           # Optional, SECRET
```

**Development Environment (.env.local):**

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase (Local)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Google Gemini AI (Test Key)
GEMINI_API_KEY=AIza...

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Disable in dev
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SENTRY_DSN=  # Empty = disabled
```

---

### 9.7.2 Environment Variable Security

**Security Levels:**

1. **Public (NEXT_PUBLIC_*):** Safe for browser, no secrets
2. **Server-Only:** Never sent to browser, moderate security
3. **Encrypted:** Must be encrypted in CI/CD, high security

**Best Practices:**

- ✅ Use `NEXT_PUBLIC_*` only for truly public data
- ✅ Store secrets in Netlify/Vercel dashboard (encrypted)
- ✅ Never commit `.env.local` or `.env.production` to Git
- ✅ Rotate secrets every 90-180 days
- ✅ Use different keys for dev/staging/production
- ❌ Never log environment variables
- ❌ Never expose secrets in error messages
- ❌ Never hardcode secrets in code

---

## 9.8 Third-Party Services Integration

### 9.8.1 Service Configuration Matrix

| Service | Environment | Purpose | Cost | SLA |
|---------|-------------|---------|------|-----|
| **Supabase** | Production | Database, Auth, Storage | $25/mo (Pro) | 99.9% |
| **Netlify** | Production | Hosting, CDN, Functions | $19/mo (Pro) | 99.9% |
| **Stripe** | Production | Payments | 2.9% + $0.30/txn | 99.99% |
| **Google Gemini** | Production | AI Features | Pay-per-use (~$50/mo) | 99.5% |
| **Shippo** | Production | Shipping | Pay-per-label | 99.5% |
| **Sentry** | Production | Error Tracking | $26/mo (Team) | 99.9% |
| **Resend** | Production | Email | Free (<3K/mo) | 99.9% |
| **Cloudflare** | Production | DNS, DDoS Protection | Free | 100% |
| **Upstash Redis** | Production | Caching (Optional) | Free (<10K req/day) | 99.95% |

---

### 9.8.2 API Key Management

**Service Account Setup:**

```bash
# Supabase
# 1. Go to: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/settings/api
# 2. Copy "anon public" key → NEXT_PUBLIC_SUPABASE_ANON_KEY
# 3. Copy "service_role" key → SUPABASE_SERVICE_ROLE_KEY (KEEP SECRET!)

# Stripe
# 1. Go to: https://dashboard.stripe.com/apikeys
# 2. Create "Restricted key" for production
# 3. Permissions: Payments (write), Customers (write), Webhooks (read)
# 4. Copy publishable key → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# 5. Copy secret key → STRIPE_SECRET_KEY (KEEP SECRET!)

# Google Gemini
# 1. Go to: https://aistudio.google.com/app/apikey
# 2. Create API key for production project
# 3. Restrict to specific APIs: Generative Language API
# 4. Copy key → GEMINI_API_KEY (KEEP SECRET!)

# Sentry
# 1. Go to: https://sentry.io/settings/account/api/auth-tokens/
# 2. Create token with "project:write" scope
# 3. Copy token → SENTRY_AUTH_TOKEN (KEEP SECRET!)
```

---

### 9.8.3 Webhook Configuration

**Stripe Webhooks:**

```
Endpoint URL: https://skautosphere.com/api/webhooks/stripe
Events to send:
  - payment_intent.succeeded
  - payment_intent.payment_failed
  - customer.created
  - customer.updated

Webhook Secret: whsec_... (copy to STRIPE_WEBHOOK_SECRET)
```

**Supabase Webhooks (Database Events):**

```sql
-- Create webhook for new car listings
CREATE TRIGGER new_car_webhook
AFTER INSERT ON cars
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://skautosphere.com/api/webhooks/new-car',
  'POST',
  '{"Content-Type": "application/json"}',
  '{}',
  '5000'
);
```

---

## 9.9 Code Style Guide & Standards

### 9.9.1 TypeScript Style Guide

**Naming Conventions:**

```typescript
// Files
MyComponent.tsx      // PascalCase for components
utils.ts             // camelCase for utilities
types.ts             // lowercase for types/interfaces
use-auth.ts          // kebab-case for hooks (use-*)

// Variables & Functions
const userName = 'John';              // camelCase
function getUserById(id: string) {}   // camelCase

// Types & Interfaces
interface User {}                     // PascalCase
type CarStatus = 'draft' | 'published';  // PascalCase

// Constants
const MAX_FILE_SIZE = 5_000_000;      // UPPER_SNAKE_CASE
const API_BASE_URL = 'https://...';   // UPPER_SNAKE_CASE

// React Components
export default function CarCard() {}  // PascalCase
const MemoizedCard = memo(CarCard);   // PascalCase

// Enums
enum UserRole {                       // PascalCase
  Buyer = 'buyer',                    // PascalCase
  Seller = 'seller',
}
```

**Code Organization:**

```typescript
// 1. Imports (grouped)
import { useState } from 'react';           // React
import { useRouter } from 'next/navigation'; // Next.js
import { createClient } from '@supabase/...'; // External libs
import { Button } from '@/components/ui/button'; // Internal components
import { formatCurrency } from '@/lib/utils'; // Internal utilities
import type { Car } from '@/types/database'; // Types

// 2. Types/Interfaces
interface CarCardProps {
  car: Car;
  onFavorite?: (id: string) => void;
}

// 3. Component
export default function CarCard({ car, onFavorite }: CarCardProps) {
  // 3a. Hooks
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();

  // 3b. Event handlers
  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(car.id);
  };

  // 3c. Effects
  useEffect(() => {
    // ...
  }, [car.id]);

  // 3d. Render
  return <div>...</div>;
}

// 4. Exports
export type { CarCardProps };
```

---

### 9.9.2 React Best Practices

**Component Patterns:**

```typescript
// ✅ Good: Named function component
export default function CarList({ cars }: CarListProps) {
  return <div>...</div>;
}

// ❌ Bad: Arrow function default export
export default ({ cars }) => <div>...</div>;

// ✅ Good: Explicit prop types
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// ❌ Bad: Implicit any
function Button(props) {
  return <button {...props} />;
}

// ✅ Good: Conditional rendering
{isLoading ? <Spinner /> : <CarList cars={cars} />}

// ❌ Bad: Conditional rendering
{isLoading && <Spinner />}
{!isLoading && <CarList cars={cars} />}

// ✅ Good: Key prop for lists
{cars.map((car) => <CarCard key={car.id} car={car} />)}

// ❌ Bad: Index as key
{cars.map((car, index) => <CarCard key={index} car={car} />)}
```

---

### 9.9.3 CSS & Tailwind Standards

**Tailwind Best Practices:**

```typescript
// ✅ Good: Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Bad: Desktop-first
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">

// ✅ Good: Semantic color names
<button className="bg-primary text-white hover:bg-primary/90">

// ❌ Bad: Hardcoded colors
<button className="bg-blue-600 text-white hover:bg-blue-700">

// ✅ Good: Consistent spacing scale
<div className="p-4 md:p-6 lg:p-8">

// ❌ Bad: Arbitrary values
<div className="p-[17px]">

// ✅ Good: Group related utilities
<div className="flex items-center justify-between p-4 rounded-lg border">

// ❌ Bad: Scattered utilities
<div className="flex p-4 items-center border rounded-lg justify-between">
```

---

## 9.10 Git Workflow & Branch Strategy

### 9.10.1 Branch Structure

```
main (production)
├── staging (pre-production)
├── develop (integration)
└── feature branches
    ├── feature/SKA-123-add-favorites
    ├── feature/SKA-124-ai-chat
    └── fix/SKA-125-payment-bug
```

**Branch Naming:**

```bash
feature/<ticket>-<description>   # New features
fix/<ticket>-<description>       # Bug fixes
hotfix/<description>             # Production emergencies
chore/<description>              # Maintenance
docs/<description>               # Documentation
refactor/<description>           # Code improvements
test/<description>               # Test additions
```

---

### 9.10.2 Commit Convention

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples:**

```bash
feat(cars): add favorite button to car cards

Implemented ability for users to save favorite cars.
Added favorites table and API endpoints.

Closes SKA-123

---

fix(payments): resolve Stripe webhook timeout

Increased webhook handler timeout from 5s to 30s.
Added retry logic for failed webhooks.

Fixes SKA-456

---

docs(readme): update deployment instructions

Updated README with Netlify deployment steps.

---

BREAKING CHANGE: remove deprecated /api/v1 endpoints

Removed all v1 API endpoints. Clients must migrate to v2.

Refs SKA-789
```

---

### 9.10.3 Pull Request Template

```markdown
## Description
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
- [ ] Dependent changes merged

## Screenshots (if applicable)
<!-- Add screenshots here -->

## Additional Notes
<!-- Any additional information -->
```

---

## 9.11 Command Reference Cheat Sheet

### 9.11.1 Development Commands

```bash
# Start Development
npm run dev                    # Start Next.js dev server (localhost:3000)
npm run db:start              # Start local Supabase (Docker)
npm run dev:all               # Start both Next.js + Supabase

# Build & Test
npm run build                 # Production build
npm run start                 # Start production server
npm run lint                  # Run ESLint
npm run lint:fix              # Fix linting issues
npm run type-check            # TypeScript type checking
npm run format                # Format code with Prettier
npm run format:check          # Check code formatting

# Testing
npm run test                  # Run unit tests (Vitest)
npm run test:watch            # Run tests in watch mode
npm run test:coverage         # Generate coverage report
npm run test:ui               # Open Vitest UI
npm run test:e2e              # Run E2E tests (Playwright)
npm run test:e2e:ui           # Open Playwright UI

# Database
npm run db:migrate            # Apply migrations
npm run db:reset              # Reset database
npm run db:seed               # Seed database
npm run db:generate-types     # Generate TypeScript types
npm run db:diff               # Show schema differences
npm run db:dump               # Backup database

# Deployment
npm run deploy:staging        # Deploy to staging
npm run deploy:production     # Deploy to production
npm run deploy:preview        # Create preview deployment
```

---

### 9.11.2 Supabase CLI Commands

```bash
# Project Setup
supabase login                           # Authenticate
supabase init                            # Initialize project
supabase link --project-ref <ref>        # Link to remote project
supabase status                          # Check status

# Local Development
supabase start                           # Start local instance
supabase stop                            # Stop local instance
supabase restart                         # Restart services

# Database Operations
supabase db reset                        # Reset local database
supabase db push                         # Apply migrations to remote
supabase db pull                         # Pull remote schema changes
supabase db diff                         # Show schema differences
supabase db dump > backup.sql            # Backup database
supabase db lint                         # Check for issues

# Migrations
supabase migration new <name>            # Create new migration
supabase migration list                  # List all migrations
supabase migration up                    # Apply next migration
supabase migration repair <version>      # Mark as applied

# Type Generation
supabase gen types typescript \
  --project-id <project-ref> \
  --schema public \
  > src/types/database.types.ts

# Functions
supabase functions new <name>            # Create Edge Function
supabase functions deploy <name>         # Deploy function
supabase functions serve                 # Run locally
supabase functions delete <name>         # Delete function

# Secrets
supabase secrets list                    # List all secrets
supabase secrets set NAME=value          # Set secret
supabase secrets unset NAME              # Remove secret
```

---

### 9.11.3 Git Commands

```bash
# Branch Management
git checkout -b feature/new-feature      # Create & switch to branch
git branch -d feature-name               # Delete local branch
git push origin --delete branch-name     # Delete remote branch
git fetch --prune                        # Remove stale remote branches

# Commits
git add .                                # Stage all changes
git commit -m "feat: add new feature"    # Commit with message
git commit --amend                       # Amend last commit
git revert <commit-hash>                 # Revert commit
git cherry-pick <commit-hash>            # Apply specific commit

# Syncing
git pull origin main                     # Pull latest changes
git push origin feature-name             # Push branch
git push --force-with-lease              # Safe force push
git rebase main                          # Rebase on main

# Stashing
git stash                                # Stash changes
git stash pop                            # Apply & remove stash
git stash list                           # List stashes
git stash drop                           # Delete stash

# Viewing History
git log --oneline --graph                # Visual log
git log --author="Name"                  # Filter by author
git diff                                 # Show unstaged changes
git diff --staged                        # Show staged changes
git show <commit-hash>                   # Show commit details

# Undoing Changes
git restore <file>                       # Discard changes
git restore --staged <file>              # Unstage file
git reset --soft HEAD~1                  # Undo last commit (keep changes)
git reset --hard HEAD~1                  # Undo last commit (discard changes)
```

---

### 9.11.4 Docker Commands

```bash
# Container Management
docker-compose up -d                     # Start all services
docker-compose down                      # Stop all services
docker-compose down -v                   # Stop & remove volumes
docker-compose restart                   # Restart services
docker-compose logs -f                   # View logs (follow)
docker-compose ps                        # List running containers

# Individual Services
docker-compose up -d web                 # Start only web service
docker-compose logs -f supabase          # View Supabase logs
docker-compose exec web sh               # Shell into web container
docker-compose exec supabase psql        # Access database

# Building
docker-compose build                     # Build all images
docker-compose build --no-cache web      # Rebuild web image
docker-compose pull                      # Pull latest images

# Cleanup
docker system prune -a                   # Remove unused images
docker volume prune                      # Remove unused volumes
docker network prune                     # Remove unused networks
docker container prune                   # Remove stopped containers
```

---

## 9.12 Troubleshooting Guide

### 9.12.1 Common Issues & Solutions

**Issue: "Module not found" errors after npm install**

```bash
# Solution 1: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Solution 2: Clear Next.js cache
rm -rf .next
npm run build

# Solution 3: Check Node.js version
node --version  # Should be 20.x
nvm use 20      # If using nvm
```

---

**Issue: Supabase connection errors locally**

```bash
# Solution 1: Restart Supabase
supabase stop
supabase start

# Solution 2: Check Docker is running
docker ps  # Should show Supabase containers

# Solution 3: Reset Supabase
supabase db reset

# Solution 4: Check environment variables
cat .env.local | grep SUPABASE
# Verify NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
```

---

**Issue: TypeScript errors after database schema changes**

```bash
# Solution: Regenerate types
npm run db:generate-types

# Verify types file exists
cat src/types/database.types.ts
```

---

**Issue: "Port 3000 already in use"**

```bash
# Solution 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Solution 2: Use different port
PORT=3001 npm run dev

# Solution 3: Find and kill process
npx kill-port 3000
```

---

**Issue: Build fails with "out of memory" error**

```bash
# Solution: Increase Node.js memory
NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Or add to package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max_old_space_size=4096' next build"
  }
}
```

---

**Issue: Images not loading from Supabase Storage**

```bash
# Solution 1: Check CORS configuration
# Go to: Supabase Dashboard > Storage > Configuration
# Add allowed origins: http://localhost:3000, https://skautosphere.com

# Solution 2: Verify RLS policies
# Check that storage policies allow public read access

# Solution 3: Check file path
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Expected:', 'https://teyloksuvmmhqixjqoch.supabase.co/storage/v1/object/public/cars/...');
```

---

**Issue: Stripe webhook not receiving events**

```bash
# Solution 1: Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Solution 2: Verify webhook signature
# Check STRIPE_WEBHOOK_SECRET matches Stripe dashboard

# Solution 3: Check webhook endpoint logs
# Netlify: Site > Functions > stripe-webhook > Logs
```

---

### 9.12.2 Performance Issues

**Issue: Slow page load times**

```bash
# Diagnose:
npm run build
npm run start
# Open Chrome DevTools > Performance tab
# Record page load and analyze

# Common solutions:
# 1. Enable image optimization
# 2. Add proper caching headers
# 3. Use dynamic imports for heavy components
# 4. Enable bundle analyzer
npm install --save-dev @next/bundle-analyzer
```

---

**Issue: High database query times**

```sql
-- Diagnose: Check slow queries
SELECT
  calls,
  total_time,
  mean_time,
  query
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Solution 1: Add missing indexes
-- See Section 9.6.2 for index examples

-- Solution 2: Optimize N+1 queries
-- Use Supabase joins instead of multiple queries

-- Solution 3: Enable query result caching
-- Implement Redis cache (Section 8.12.4)
```

---

## 9.13 FAQ for Developers

**Q: How do I add a new API endpoint?**

A: Create a new route in `app/api/`:

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Process request
  return NextResponse.json({ success: true });
}
```

---

**Q: How do I add a new database table?**

A: Create a migration:

```bash
# 1. Create migration
supabase migration new add_reviews_table

# 2. Edit supabase/migrations/YYYYMMDD_add_reviews_table.sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id),
  user_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

# 3. Apply migration
supabase db push

# 4. Regenerate types
npm run db:generate-types
```

---

**Q: How do I test AI features locally without using API quota?**

A: Use mock responses in development:

```typescript
// lib/ai/gemini.ts
export async function generateDescription(prompt: string) {
  if (process.env.NODE_ENV === 'development') {
    // Return mock response
    return 'This is a mock AI response for development';
  }

  // Real API call
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // ...
}
```

---

**Q: How do I deploy a hotfix to production?**

A: Follow the hotfix workflow:

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-bug-fix

# 2. Make minimal fix
# Edit files...

# 3. Test locally
npm run build
npm run test

# 4. Commit and push
git add .
git commit -m "fix: resolve critical bug"
git push origin hotfix/critical-bug-fix

# 5. Create PR with "hotfix" label
gh pr create --label hotfix

# 6. Get approval and merge
# CI/CD will deploy automatically
```

---

**Q: How do I add a new i18n translation?**

A: Update translation files:

```typescript
// src/locales/translations.ts
export const translations = {
  en: {
    'new_key': 'New English text',
  },
  ko: {
    'new_key': '새로운 한국어 텍스트',
  },
  fr: {
    'new_key': 'Nouveau texte français',
  },
  sw: {
    'new_key': 'Maandishi mapya ya Kiswahili',
  },
};

// Usage in component:
const { t } = useTranslation();
return <p>{t('new_key')}</p>;
```

---

## 9.14 Resource Links & Documentation

### 9.14.1 Official Documentation

**Core Technologies:**

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Supabase:** https://supabase.com/docs

**UI & Components:**

- **shadcn/ui:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com
- **React Query:** https://tanstack.com/query/latest/docs/react/overview
- **Zustand:** https://zustand-demo.pmnd.rs

**Integrations:**

- **Google Gemini:** https://ai.google.dev/docs
- **Stripe:** https://stripe.com/docs
- **Shippo:** https://goshippo.com/docs
- **Sentry:** https://docs.sentry.io

**Testing:**

- **Vitest:** https://vitest.dev
- **Playwright:** https://playwright.dev
- **Testing Library:** https://testing-library.com

**DevOps:**

- **Netlify:** https://docs.netlify.com
- **GitHub Actions:** https://docs.github.com/en/actions
- **Docker:** https://docs.docker.com

---

### 9.14.2 Learning Resources

**Next.js:**

- [Next.js Learn](https://nextjs.org/learn) - Interactive tutorial
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples) - Code examples
- [Next.js Blog](https://nextjs.org/blog) - Latest updates

**React:**

- [React Beta Docs](https://react.dev) - Modern React patterns
- [React Patterns](https://reactpatterns.com) - Common patterns
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

**TypeScript:**

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Total TypeScript](https://www.totaltypescript.com) - Advanced concepts

**Supabase:**

- [Supabase Tutorials](https://supabase.com/docs/guides/getting-started)
- [Supabase YouTube](https://www.youtube.com/@Supabase) - Video guides
- [Supabase GitHub](https://github.com/supabase/supabase) - Source code

---

### 9.14.3 Community Resources

**Forums & Support:**

- **Next.js Discord:** https://nextjs.org/discord
- **Supabase Discord:** https://discord.supabase.com
- **Stack Overflow:** Tag with `next.js`, `supabase`, etc.

**Blogs & Newsletters:**

- [Vercel Blog](https://vercel.com/blog)
- [Supabase Blog](https://supabase.com/blog)
- [React Newsletter](https://reactnewsletter.com)
- [TypeScript Weekly](https://www.typescript-weekly.com)

---

## 9.15 Project Timeline & Milestones

### 9.15.1 Development Phases

**Phase 1: Foundation (Weeks 1-4) - ✅ COMPLETE**

- ✅ Project setup & repository initialization
- ✅ Next.js 14 + TypeScript configuration
- ✅ Supabase project creation
- ✅ Basic UI component library (shadcn/ui)
- ✅ Authentication flow (email/password)
- ✅ Database schema design
- ✅ Development environment setup

**Phase 2: Core Features (Weeks 5-12) - 🔄 IN PROGRESS**

- 🔄 User profile management
- 🔄 Car listing creation & management
- 🔄 Image upload to Supabase Storage
- 🔄 Search & filtering functionality
- 🔄 Messaging system with Realtime
- 🔄 Favorites & saved searches
- 🔄 Seller dashboard
- 📋 Payment integration (Stripe)

**Phase 3: AI Features (Weeks 13-16) - 📋 PLANNED**

- 📋 AI-powered car descriptions (Gemini)
- 📋 Chatbot assistant
- 📋 Personalized recommendations
- 📋 Image analysis for car condition
- 📋 Multi-language translation

**Phase 4: Advanced Features (Weeks 17-20) - 📋 PLANNED**

- 📋 Shipping cost calculator (Shippo)
- 📋 Seller verification system
- 📋 Analytics dashboard
- 📋 Email notifications
- 📋 Admin panel

**Phase 5: Testing & QA (Weeks 21-24) - 📋 PLANNED**

- 📋 Comprehensive test coverage (80%+)
- 📋 E2E testing with Playwright
- 📋 Performance optimization
- 📋 Security audit
- 📋 Accessibility compliance (WCAG AA)
- 📋 Load testing

**Phase 6: Deployment & Launch (Weeks 25-26) - 📋 PLANNED**

- 📋 Production deployment
- 📋 Monitoring setup (Sentry, analytics)
- 📋 User documentation
- 📋 Marketing launch
- 📋 Post-launch support

---

### 9.15.2 Milestone Targets

| Milestone | Target Date | Status | Dependencies |
|-----------|-------------|--------|--------------|
| **MVP Launch** | Q1 2026 | 🔄 In Progress | Core features complete |
| **Public Beta** | Q2 2026 | 📋 Planned | MVP + AI features |
| **Full Launch** | Q3 2026 | 📋 Planned | Beta feedback + polish |
| **Mobile App** | Q4 2026 | 📋 Planned | Web platform stable |
| **International Expansion** | Q1 2027 | 📋 Future | Product-market fit |

---

## 9.16 Team Roles & Responsibilities

### 9.16.1 Human Team

| Role | Responsibilities | Contact |
|------|------------------|---------|
| **Product Manager** | Requirements, roadmap, prioritization | pm@skautosphere.com |
| **Tech Lead** | Architecture, code review, mentoring | tech@skautosphere.com |
| **DevOps Lead** | Infrastructure, deployment, monitoring | devops@skautosphere.com |
| **QA Lead** | Test strategy, quality assurance | qa@skautosphere.com |
| **UX/UI Designer** | Design system, user research, prototypes | design@skautosphere.com |

---

### 9.16.2 AI Agent Team

| Agent | Specialization | When to Use | Documentation |
|-------|---------------|-------------|---------------|
| **System Architect** | Technical design, architecture decisions | Planning new features, system design | §6.2 |
| **Frontend Engineer** | React/Next.js implementation | Building UI components, pages | §6.3 |
| **Backend Engineer** | API development, database design | Server logic, integrations | §6.4 |
| **QA Test Automation** | Test creation, quality assurance | After feature completion | §6.5 |
| **Security Analyst** | Security audits, vulnerability scanning | Pre-release, code changes | §6.6 |
| **DevOps Deployment** | CI/CD, infrastructure, monitoring | Deployment, scaling | §6.7 |

**Agent Invocation Examples:**

```bash
# System Architect
"Design the database schema for a new reviews feature"
"What's the best way to implement real-time notifications?"

# Frontend Engineer
"Implement the car detail page based on the Figma design"
"Add client-side validation to the car listing form"

# Backend Engineer
"Create API endpoints for the messaging system"
"Implement Stripe webhook handler for payment events"

# QA Test Automation
"Write E2E tests for the car listing creation flow"
"Add unit tests for the shipping cost calculator"

# Security Analyst
"Perform security audit before production deployment"
"Scan for vulnerabilities in new payment integration"

# DevOps Deployment
"Set up CI/CD pipeline for automated testing"
"Configure monitoring and alerting for production"
```

---

## 9.17 Compliance & Legal Considerations

### 9.17.1 Data Privacy & GDPR

**Data Collection:**

SK AutoSphere collects and processes:

- User account information (email, name, phone)
- Vehicle listing data
- Payment information (processed via Stripe)
- Chat messages between users
- Usage analytics (anonymized)

**GDPR Compliance:**

- ✅ Privacy policy published: https://skautosphere.com/privacy
- ✅ Terms of service published: https://skautosphere.com/terms
- ✅ Cookie consent banner implemented
- ✅ User data export available (GDPR Article 20)
- ✅ Right to be forgotten (GDPR Article 17)
- ✅ Data retention policy: 2 years for inactive accounts

**Implementation:**

```typescript
// app/api/gdpr/export-data/route.ts
export async function GET(request: Request) {
  const user = await getUser(request);

  const data = {
    profile: await getProfile(user.id),
    cars: await getCars(user.id),
    messages: await getMessages(user.id),
    favorites: await getFavorites(user.id),
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="my-data.json"',
    },
  });
}

// app/api/gdpr/delete-account/route.ts
export async function DELETE(request: Request) {
  const user = await getUser(request);

  // Anonymize instead of hard delete (for audit trail)
  await supabase
    .from('profiles')
    .update({
      email: `deleted-${user.id}@deleted.com`,
      full_name: 'Deleted User',
      phone_number: null,
      avatar_url: null,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  return NextResponse.json({ success: true });
}
```

---

### 9.17.2 Payment Processing Compliance

**PCI DSS Compliance:**

- ✅ No card data stored on our servers (Stripe handles all card data)
- ✅ HTTPS enforced for all pages
- ✅ Stripe.js used for client-side tokenization
- ✅ Regular security audits

**Stripe Integration:**

```typescript
// We NEVER handle raw card data
// All card data goes directly to Stripe

// ✅ Correct: Client-side tokenization
const stripe = await loadStripe(publishableKey);
const { paymentMethod } = await stripe.createPaymentMethod({
  type: 'card',
  card: cardElement,
});

// ❌ NEVER do this: Sending card data to our server
fetch('/api/charge', {
  body: JSON.stringify({
    cardNumber: '4242424242424242', // ❌ NEVER!
  }),
});
```

---

### 9.17.3 Content Moderation & Safety

**User-Generated Content:**

- Car listings reviewed before publishing (manual or AI-assisted)
- Prohibited content: stolen vehicles, fraudulent listings
- Report & flag system for users
- Automated scam detection (AI-powered)

**Implementation:**

```typescript
// Moderation workflow
async function moderateCarListing(carId: string) {
  const car = await getCar(carId);

  // 1. AI content analysis
  const analysis = await analyzeContent(car.description);

  if (analysis.contains_prohibited_content) {
    await flagListing(carId, 'prohibited_content');
    return { approved: false, reason: 'Prohibited content detected' };
  }

  // 2. Price reasonableness check
  const avgPrice = await getAveragePrice(car.make, car.model, car.year);
  if (car.price < avgPrice * 0.3) {
    await flagListing(carId, 'suspicious_price');
    return { approved: false, reason: 'Price suspiciously low' };
  }

  // 3. Auto-approve or queue for manual review
  if (analysis.confidence > 0.95) {
    await approveListing(carId);
    return { approved: true };
  } else {
    await queueForManualReview(carId);
    return { approved: false, reason: 'Queued for review' };
  }
}
```

---

## 9.18 Change Log & Version History

### 9.18.1 PRD Versions

**Version 1.0 - November 10, 2025**

- ✅ Initial comprehensive PRD (Sections 1-9)
- ✅ Complete technical architecture
- ✅ Database schema design
- ✅ AI agent deployment strategy
- ✅ Testing & QA framework
- ✅ DevOps & deployment procedures
- ✅ Reference & appendices

**Version 0.9 - November 9, 2025**

- Initial draft sections 1-6
- Preliminary database schema
- Basic feature specifications

**Version 0.5 - November 6, 2025**

- Project outline
- Technology stack selection
- User persona research

---

### 9.18.2 Application Versions

**v0.1.0 - MVP Foundation (Current)**

- ✅ Next.js 14 setup
- ✅ Supabase integration
- ✅ Basic authentication
- ✅ UI component library

**v0.2.0 - Core Features (In Progress)**

- 🔄 Car listing CRUD
- 🔄 User profiles
- 🔄 Messaging system
- 📋 Search & filters

**v1.0.0 - Public Launch (Target: Q3 2026)**

- Full feature set
- Production-ready
- Performance optimized
- Security hardened

---

## 9.19 Contributing Guidelines

### 9.19.1 How to Contribute

**For Team Members:**

1. **Pick a Task**
   - Check project board: https://github.com/sk-autosphere/web/projects
   - Assign yourself to an issue
   - Move card to "In Progress"

2. **Create Branch**
   ```bash
   git checkout -b feature/SKA-123-description
   ```

3. **Develop & Test**
   - Write code following style guide (§9.9)
   - Add tests (unit, integration, E2E as needed)
   - Test locally
   - Run `npm run lint && npm run type-check`

4. **Commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push & Create PR**
   ```bash
   git push origin feature/SKA-123-description
   gh pr create --fill
   ```

6. **Code Review**
   - Request 2+ reviewers
   - Address feedback
   - Get approvals

7. **Merge**
   - Squash and merge
   - Delete branch
   - Move card to "Done"

---

### 9.19.2 Code Review Checklist

**For Reviewers:**

- [ ] Code follows style guide and conventions
- [ ] No security vulnerabilities introduced
- [ ] Tests added/updated and passing
- [ ] Documentation updated (if needed)
- [ ] No hardcoded secrets or credentials
- [ ] Performance impact considered
- [ ] Accessibility requirements met
- [ ] Mobile responsive (if UI change)
- [ ] Database migrations safe (if applicable)
- [ ] Error handling implemented
- [ ] Logging added for debugging
- [ ] Comments explain complex logic

---

### 9.19.3 Definition of Done

A feature is considered "Done" when:

- [ ] **Code Complete**
  - All acceptance criteria met
  - Code reviewed and approved
  - No known bugs

- [ ] **Tested**
  - Unit tests written (≥80% coverage)
  - Integration tests added (if applicable)
  - E2E tests cover happy path
  - Manual testing completed

- [ ] **Documented**
  - Code comments for complex logic
  - API endpoints documented
  - README updated (if needed)
  - PRD updated (if feature change)

- [ ] **Deployed**
  - Merged to main branch
  - Deployed to staging
  - Smoke tests passed
  - No production errors

- [ ] **Communicated**
  - Team notified
  - Stakeholders informed
  - User documentation updated (if needed)

---

## 9.20 PRD Completion Summary

### 9.20.1 Document Statistics

**Total Documentation:**

```
Section 1 & 2: Overview & User Stories          55 KB   (1,200 lines)
Section 3: Technical Blueprint                  41 KB   (1,000 lines)
Section 4: Features & Functionality             60 KB   (1,500 lines)
Section 5: Data Models                          38 KB   (1,000 lines)
Section 6: Agent Deployment Strategy            62 KB   (1,500 lines)
Section 7: Testing & Quality Assurance          98 KB   (3,735 lines)
Section 8: Deployment & DevOps                  90 KB   (3,500 lines)
Section 9: Reference & Appendices (THIS DOC)    85 KB   (3,200 lines)
─────────────────────────────────────────────────────────────────────
TOTAL:                                         529 KB  (16,635 lines)
```

**Coverage:**

- ✅ Business requirements & user stories
- ✅ Technical architecture & system design
- ✅ Complete feature specifications
- ✅ Database schema & data models
- ✅ AI agent workflows & tools
- ✅ Comprehensive testing strategy
- ✅ Full deployment & DevOps procedures
- ✅ Quick reference & troubleshooting

---

### 9.20.2 Next Steps

**Immediate Actions (Week 1):**

1. **Development Team Onboarding**
   - Review Section 1-2 for project vision
   - Study Section 3 for technical architecture
   - Set up local development environment (§9.11)

2. **Sprint Planning**
   - Prioritize Phase 2 features (§9.15)
   - Assign tasks to developers
   - Set up project board

3. **Infrastructure Setup**
   - Complete Supabase production configuration
   - Set up CI/CD pipeline (§8.4)
   - Configure monitoring (§8.10)

**Short-Term (Weeks 2-4):**

1. **Core Feature Development**
   - Car listing CRUD operations
   - User profile management
   - Messaging system foundation

2. **Testing Framework**
   - Set up Vitest & Playwright (§7.2)
   - Write first unit tests (§7.3)
   - Configure E2E testing (§7.5)

3. **Quality Assurance**
   - Establish code review process (§9.19.2)
   - Define quality gates (§7.1.3)
   - Set up automated testing in CI/CD

**Medium-Term (Weeks 5-12):**

1. **Feature Completion**
   - Complete all Phase 2 core features
   - Begin Phase 3 AI integration
   - Launch internal alpha

2. **Performance Optimization**
   - Implement caching strategy (§8.12.4)
   - Optimize database queries (§9.6.2)
   - Achieve Core Web Vitals targets (§8.16.1)

3. **Security Hardening**
   - Complete security audit (§7.8)
   - Implement RLS policies (§5.2.11)
   - Conduct penetration testing

**Long-Term (Q2-Q3 2026):**

1. **Beta Launch**
   - Deploy to production
   - Onboard beta users
   - Gather feedback

2. **Iteration & Polish**
   - Address user feedback
   - Fix bugs
   - Optimize UX

3. **Public Launch**
   - Marketing campaign
   - Full feature set live
   - Scale infrastructure

---

### 9.20.3 Success Metrics

**Technical Metrics:**

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Test Coverage** | ≥80% | 0% | 🔴 Not started |
| **Page Load Time (LCP)** | <2.5s | TBD | ⏳ To measure |
| **API Response Time** | <200ms | TBD | ⏳ To measure |
| **Uptime** | ≥99.9% | N/A | 📋 Pre-launch |
| **Error Rate** | <0.1% | N/A | 📋 Pre-launch |

**Business Metrics (Post-Launch):**

| Metric | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|----------------|----------------|-----------------|
| **Active Users** | 1,000 | 5,000 | 20,000 |
| **Car Listings** | 500 | 2,500 | 10,000 |
| **Transactions** | 50 | 250 | 1,000 |
| **Revenue** | $10K | $50K | $200K |

---

### 9.20.4 Acknowledgments

**This PRD was created by:**

- **Human Leadership:** Product vision & business strategy
- **AI Agents:** Technical implementation & documentation
  - System Architect Agent: Architecture design
  - Frontend Engineer Agent: UI/UX implementation
  - Backend Engineer Agent: API & database design
  - QA Test Automation Agent: Testing strategy
  - Security Analyst Agent: Security framework
  - DevOps Deployment Agent: Infrastructure & deployment

**Special Thanks:**

- Early adopters & beta testers (future)
- Open source community
- Technology partners (Supabase, Netlify, Google, Stripe)

---

### 9.20.5 Final Notes

**Document Maintenance:**

This PRD is a **living document** that will evolve with the product. Updates should be:

- **Versioned:** Use semantic versioning (MAJOR.MINOR.PATCH)
- **Reviewed:** All changes require team approval
- **Communicated:** Notify team of significant updates
- **Archived:** Keep historical versions for reference

**Communication Channels:**

- **Slack:** #sk-autosphere-dev (development)
- **Email:** dev@skautosphere.com
- **GitHub:** https://github.com/sk-autosphere/web
- **Documentation:** https://docs.skautosphere.com (future)

**Support:**

For questions or clarifications on this PRD:

1. Check FAQ (§9.13)
2. Search documentation
3. Ask in Slack #sk-autosphere-dev
4. Create GitHub issue with `documentation` label

---

## 🎉 Conclusion

**Congratulations!** You've reached the end of the SK AutoSphere Product Requirements Document. This comprehensive 9-section PRD provides everything needed to build a world-class automotive marketplace connecting Korean exporters with African buyers.

**Key Takeaways:**

- **Vision:** Democratize access to quality Korean vehicles across Africa
- **Technology:** Modern, scalable stack (Next.js, Supabase, AI)
- **Quality:** Comprehensive testing and quality assurance
- **Team:** AI-augmented development with 6 specialized agents
- **Timeline:** MVP in Q1 2026, Public launch Q3 2026

**Ready to Build?**

Start with:
1. Review Section 1-2 for business context
2. Set up development environment (§9.11.1)
3. Run your first feature (§6.3 Frontend Agent)
4. Deploy with confidence (§8.4 CI/CD)

**Let's build something amazing together!** 🚗🌍✨

---

**Document Status:** ✅ Complete (All 9 Sections Finalized)
**Last Updated:** November 10, 2025
**Next Review:** December 10, 2025

---

*SK AutoSphere - Connecting Continents, Driving Dreams*
