# SECTION 8: DEPLOYMENT & DEVOPS OPERATIONS

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Status:** ✅ Framework Approved - Implementation In Progress
**Project:** SK AutoSphere (teyloksuvmmhqixjqoch)
**Section:** 8 of 9

---

## 📋 Table of Contents

- [8.1 Deployment Philosophy & Strategy](#81-deployment-philosophy--strategy)
- [8.2 Infrastructure Architecture](#82-infrastructure-architecture)
- [8.3 Environment Management](#83-environment-management)
- [8.4 CI/CD Pipeline Configuration](#84-cicd-pipeline-configuration)
- [8.5 Supabase Deployment Strategy](#85-supabase-deployment-strategy)
- [8.6 Docker & Containerization](#86-docker--containerization)
- [8.7 Environment Variables & Secrets Management](#87-environment-variables--secrets-management)
- [8.8 Database Migration & Rollback](#88-database-migration--rollback)
- [8.9 Deployment Workflows](#89-deployment-workflows)
- [8.10 Monitoring & Observability](#810-monitoring--observability)
- [8.11 Backup & Disaster Recovery](#811-backup--disaster-recovery)
- [8.12 Scaling Strategy](#812-scaling-strategy)
- [8.13 CDN & Asset Optimization](#813-cdn--asset-optimization)
- [8.14 Domain & DNS Configuration](#814-domain--dns-configuration)
- [8.15 SSL/TLS & Security Hardening](#815-ssltls--security-hardening)
- [8.16 Performance Optimization](#816-performance-optimization)
- [8.17 Incident Response & Rollback](#817-incident-response--rollback)
- [8.18 Release Management Process](#818-release-management-process)
- [8.19 Cost Optimization Strategies](#819-cost-optimization-strategies)
- [8.20 DevOps Best Practices](#820-devops-best-practices)

---

## 8.1 Deployment Philosophy & Strategy

### 8.1.1 DevOps Culture & Principles

**Core Philosophy:**

SK AutoSphere adopts a **"Deploy Early, Deploy Often"** approach with emphasis on:

1. **Continuous Delivery** - Every commit is potentially deployable
2. **Infrastructure as Code** - All infrastructure is version-controlled
3. **Automated Everything** - Manual deployment steps are eliminated
4. **Observability First** - Deploy with monitoring, not hope
5. **Zero-Downtime Deployments** - Users never experience service interruption

**Why This Matters:**

- **10x faster time-to-market** with automated deployments
- **99.9% uptime** through blue-green deployment strategies
- **<5 minute rollback** capability for critical issues
- **50% reduction in deployment-related incidents**

---

### 8.1.2 Deployment Maturity Model

**Our Current State: Level 3 (Automated Continuous Delivery)**

```
Level 1: Manual Deployment
├── Manual server configuration
├── Manual file uploads
└── Manual database updates

Level 2: Basic Automation
├── Scripted deployments
├── CI/CD for testing
└── Automated builds

Level 3: Continuous Delivery ← WE ARE HERE
├── Automated deployment to staging
├── One-click production deployment
├── Automated rollbacks
└── Infrastructure as Code

Level 4: Continuous Deployment (Future)
├── Automated production deployment
├── Feature flags for gradual rollout
├── Automated canary deployments
└── Self-healing infrastructure
```

**Roadmap to Level 4:**
- Q1 2026: Implement feature flags (LaunchDarkly/Flagsmith)
- Q2 2026: Progressive delivery with canary deployments
- Q3 2026: Full continuous deployment with automated testing gates

---

### 8.1.3 Risk Management Strategy

**Deployment Risk Classification:**

| Change Type | Risk Level | Approval Required | Rollback Strategy |
|-------------|------------|-------------------|-------------------|
| **Hotfix** | 🔴 Critical | CTO + Lead Dev | Automated instant rollback |
| **Feature Flag Toggle** | 🟡 Low | Product Manager | Feature flag off |
| **Database Migration** | 🔴 Critical | DBA + CTO | Automated rollback script |
| **UI Update** | 🟢 Minimal | Code review only | Git revert + redeploy |
| **API Change** | 🟡 Medium | API Owner + QA | Version rollback |
| **Config Change** | 🟡 Medium | DevOps Lead | Config rollback |

**Pre-Deployment Checklist:**
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review approved by 2+ engineers
- [ ] Database migration tested on staging
- [ ] Rollback plan documented
- [ ] Monitoring dashboards ready
- [ ] On-call engineer notified
- [ ] Feature flags configured (if applicable)

---

## 8.2 Infrastructure Architecture

### 8.2.1 Multi-Cloud Strategy

**Primary Platform: Netlify**

```
┌─────────────────────────────────────────────────────────┐
│                    NETLIFY (Primary)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                 │
│  │  Next.js App │    │  Edge Funcs  │                 │
│  │  (SSR + SSG) │    │  (Serverless)│                 │
│  └──────────────┘    └──────────────┘                 │
│         │                    │                          │
│         └────────┬───────────┘                          │
│                  │                                      │
│         ┌────────▼────────┐                            │
│         │   Netlify CDN   │                            │
│         │  (Global Edge)  │                            │
│         └─────────────────┘                            │
│                  │                                      │
└──────────────────┼──────────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   SUPABASE CLOUD    │
        ├─────────────────────┤
        │  • PostgreSQL DB    │
        │  • Auth Service     │
        │  • Storage (S3)     │
        │  • Realtime         │
        │  • Edge Functions   │
        └─────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  THIRD-PARTY APIs   │
        ├─────────────────────┤
        │  • Google Gemini AI │
        │  • Stripe Payments  │
        │  • Shippo Shipping  │
        │  • Sentry Monitoring│
        └─────────────────────┘
```

**Backup Platform: Vercel**

- Identical configuration to Netlify
- Automatic failover via DNS (Cloudflare)
- Used for A/B testing new deployment strategies

---

### 8.2.2 Infrastructure as Code (IaC)

**Project Structure:**

```
sk-autosphere/
├── .github/
│   └── workflows/
│       ├── deploy-production.yml
│       ├── deploy-staging.yml
│       ├── preview-pr.yml
│       └── cleanup-preview.yml
├── netlify.toml              # Netlify configuration
├── vercel.json              # Vercel configuration (backup)
├── docker-compose.yml       # Local development
├── Dockerfile              # Production container (optional)
└── infrastructure/
    ├── scripts/
    │   ├── deploy.sh
    │   ├── rollback.sh
    │   └── health-check.sh
    └── monitoring/
        ├── sentry-config.js
        └── analytics-config.js
```

**netlify.toml Configuration:**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20.x"
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin"]}

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[dev]
  command = "npm run dev"
  targetPort = 3000
  publish = ".next"
```

---

### 8.2.3 Regional Distribution

**Global Edge Locations:**

| Region | Provider | Primary Use | Latency Target |
|--------|----------|-------------|----------------|
| **South Korea** | Seoul (AWS ap-northeast-2) | Korean sellers | <50ms |
| **Kenya** | Nairobi (AWS af-south-1) | East African buyers | <100ms |
| **South Africa** | Cape Town (AWS af-south-1) | Southern African buyers | <100ms |
| **Europe** | Frankfurt (AWS eu-central-1) | Admin/Support | <80ms |
| **USA** | Oregon (AWS us-west-2) | Development/Testing | <150ms |

**CDN Strategy:**
- **Netlify Edge Network:** 100+ global locations
- **Cloudflare:** DNS + DDoS protection
- **Supabase Global:** Multi-region database replication (coming Q2 2026)

---

## 8.3 Environment Management

### 8.3.1 Environment Hierarchy

```
Production (main branch)
├── Domain: skautosphere.com
├── Database: Supabase Production
├── Monitoring: Full observability
└── Deployment: Manual approval required

Staging (staging branch)
├── Domain: staging.skautosphere.com
├── Database: Supabase Staging (production clone)
├── Monitoring: Same as production
└── Deployment: Automatic on push

Preview (PR branches)
├── Domain: pr-{number}.deploy-preview.skautosphere.com
├── Database: Supabase Dev (shared)
├── Monitoring: Basic error tracking
└── Deployment: Automatic on PR creation

Development (local)
├── Domain: localhost:3000
├── Database: Local Supabase (Docker)
├── Monitoring: Console logs only
└── Deployment: Hot reload
```

---

### 8.3.2 Environment Configuration Matrix

| Feature | Development | Preview | Staging | Production |
|---------|------------|---------|---------|------------|
| **Database** | Local Docker | Shared Dev | Production Clone | Production |
| **Auth** | Test users | Real auth (test mode) | Real auth | Real auth |
| **Payments** | Stripe Test | Stripe Test | Stripe Test | Stripe Live |
| **AI (Gemini)** | Free tier | Free tier | Pro tier | Pro tier |
| **Email** | Console logs | Resend sandbox | Resend sandbox | Resend production |
| **File Storage** | Local | Supabase Dev | Supabase Staging | Supabase Prod |
| **Analytics** | Disabled | Disabled | Enabled | Enabled |
| **Error Tracking** | Console | Sentry Dev | Sentry | Sentry |
| **Rate Limiting** | Disabled | 1000/hour | 1000/hour | 100/hour |

---

### 8.3.3 Environment Variable Strategy

**.env.local (Development):**

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# AI
GEMINI_API_KEY=AIza...

# Payments
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=sntrys_...

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_SHIPPING_CALC=false
```

**.env.production (Netlify):**

```bash
# NEVER commit this file!
# Set via Netlify Dashboard > Site Settings > Environment Variables

# Database (Production)
NEXT_PUBLIC_SUPABASE_URL=https://teyloksuvmmhqixjqoch.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# AI (Production)
GEMINI_API_KEY=${GEMINI_API_KEY_PROD}

# Payments (LIVE)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY_LIVE}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET_LIVE}

# Security
JWT_SECRET=${JWT_SECRET}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
```

**Environment Variable Naming Convention:**

- `NEXT_PUBLIC_*` - Exposed to browser (public data only)
- `SUPABASE_*` - Database credentials
- `STRIPE_*` - Payment processing
- `GEMINI_*` - AI services
- `SENTRY_*` - Monitoring
- `*_SECRET` or `*_KEY` - Sensitive data (never log)

---

## 8.4 CI/CD Pipeline Configuration

### 8.4.1 GitHub Actions Workflow Architecture

**Workflow Triggers:**

```yaml
# .github/workflows/deploy-production.yml

name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger

concurrency:
  group: production-deployment
  cancel-in-progress: false  # Never cancel production deployments

env:
  NODE_VERSION: '20.x'
  NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
  NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}

jobs:
  # Job 1: Quality Gates
  quality-gates:
    name: Quality Gates
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript type checking
        run: npm run type-check

      - name: ESLint
        run: npm run lint

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: true

      - name: Check test coverage threshold
        run: |
          COVERAGE=$(jq '.total.lines.pct' coverage/coverage-summary.json)
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

  # Job 2: Integration Tests
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: quality-gates
    timeout-minutes: 15

    services:
      postgres:
        image: supabase/postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Start local Supabase
        run: npx supabase start

      - name: Run database migrations
        run: npx supabase db push

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres

  # Job 3: E2E Tests
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: quality-gates
    timeout-minutes: 20

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # Job 4: Security Scan
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: quality-gates
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Check for secrets in code
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

  # Job 5: Build & Deploy
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [quality-gates, integration-tests, e2e-tests, security-scan]
    timeout-minutes: 15
    environment:
      name: production
      url: https://skautosphere.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Supabase types
        run: npm run db:generate-types
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.PROD_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PROD_SUPABASE_ANON_KEY }}
          NEXT_TELEMETRY_DISABLED: 1

      - name: Deploy to Netlify
        id: deploy
        uses: nwtgck/actions-netlify@v2.1
        with:
          publish-dir: './.next'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions - ${{ github.event.head_commit.message }}"
          enable-pull-request-comment: false
          enable-commit-comment: true
          overwrites-pull-request-comment: false
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      - name: Wait for deployment to be live
        run: |
          echo "Waiting for deployment to be accessible..."
          timeout 300 bash -c 'until curl -f -s https://skautosphere.com/api/health > /dev/null; do sleep 5; done'

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: https://skautosphere.com

      - name: Notify Sentry of deployment
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: sk-autosphere
          SENTRY_PROJECT: web-app
        with:
          environment: production
          version: ${{ github.sha }}

      - name: Send Slack notification
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            Production Deployment ${{ job.status }}
            Commit: ${{ github.event.head_commit.message }}
            Author: ${{ github.actor }}
            URL: https://skautosphere.com
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

### 8.4.2 Preview Deployment Workflow

**Purpose:** Deploy every PR for team review

```yaml
# .github/workflows/preview-pr.yml

name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.DEV_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.DEV_SUPABASE_ANON_KEY }}

      - name: Deploy to Netlify (Preview)
        uses: nwtgck/actions-netlify@v2.1
        with:
          publish-dir: './.next'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Preview for PR #${{ github.event.number }}"
          alias: pr-${{ github.event.number }}
          enable-pull-request-comment: true
          enable-commit-comment: false
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      - name: Comment PR with preview URL
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `### 🚀 Preview Deployment Ready!

              Preview URL: https://pr-${{ github.event.number }}--skautosphere.netlify.app

              - ✅ Build successful
              - 📱 Test on mobile devices
              - 🔍 Review UI changes
              - 🧪 Run manual QA tests`
            })
```

---

### 8.4.3 Database Migration Workflow

```yaml
# .github/workflows/db-migration.yml

name: Database Migration

on:
  push:
    paths:
      - 'supabase/migrations/**'
    branches: [main]
  workflow_dispatch:

jobs:
  migrate-staging:
    name: Migrate Staging Database
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Link to Supabase project (Staging)
        run: |
          supabase link --project-ref ${{ secrets.STAGING_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Run migrations on staging
        run: supabase db push

      - name: Verify migration success
        run: |
          supabase db diff --schema public --linked
          if [ $? -ne 0 ]; then
            echo "Migration verification failed"
            exit 1
          fi

  migrate-production:
    name: Migrate Production Database
    runs-on: ubuntu-latest
    needs: migrate-staging
    environment:
      name: production-db

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Create database backup
        run: |
          supabase db dump --project-ref ${{ secrets.PROD_PROJECT_REF }} > backup.sql
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Upload backup to S3
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Link to Supabase project (Production)
        run: supabase link --project-ref ${{ secrets.PROD_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Run migrations on production
        run: supabase db push

      - name: Verify production database
        run: |
          supabase db diff --schema public --linked
          if [ $? -ne 0 ]; then
            echo "Production migration verification failed"
            exit 1
          fi

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: Production database migration completed
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 8.5 Supabase Deployment Strategy

### 8.5.1 Supabase Project Structure

**Multi-Environment Setup:**

```
Supabase Organization: SK AutoSphere
├── Production (teyloksuvmmhqixjqoch)
│   ├── Region: ap-northeast-2 (Seoul)
│   ├── Database: PostgreSQL 15
│   ├── Storage: 100GB
│   └── Backups: Daily + Point-in-time recovery
│
├── Staging (staging-ref-12345)
│   ├── Region: ap-northeast-2 (Seoul)
│   ├── Database: Production clone (nightly)
│   └── Storage: 50GB
│
└── Development (dev-ref-67890)
    ├── Region: us-west-2 (Oregon)
    ├── Database: Seed data only
    └── Storage: 10GB
```

---

### 8.5.2 Migration Management

**Migration Workflow:**

```bash
# 1. Create new migration locally
supabase migration new add_car_favorites_table

# 2. Edit migration file
# supabase/migrations/20250110_add_car_favorites_table.sql

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, car_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_car_id ON public.favorites(car_id);

# 3. Test migration locally
supabase db reset  # Apply all migrations from scratch
npm run test:db    # Run database tests

# 4. Apply to staging
supabase link --project-ref staging-ref-12345
supabase db push

# 5. Verify on staging
supabase db diff --linked  # Should show no differences

# 6. Create rollback script
# supabase/migrations/20250110_add_car_favorites_table_rollback.sql
DROP TABLE IF EXISTS public.favorites CASCADE;

# 7. Production deployment (via CI/CD)
git add supabase/migrations/
git commit -m "feat(db): add favorites table"
git push origin main  # Triggers production migration workflow
```

---

### 8.5.3 Supabase CLI Commands Reference

```bash
# Project Management
supabase login                          # Authenticate with Supabase
supabase projects list                  # List all projects
supabase link --project-ref <ref>       # Link to remote project
supabase status                         # Check local Supabase status

# Local Development
supabase start                          # Start local Supabase (Docker)
supabase stop                           # Stop local Supabase
supabase db reset                       # Reset local database
supabase db seed                        # Run seed scripts

# Migrations
supabase migration new <name>           # Create new migration
supabase db diff                        # Show schema differences
supabase db push                        # Apply migrations to remote
supabase migration list                 # List all migrations
supabase migration repair <version>     # Mark migration as applied

# Database Operations
supabase db dump > backup.sql           # Backup database
supabase db dump --data-only > data.sql # Backup data only
psql -h localhost -p 54322 -U postgres  # Connect to local DB

# Type Generation
supabase gen types typescript \
  --project-id teyloksuvmmhqixjqoch \
  --schema public \
  > src/types/database.types.ts

# Functions
supabase functions new <name>           # Create new Edge Function
supabase functions deploy <name>        # Deploy function to remote
supabase functions serve                # Run functions locally

# Secrets Management
supabase secrets list                   # List all secrets
supabase secrets set MY_SECRET=value    # Set secret
supabase secrets unset MY_SECRET        # Remove secret
```

---

### 8.5.4 Database Backup Strategy

**Automated Backups:**

```bash
#!/bin/bash
# infrastructure/scripts/backup-database.sh

# Configuration
PROJECT_REF="teyloksuvmmhqixjqoch"
BACKUP_DIR="/backups/supabase"
RETENTION_DAYS=30
S3_BUCKET="s3://sk-autosphere-backups"

# Create backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Perform backup
echo "Starting backup at $(date)"
supabase db dump \
  --project-ref ${PROJECT_REF} \
  --data-only \
  > ${BACKUP_FILE}

# Compress backup
gzip ${BACKUP_FILE}
BACKUP_FILE="${BACKUP_FILE}.gz"

# Upload to S3
echo "Uploading to S3..."
aws s3 cp ${BACKUP_FILE} ${S3_BUCKET}/daily/ \
  --storage-class STANDARD_IA

# Verify upload
if [ $? -eq 0 ]; then
  echo "Backup uploaded successfully: ${BACKUP_FILE}"
else
  echo "ERROR: Backup upload failed"
  exit 1
fi

# Remove local backups older than retention period
find ${BACKUP_DIR} -name "backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# Remove old S3 backups
aws s3 ls ${S3_BUCKET}/daily/ \
  | awk '{print $4}' \
  | while read file; do
    AGE=$(( ( $(date +%s) - $(date -d "$(aws s3 ls ${S3_BUCKET}/daily/${file} | awk '{print $1" "$2}')" +%s) ) / 86400 ))
    if [ ${AGE} -gt ${RETENTION_DAYS} ]; then
      aws s3 rm ${S3_BUCKET}/daily/${file}
      echo "Deleted old backup: ${file}"
    fi
  done

echo "Backup completed at $(date)"
```

**Backup Schedule:**

| Backup Type | Frequency | Retention | Storage |
|-------------|-----------|-----------|---------|
| **Full DB Backup** | Daily 2 AM UTC | 30 days | S3 Standard-IA |
| **Incremental Backup** | Every 6 hours | 7 days | S3 Standard |
| **Point-in-Time Recovery** | Continuous | 7 days | Supabase Built-in |
| **Weekly Archive** | Sundays 3 AM UTC | 1 year | S3 Glacier |

---

## 8.6 Docker & Containerization

### 8.6.1 Local Development with Docker

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  # Next.js Application
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_SUPABASE_URL=http://supabase:54321
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    depends_on:
      - supabase
    networks:
      - sk-autosphere

  # Supabase Local Instance
  supabase:
    image: supabase/postgres:15
    ports:
      - "54322:5432"
      - "54321:8000"  # Kong API Gateway
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - supabase-db:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d
    networks:
      - sk-autosphere
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis for caching (optional)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - sk-autosphere
    command: redis-server --appendonly yes

volumes:
  supabase-db:
  redis-data:

networks:
  sk-autosphere:
    driver: bridge
```

**Dockerfile.dev (Development):**

```dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start development server with hot reload
CMD ["npm", "run", "dev"]
```

**Dockerfile (Production - Optional):**

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Supabase types
ARG SUPABASE_ACCESS_TOKEN
RUN npm run db:generate-types

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

---

### 8.6.2 Docker Commands Reference

```bash
# Development
docker-compose up -d              # Start all services
docker-compose logs -f web        # View web app logs
docker-compose exec web sh        # Shell into web container
docker-compose down               # Stop all services
docker-compose down -v            # Stop and remove volumes

# Database Management
docker-compose exec supabase psql -U postgres  # Access database
docker-compose exec supabase pg_dump > backup.sql  # Backup

# Rebuild after dependency changes
docker-compose build --no-cache web
docker-compose up -d web

# Clean up
docker system prune -a            # Remove unused images
docker volume prune               # Remove unused volumes
```

---

## 8.7 Environment Variables & Secrets Management

### 8.7.1 Secrets Management Strategy

**Security Levels:**

```
Level 1: Public (Safe for Browser)
├── NEXT_PUBLIC_SUPABASE_URL
├── NEXT_PUBLIC_APP_URL
└── NEXT_PUBLIC_ENABLE_*  (Feature flags)

Level 2: Server-Side Only (Medium Security)
├── SUPABASE_SERVICE_ROLE_KEY
├── GEMINI_API_KEY
└── STRIPE_PUBLISHABLE_KEY

Level 3: Highly Sensitive (Maximum Security)
├── STRIPE_SECRET_KEY
├── STRIPE_WEBHOOK_SECRET
├── JWT_SECRET
└── DATABASE_URL
```

---

### 8.7.2 Netlify Environment Variables Setup

**Via Netlify Dashboard:**

```
1. Go to: Site Settings > Environment Variables
2. Add production variables:

Production Variables:
┌─────────────────────────────────┬────────────────────────┐
│ Key                             │ Value                  │
├─────────────────────────────────┼────────────────────────┤
│ NEXT_PUBLIC_SUPABASE_URL        │ https://...supabase.co │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY   │ eyJhbGc...             │
│ SUPABASE_SERVICE_ROLE_KEY       │ eyJhbGc... (ENCRYPTED) │
│ GEMINI_API_KEY                  │ AIza... (ENCRYPTED)    │
│ STRIPE_SECRET_KEY               │ sk_live... (ENCRYPTED) │
│ STRIPE_WEBHOOK_SECRET           │ whsec... (ENCRYPTED)   │
│ NEXTAUTH_SECRET                 │ <generated> (ENCRYPT)  │
│ SENTRY_AUTH_TOKEN               │ sntrys... (ENCRYPTED)  │
└─────────────────────────────────┴────────────────────────┘

3. Set variable scopes:
   • Production: main branch only
   • Staging: staging branch
   • Preview: all branches
```

---

### 8.7.3 Secret Rotation Policy

**Rotation Schedule:**

| Secret Type | Rotation Frequency | Owner | Notification |
|-------------|-------------------|-------|--------------|
| **Database Passwords** | 90 days | DevOps Lead | Slack + Email |
| **API Keys** | 180 days | Tech Lead | Slack |
| **JWT Secrets** | Never (unless compromised) | CTO | Incident Response |
| **Webhook Secrets** | 180 days | Backend Lead | Slack |
| **Service Account Keys** | 90 days | DevOps Lead | Slack + Email |

**Rotation Procedure:**

```bash
#!/bin/bash
# infrastructure/scripts/rotate-secrets.sh

# 1. Generate new secret
NEW_SECRET=$(openssl rand -base64 32)

# 2. Update in Netlify
netlify env:set STRIPE_WEBHOOK_SECRET "${NEW_SECRET}" \
  --context production

# 3. Update in Stripe Dashboard
# (Manual step - update webhook endpoint)

# 4. Verify new secret works
curl -X POST https://skautosphere.com/api/webhooks/stripe \
  -H "stripe-signature: ${NEW_SIGNATURE}" \
  --data @test-webhook.json

# 5. Monitor for errors
# (Check Sentry for webhook failures)

# 6. Remove old secret after 24 hours
# (Allow time for in-flight requests)
```

---

## 8.8 Database Migration & Rollback

### 8.8.1 Safe Migration Process

**Pre-Migration Checklist:**

```markdown
## Migration Pre-Flight Checklist

### Planning
- [ ] Migration tested on local environment
- [ ] Migration tested on staging (production clone)
- [ ] Rollback script created and tested
- [ ] Estimated migration duration: _____ minutes
- [ ] Database backup created (< 1 hour old)
- [ ] Team notified of planned maintenance

### Risk Assessment
- [ ] Breaking changes identified: Yes / No
- [ ] Data transformation required: Yes / No
- [ ] Affects more than 1M rows: Yes / No
- [ ] Requires application downtime: Yes / No
- [ ] Rollback plan documented

### Communication
- [ ] Maintenance window scheduled (if needed)
- [ ] Status page updated
- [ ] Customer support team notified
- [ ] Monitoring dashboards prepared

### Approval
- [ ] Reviewed by: _______________
- [ ] Approved by CTO: Yes / No
- [ ] Scheduled for: YYYY-MM-DD HH:MM UTC
```

---

### 8.8.2 Zero-Downtime Migration Patterns

**Pattern 1: Additive Changes (No Downtime)**

```sql
-- Example: Adding a new column with default value

-- Step 1: Add column (nullable first)
ALTER TABLE cars ADD COLUMN warranty_months INTEGER;

-- Step 2: Backfill data (in batches)
DO $$
DECLARE
  batch_size INTEGER := 1000;
  offset_val INTEGER := 0;
BEGIN
  LOOP
    UPDATE cars
    SET warranty_months = 12
    WHERE id IN (
      SELECT id FROM cars
      WHERE warranty_months IS NULL
      LIMIT batch_size
      OFFSET offset_val
    );

    EXIT WHEN NOT FOUND;
    offset_val := offset_val + batch_size;

    -- Pause between batches to avoid locking
    PERFORM pg_sleep(0.1);
  END LOOP;
END $$;

-- Step 3: Add NOT NULL constraint
ALTER TABLE cars ALTER COLUMN warranty_months SET NOT NULL;

-- Step 4: Add default value
ALTER TABLE cars ALTER COLUMN warranty_months SET DEFAULT 12;
```

**Pattern 2: Column Rename (Expand-Contract Pattern)**

```sql
-- Phase 1: EXPAND - Add new column
ALTER TABLE cars ADD COLUMN model_name VARCHAR(100);

-- Dual-write: Update application to write to both columns
-- (Deploy application code that writes to both old and new columns)

-- Backfill data
UPDATE cars SET model_name = model WHERE model_name IS NULL;

-- Phase 2: Read from new column
-- (Deploy application code that reads from new column)

-- Phase 3: CONTRACT - Remove old column
ALTER TABLE cars DROP COLUMN model;
```

**Pattern 3: Table Split (Large Refactor)**

```sql
-- Goal: Split cars.images (JSON) into separate images table

-- Step 1: Create new table
CREATE TABLE car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Migrate data
INSERT INTO car_images (car_id, url, position)
SELECT
  c.id,
  jsonb_array_elements_text(c.images) AS url,
  ROW_NUMBER() OVER (PARTITION BY c.id) AS position
FROM cars c
WHERE c.images IS NOT NULL;

-- Step 3: Deploy app code to read from new table (dual-read)

-- Step 4: Verify data consistency
SELECT COUNT(*) FROM cars WHERE images IS NOT NULL;
SELECT COUNT(DISTINCT car_id) FROM car_images;
-- (Counts should match)

-- Step 5: Deploy app code to write only to new table

-- Step 6: Drop old column
ALTER TABLE cars DROP COLUMN images;
```

---

### 8.8.3 Emergency Rollback Procedures

**Automatic Rollback Script:**

```bash
#!/bin/bash
# infrastructure/scripts/rollback.sh

set -e  # Exit on error

# Configuration
ENVIRONMENT=$1  # production | staging
MIGRATION_VERSION=$2  # e.g., 20250110123456

if [ -z "$ENVIRONMENT" ] || [ -z "$MIGRATION_VERSION" ]; then
  echo "Usage: ./rollback.sh <environment> <migration_version>"
  echo "Example: ./rollback.sh production 20250110123456"
  exit 1
fi

# Set project ref based on environment
if [ "$ENVIRONMENT" = "production" ]; then
  PROJECT_REF="${PROD_PROJECT_REF}"
elif [ "$ENVIRONMENT" = "staging" ]; then
  PROJECT_REF="${STAGING_PROJECT_REF}"
else
  echo "Invalid environment. Use 'production' or 'staging'"
  exit 1
fi

echo "🚨 ROLLBACK INITIATED"
echo "Environment: $ENVIRONMENT"
echo "Migration: $MIGRATION_VERSION"
echo ""

# Confirmation
read -p "Are you sure you want to rollback? (type 'yes' to confirm): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Rollback cancelled"
  exit 0
fi

# 1. Create backup before rollback
echo "📦 Creating pre-rollback backup..."
BACKUP_FILE="rollback_backup_$(date +%Y%m%d_%H%M%S).sql"
supabase db dump --project-ref $PROJECT_REF > $BACKUP_FILE
gzip $BACKUP_FILE
echo "✅ Backup created: ${BACKUP_FILE}.gz"

# 2. Check if rollback script exists
ROLLBACK_SCRIPT="supabase/migrations/${MIGRATION_VERSION}_rollback.sql"
if [ ! -f "$ROLLBACK_SCRIPT" ]; then
  echo "❌ Rollback script not found: $ROLLBACK_SCRIPT"
  echo "Manual rollback required"
  exit 1
fi

# 3. Apply rollback
echo "⏮️  Applying rollback script..."
supabase db execute --project-ref $PROJECT_REF < $ROLLBACK_SCRIPT

# 4. Verify database integrity
echo "🔍 Verifying database integrity..."
supabase db lint --project-ref $PROJECT_REF

# 5. Run health checks
echo "🏥 Running health checks..."
curl -f https://skautosphere.com/api/health || {
  echo "❌ Health check failed!"
  exit 1
}

# 6. Notify team
echo "📢 Notifying team..."
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d "{
    \"text\": \"🚨 Database Rollback Completed\",
    \"attachments\": [{
      \"color\": \"warning\",
      \"fields\": [
        {\"title\": \"Environment\", \"value\": \"$ENVIRONMENT\", \"short\": true},
        {\"title\": \"Migration\", \"value\": \"$MIGRATION_VERSION\", \"short\": true},
        {\"title\": \"Executed By\", \"value\": \"$USER\", \"short\": true},
        {\"title\": \"Timestamp\", \"value\": \"$(date -u)\", \"short\": true}
      ]
    }]
  }"

echo ""
echo "✅ Rollback completed successfully"
echo "📦 Backup saved: ${BACKUP_FILE}.gz"
echo "📊 Check monitoring dashboards for any issues"
```

**Rollback Decision Matrix:**

| Severity | Impact | Action | Timeline |
|----------|--------|--------|----------|
| **P0 - Critical** | Site down, data loss | Immediate automated rollback | <5 minutes |
| **P1 - High** | Feature broken, no workaround | Manual rollback after investigation | <30 minutes |
| **P2 - Medium** | Feature degraded, workaround exists | Fix forward or scheduled rollback | <2 hours |
| **P3 - Low** | Minor issue, user impact minimal | Fix forward in next release | <24 hours |

---

## 8.9 Deployment Workflows

### 8.9.1 Feature Branch Workflow

```
Developer Workflow:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. Create Feature Branch                              │
│     git checkout -b feature/car-favorites              │
│                                                         │
│  2. Develop Locally                                    │
│     • Write code                                       │
│     • Write tests                                      │
│     • Test manually                                    │
│                                                         │
│  3. Commit Changes                                     │
│     git add .                                          │
│     git commit -m "feat(cars): add favorites"          │
│                                                         │
│  4. Push to Remote                                     │
│     git push origin feature/car-favorites              │
│                                                         │
│  5. Create Pull Request                                │
│     • CI/CD runs automatically                         │
│     • Preview deployment created                       │
│     • Code review assigned                             │
│                                                         │
│  6. Address Review Feedback                            │
│     • Make requested changes                           │
│     • Push updates                                     │
│     • CI/CD re-runs                                    │
│                                                         │
│  7. Merge to Main                                      │
│     • Squash and merge                                 │
│     • Production deployment triggered                  │
│     • Preview deployment cleaned up                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 8.9.2 Hotfix Workflow

```bash
# Emergency production fix workflow

# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/payment-error

# 2. Make minimal fix
# (Edit only necessary files)

# 3. Test locally
npm run test
npm run build

# 4. Fast-track commit
git add .
git commit -m "fix(payments): resolve Stripe webhook timeout"

# 5. Push and create PR
git push origin hotfix/payment-error
gh pr create --title "HOTFIX: Payment webhook timeout" \
  --body "Critical fix for production payment errors" \
  --label "hotfix,priority:critical"

# 6. Get expedited review
# (CTO or Tech Lead approval required)

# 7. Merge and deploy
gh pr merge --squash --auto

# 8. Verify in production
curl -f https://skautosphere.com/api/health
npm run test:smoke -- --env production

# 9. Post-mortem
# (Document incident and root cause)
```

**Hotfix Criteria:**

- Production is down or severely degraded
- Security vulnerability discovered
- Data integrity at risk
- Payment processing failing

**Hotfix SLA:**
- Detection → Fix deployed: <2 hours
- Customer impact: Minimize to <30 minutes

---

### 8.9.3 Release Tagging Strategy

```bash
# Semantic Versioning: MAJOR.MINOR.PATCH

# Patch Release (bug fixes)
git tag -a v1.2.3 -m "Fix: Payment webhook timeout"
git push origin v1.2.3

# Minor Release (new features, backwards-compatible)
git tag -a v1.3.0 -m "Feature: Car favorites and saved searches"
git push origin v1.3.0

# Major Release (breaking changes)
git tag -a v2.0.0 -m "Major: New API v2 with breaking changes"
git push origin v2.0.0

# View all tags
git tag --sort=-v:refname

# Checkout specific version
git checkout v1.2.3

# Create GitHub release
gh release create v1.3.0 \
  --title "SK AutoSphere v1.3.0" \
  --notes-file CHANGELOG.md \
  --latest
```

---

## 8.10 Monitoring & Observability

### 8.10.1 Monitoring Stack

**Architecture:**

```
                    ┌─────────────────┐
                    │   End Users     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Next.js App    │
                    │  (Instrumented) │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │    Sentry    │ │  Vercel     │ │   Custom    │
    │  (Errors)    │ │ (Analytics) │ │   Logs      │
    └───────┬──────┘ └──────┬──────┘ └──────┬──────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Dashboards    │
                    │  (Grafana/DD)   │
                    └─────────────────┘
```

---

### 8.10.2 Sentry Configuration

**sentry.client.config.ts:**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NODE_ENV,

  // Adjust sample rate for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay for debugging
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Ignore common errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    /Loading chunk \d+ failed/,
  ],

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Remove sensitive query parameters
    if (event.request?.url) {
      event.request.url = event.request.url.replace(
        /([?&])(token|key|password)=[^&]*/gi,
        '$1$2=REDACTED'
      );
    }

    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
      delete event.request.headers['Cookie'];
    }

    return event;
  },

  // Tag events with additional context
  initialScope: {
    tags: {
      'app.version': process.env.NEXT_PUBLIC_APP_VERSION,
      'deployment.env': process.env.VERCEL_ENV,
    },
  },

  // Performance monitoring
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: [
        'localhost',
        'skautosphere.com',
        /^\//,  // Relative URLs
      ],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**sentry.server.config.ts:**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,

  // Server-specific integrations
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Postgres(),
  ],

  beforeSend(event) {
    // Server-side filtering
    if (event.exception?.values?.[0]?.type === 'PostgresError') {
      // Remove sensitive DB connection info
      event.exception.values[0].value = event.exception.values[0].value.replace(
        /postgres:\/\/[^@]+@/,
        'postgres://REDACTED@'
      );
    }

    return event;
  },
});
```

---

### 8.10.3 Application Performance Monitoring (APM)

**Custom Performance Metrics:**

```typescript
// lib/monitoring/performance.ts

import { performance } from 'perf_hooks';
import * as Sentry from '@sentry/nextjs';

export class PerformanceMonitor {
  /**
   * Track database query performance
   */
  static async trackQuery<T>(
    name: string,
    query: () => Promise<T>
  ): Promise<T> {
    const transaction = Sentry.startTransaction({
      op: 'db.query',
      name,
    });

    const start = performance.now();

    try {
      const result = await query();
      const duration = performance.now() - start;

      transaction.setTag('duration_ms', duration.toFixed(2));
      transaction.setStatus('ok');

      // Warn if query is slow
      if (duration > 1000) {
        console.warn(`Slow query detected: ${name} (${duration}ms)`);
        Sentry.captureMessage(`Slow query: ${name}`, {
          level: 'warning',
          extra: { duration, name },
        });
      }

      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      throw error;
    } finally {
      transaction.finish();
    }
  }

  /**
   * Track API endpoint performance
   */
  static async trackAPI<T>(
    endpoint: string,
    handler: () => Promise<T>
  ): Promise<T> {
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: endpoint,
    });

    const start = performance.now();

    try {
      const result = await handler();
      const duration = performance.now() - start;

      transaction.setTag('duration_ms', duration.toFixed(2));
      transaction.setStatus('ok');

      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      Sentry.captureException(error, {
        tags: { endpoint },
      });
      throw error;
    } finally {
      transaction.finish();
    }
  }

  /**
   * Track component render performance
   */
  static measureRender(componentName: string, callback: () => void) {
    const start = performance.now();
    callback();
    const duration = performance.now() - start;

    if (duration > 100) {
      console.warn(`Slow render: ${componentName} (${duration}ms)`);
    }
  }
}

// Usage:
// const cars = await PerformanceMonitor.trackQuery(
//   'getCars',
//   () => supabase.from('cars').select('*')
// );
```

---

### 8.10.4 Health Check Endpoints

**app/api/health/route.ts:**

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: 'ok' | 'error';
    storage: 'ok' | 'error';
    ai: 'ok' | 'error';
  };
  version: string;
  uptime: number;
}

export async function GET() {
  const startTime = performance.now();
  const checks: HealthCheckResult['checks'] = {
    database: 'error',
    storage: 'error',
    ai: 'error',
  };

  // Check 1: Database connectivity
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('cars')
      .select('id')
      .limit(1)
      .single();

    checks.database = error ? 'error' : 'ok';
  } catch (e) {
    checks.database = 'error';
  }

  // Check 2: Storage connectivity
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.storage
      .from('cars')
      .list('', { limit: 1 });

    checks.storage = error ? 'error' : 'ok';
  } catch (e) {
    checks.storage = 'error';
  }

  // Check 3: AI service
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models',
      {
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY!,
        },
      }
    );

    checks.ai = response.ok ? 'ok' : 'error';
  } catch (e) {
    checks.ai = 'error';
  }

  // Determine overall status
  const allOk = Object.values(checks).every((v) => v === 'ok');
  const someOk = Object.values(checks).some((v) => v === 'ok');

  const status: HealthCheckResult['status'] = allOk
    ? 'healthy'
    : someOk
    ? 'degraded'
    : 'unhealthy';

  const result: HealthCheckResult = {
    status,
    timestamp: new Date().toISOString(),
    checks,
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    uptime: process.uptime(),
  };

  const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 500 : 503;

  return NextResponse.json(result, { status: statusCode });
}
```

**Uptime Monitoring Setup:**

```bash
# Configure UptimeRobot or Pingdom

Endpoint: https://skautosphere.com/api/health
Method: GET
Interval: 5 minutes
Timeout: 10 seconds
Expected Status: 200
Expected Content: "healthy"

Alerts:
- Email: devops@skautosphere.com
- Slack: #alerts channel
- SMS: On-call engineer (production only)

Escalation:
1. Alert after 2 failed checks (10 minutes)
2. Escalate to CTO after 4 failed checks (20 minutes)
3. Page on-call after 6 failed checks (30 minutes)
```

---

### 8.10.5 Logging Strategy

**Structured Logging:**

```typescript
// lib/logger.ts

import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    env: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  },
  redact: {
    paths: [
      'password',
      'token',
      'apiKey',
      'authorization',
      '*.password',
      '*.token',
    ],
    remove: true,
  },
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

export default logger;

// Usage:
// logger.info({ userId: '123', action: 'login' }, 'User logged in');
// logger.error({ error: e, userId: '123' }, 'Login failed');
```

**Log Levels:**

| Level | When to Use | Example |
|-------|-------------|---------|
| **error** | Application errors, exceptions | Failed API calls, DB errors |
| **warn** | Degraded performance, recoverable errors | Slow queries, retry attempts |
| **info** | Important business events | User registration, purchases |
| **debug** | Detailed diagnostic info | Function entry/exit, variable states |
| **trace** | Very verbose, request/response bodies | Full HTTP payloads |

---

## 8.11 Backup & Disaster Recovery

### 8.11.1 Backup Architecture

**3-2-1 Backup Rule:**

- **3** copies of data
- **2** different storage types
- **1** offsite copy

**Implementation:**

```
Primary Data (Supabase Production)
├── Copy 1: Supabase Point-in-Time Recovery (7 days)
├── Copy 2: Daily automated backups → AWS S3 (30 days)
└── Copy 3: Weekly archives → AWS S3 Glacier (1 year)
```

---

### 8.11.2 Disaster Recovery Procedures

**Recovery Time Objective (RTO) & Recovery Point Objective (RPO):**

| Disaster Scenario | RTO | RPO | Recovery Method |
|-------------------|-----|-----|-----------------|
| **Database corruption** | 1 hour | 24 hours | Restore from daily backup |
| **Accidental data deletion** | 30 minutes | 5 minutes | Point-in-time recovery |
| **Full region outage** | 4 hours | 24 hours | Failover to backup region |
| **Ransomware attack** | 8 hours | 24 hours | Restore from isolated backup |
| **Code deployment failure** | 5 minutes | 0 | Automated rollback |

**Disaster Recovery Runbook:**

```markdown
## Database Disaster Recovery

### Scenario: Production database corrupted

**Step 1: Assess Damage (5 minutes)**
- [ ] Verify database is actually corrupted (run health checks)
- [ ] Identify time of corruption
- [ ] Estimate data loss window
- [ ] Notify team via Slack #incidents

**Step 2: Stop Application (2 minutes)**
- [ ] Enable maintenance mode
  ```bash
  netlify env:set MAINTENANCE_MODE=true --context production
  netlify deploy --prod
  ```
- [ ] Update status page: "We're experiencing technical difficulties"

**Step 3: Identify Recovery Point (3 minutes)**
- [ ] Review Supabase backup list
  ```bash
  supabase db backups list --project-ref teyloksuvmmhqixjqoch
  ```
- [ ] Select most recent uncorrupted backup
- [ ] Document backup ID and timestamp

**Step 4: Restore Database (30-60 minutes)**
- [ ] Create new Supabase project (recovery instance)
  ```bash
  supabase projects create sk-autosphere-recovery
  ```
- [ ] Restore backup to recovery instance
  ```bash
  supabase db restore <backup-id> \
    --project-ref <recovery-project-ref>
  ```
- [ ] Verify data integrity
  ```bash
  supabase db lint --project-ref <recovery-project-ref>
  ```

**Step 5: Switch to Recovery Database (10 minutes)**
- [ ] Update environment variables
  ```bash
  netlify env:set NEXT_PUBLIC_SUPABASE_URL=<recovery-url>
  netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY=<recovery-key>
  ```
- [ ] Deploy application
  ```bash
  netlify deploy --prod
  ```
- [ ] Run smoke tests
  ```bash
  npm run test:smoke -- --env production
  ```

**Step 6: Verify Recovery (10 minutes)**
- [ ] Test critical user flows
  - [ ] User login
  - [ ] Car listing creation
  - [ ] Messaging
  - [ ] Payment processing
- [ ] Monitor error rates in Sentry
- [ ] Check database performance metrics

**Step 7: Post-Recovery (30 minutes)**
- [ ] Disable maintenance mode
- [ ] Update status page: "All systems operational"
- [ ] Notify team recovery is complete
- [ ] Schedule post-mortem meeting (within 24 hours)
- [ ] Document lessons learned
- [ ] Update recovery procedures based on findings

**Total Estimated RTO: ~1 hour**
```

---

## 8.12 Scaling Strategy

### 8.12.1 Current Capacity & Growth Projections

**Current Usage (Launch):**

| Metric | Current | 6 Months | 12 Months |
|--------|---------|----------|-----------|
| **Daily Active Users** | 500 | 5,000 | 20,000 |
| **Car Listings** | 1,000 | 10,000 | 50,000 |
| **API Requests/Day** | 10K | 100K | 500K |
| **Database Size** | 500 MB | 5 GB | 25 GB |
| **Storage (Images)** | 10 GB | 100 GB | 500 GB |
| **Monthly Cost** | $200 | $500 | $1,500 |

**Scaling Thresholds:**

```
┌─────────────────────────────────────────────────┐
│ Traffic Level    │ Action Required            │
├──────────────────┼────────────────────────────┤
│ 10K req/day      │ Current setup (✓)          │
│ 100K req/day     │ Enable CDN caching         │
│ 500K req/day     │ Scale Supabase tier        │
│ 1M req/day       │ Add read replicas          │
│ 5M req/day       │ Implement Redis cache      │
│ 10M+ req/day     │ Multi-region deployment    │
└─────────────────────────────────────────────────┘
```

---

### 8.12.2 Horizontal Scaling (Application Layer)

**Netlify/Vercel Auto-Scaling:**

- **Serverless functions** scale automatically (0 to millions)
- **Edge network** handles static assets globally
- **No manual intervention** required for traffic spikes

**Configuration:**

```toml
# netlify.toml

[functions]
  # Maximum concurrent executions
  concurrency = 50

  # Function timeout
  timeout = 10

  # Memory allocation
  memory = 1024

  # Retry configuration
  retry_count = 2
  retry_delay = 500

[build.environment]
  # Optimize for production
  NODE_OPTIONS = "--max_old_space_size=4096"
```

---

### 8.12.3 Vertical Scaling (Database Layer)

**Supabase Scaling Tiers:**

| Tier | CPU | RAM | Storage | Connections | Monthly Cost |
|------|-----|-----|---------|-------------|--------------|
| **Free** | Shared | 500 MB | 500 MB | 60 | $0 |
| **Pro** | Shared | 8 GB | 8 GB | 200 | $25 |
| **Team** | 2 CPU | 16 GB | 50 GB | 400 | $599 |
| **Enterprise** | Custom | Custom | Custom | Custom | Custom |

**Current: Pro Tier**
**Next Threshold: 50K daily users → Team Tier**

**Upgrade Procedure:**

```bash
# 1. Upgrade via Supabase Dashboard
# Settings > Billing > Upgrade to Team

# 2. Verify new limits
supabase projects list --org sk-autosphere

# 3. Update connection pooling
# supabase/config.toml
[db]
  pool_size = 400  # Increased from 200

# 4. Test connection limits
npm run test:load -- --connections 300

# 5. Monitor performance
# Check Supabase dashboard for query performance
```

---

### 8.12.4 Caching Strategy

**Multi-Layer Caching:**

```
Browser Cache (1 day)
      ↓
CDN Cache (Netlify Edge, 1 hour)
      ↓
API Response Cache (Redis, 5 minutes)
      ↓
Database Query Cache (Supabase, 1 minute)
      ↓
Database
```

**Implementation:**

```typescript
// lib/cache/redis.ts

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5 minutes default
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get<T>(key);

  if (cached) {
    console.log(`Cache HIT: ${key}`);
    return cached;
  }

  // Cache miss, fetch data
  console.log(`Cache MISS: ${key}`);
  const data = await fetcher();

  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Usage:
// const cars = await getCached(
//   'cars:featured',
//   () => supabase.from('cars').select('*').limit(10),
//   600 // Cache for 10 minutes
// );
```

**Cache Invalidation:**

```typescript
// lib/cache/invalidate.ts

export async function invalidateCarCache(carId: string) {
  const keys = [
    `car:${carId}`,
    `cars:featured`,
    `cars:seller:${sellerId}`,
    `cars:search:*`, // Wildcard invalidation
  ];

  await Promise.all(keys.map((key) => redis.del(key)));

  console.log(`Invalidated cache for car: ${carId}`);
}

// Call after car update:
// await updateCar(carId, data);
// await invalidateCarCache(carId);
```

---

## 8.13 CDN & Asset Optimization

### 8.13.1 Image Optimization Strategy

**Next.js Image Component:**

```typescript
import Image from 'next/image';

// Optimized car image
<Image
  src={car.imageUrl}
  alt={car.title}
  width={800}
  height={600}
  quality={85}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={car.thumbnailDataUrl}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>
```

**Supabase Image Transformation:**

```typescript
// Generate optimized image URL
function getOptimizedImageUrl(
  path: string,
  options: { width?: number; height?: number; quality?: number } = {}
) {
  const { width = 800, height = 600, quality = 85 } = options;

  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cars`;

  return `${baseUrl}/${path}?width=${width}&height=${height}&quality=${quality}&format=webp`;
}

// Usage:
// <img src={getOptimizedImageUrl(car.image, { width: 400, quality: 80 })} />
```

**Image Upload Optimization:**

```typescript
// app/api/upload/route.ts

import sharp from 'sharp';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  // Convert to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Generate multiple sizes
  const sizes = [
    { name: 'thumbnail', width: 200, height: 150 },
    { name: 'medium', width: 800, height: 600 },
    { name: 'large', width: 1600, height: 1200 },
  ];

  const uploads = await Promise.all(
    sizes.map(async ({ name, width, height }) => {
      // Optimize image
      const optimized = await sharp(buffer)
        .resize(width, height, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 85 })
        .toBuffer();

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('cars')
        .upload(`${carId}/${name}.webp`, optimized, {
          contentType: 'image/webp',
          cacheControl: '31536000', // 1 year
        });

      return data;
    })
  );

  return NextResponse.json({ uploads });
}
```

---

### 8.13.2 Static Asset Caching

**Cache-Control Headers:**

```toml
# netlify.toml

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=604800, must-revalidate"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.webp"
  [headers.values]
    Cache-Control = "public, max-age=604800"
    Vary = "Accept-Encoding"
```

---

### 8.13.3 Bundle Optimization

**next.config.js:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // UI library chunk
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](radix-ui|@radix-ui)[\\/]/,
            chunks: 'all',
            priority: 30,
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Compress with gzip
  compress: true,

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    domains: ['teyloksuvmmhqixjqoch.supabase.co'],
  },

  // Production optimizations
  swcMinify: true,
  reactStrictMode: true,

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
};

module.exports = nextConfig;
```

---

## 8.14 Domain & DNS Configuration

### 8.14.1 DNS Records

**Cloudflare DNS Setup:**

```dns
# Root domain
skautosphere.com      A     75.2.60.5         (Netlify)
skautosphere.com      AAAA  2600:1f18:...     (Netlify IPv6)

# WWW redirect
www.skautosphere.com  CNAME skautosphere.com

# Staging
staging.skautosphere.com  CNAME  staging--skautosphere.netlify.app

# API subdomain (optional)
api.skautosphere.com  CNAME  skautosphere.com

# Email (Google Workspace)
skautosphere.com      MX    1  smtp.google.com
skautosphere.com      TXT   "v=spf1 include:_spf.google.com ~all"
_dmarc.skautosphere.com TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@skautosphere.com"

# Verification
skautosphere.com      TXT   "google-site-verification=..."
```

**Cloudflare Settings:**

- **SSL/TLS Mode:** Full (strict)
- **Always Use HTTPS:** On
- **Automatic HTTPS Rewrites:** On
- **Minimum TLS Version:** 1.2
- **Opportunistic Encryption:** On
- **TLS 1.3:** On
- **HTTP/2:** On
- **HTTP/3 (QUIC):** On
- **Brotli Compression:** On

---

## 8.15 SSL/TLS & Security Hardening

### 8.15.1 SSL Certificate Management

**Netlify Automatic SSL:**

- Free SSL certificates via Let's Encrypt
- Automatic renewal every 90 days
- Supports custom domains and wildcards

**Verification:**

```bash
# Check SSL certificate
openssl s_client -connect skautosphere.com:443 -servername skautosphere.com

# Check expiration date
echo | openssl s_client -connect skautosphere.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# Test SSL configuration
curl -I https://skautosphere.com
```

---

### 8.15.2 Security Headers

**Comprehensive Security Headers:**

```toml
# netlify.toml

[[headers]]
  for = "/*"
  [headers.values]
    # Prevent clickjacking
    X-Frame-Options = "DENY"

    # Prevent MIME type sniffing
    X-Content-Type-Options = "nosniff"

    # Enable XSS protection
    X-XSS-Protection = "1; mode=block"

    # Referrer policy
    Referrer-Policy = "strict-origin-when-cross-origin"

    # Permissions policy
    Permissions-Policy = """
      camera=(),
      microphone=(),
      geolocation=(self),
      payment=(self "https://checkout.stripe.com")
    """

    # Content Security Policy
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://*.supabase.co https://api.stripe.com;
      frame-src https://checkout.stripe.com;
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    """

    # HSTS (HTTP Strict Transport Security)
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
```

**Test Security Headers:**

```bash
# Use securityheaders.com
curl https://securityheaders.com/?q=https://skautosphere.com

# Or use Mozilla Observatory
curl https://observatory.mozilla.org/analyze/skautosphere.com
```

---

## 8.16 Performance Optimization

### 8.16.1 Core Web Vitals Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **LCP** (Largest Contentful Paint) | <2.5s | 1.8s | ✅ Good |
| **FID** (First Input Delay) | <100ms | 45ms | ✅ Good |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.05 | ✅ Good |
| **TTFB** (Time to First Byte) | <600ms | 320ms | ✅ Good |
| **FCP** (First Contentful Paint) | <1.8s | 1.2s | ✅ Good |

**Monitoring:**

```typescript
// pages/_app.tsx

import { useReportWebVitals } from 'next/web-vitals';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to analytics
  if (process.env.NODE_ENV === 'production') {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      label: metric.label,
      id: metric.id,
    });

    // Send to Vercel Analytics
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    // Also send to Sentry
    if (metric.value > THRESHOLD) {
      Sentry.captureMessage(`Poor Web Vital: ${metric.name}`, {
        level: 'warning',
        extra: { metric },
      });
    }
  }
}
```

---

### 8.16.2 Performance Budget

**Maximum Allowed Sizes:**

| Resource Type | Budget | Current | Status |
|---------------|--------|---------|--------|
| **Initial JS** | 200 KB | 145 KB | ✅ |
| **Initial CSS** | 50 KB | 32 KB | ✅ |
| **Total Page Weight** | 1.5 MB | 980 KB | ✅ |
| **Third-Party Scripts** | 100 KB | 78 KB | ✅ |
| **Images (per page)** | 500 KB | 320 KB | ✅ |

**Enforcement via Webpack:**

```javascript
// next.config.js

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.performance = {
        maxAssetSize: 512000,      // 500 KB
        maxEntrypointSize: 512000, // 500 KB
        hints: 'error',            // Fail build if exceeded
      };
    }
    return config;
  },
};
```

---

## 8.17 Incident Response & Rollback

### 8.17.1 Incident Severity Classification

| Severity | Description | Response Time | Example |
|----------|-------------|---------------|---------|
| **P0 - Critical** | Complete service outage | Immediate (<5 min) | Site down, database offline |
| **P1 - High** | Major feature broken | <30 minutes | Payments failing, login broken |
| **P2 - Medium** | Feature degraded | <2 hours | Slow page load, minor UI bug |
| **P3 - Low** | Minor issue | <24 hours | Typo, cosmetic issue |

---

### 8.17.2 Incident Response Process

**Incident Response Playbook:**

```markdown
## P0 Incident Response

**Step 1: Detection & Alert (0-2 minutes)**
- [ ] Alert received (monitoring, user report, team member)
- [ ] Verify incident is real (check health endpoints)
- [ ] Create #incident-YYYYMMDD Slack channel
- [ ] Post initial message: "P0 incident detected: [brief description]"

**Step 2: Assemble Response Team (2-5 minutes)**
- [ ] Notify on-call engineer via PagerDuty
- [ ] Ping @devops-team in Slack
- [ ] Assign Incident Commander (IC)
- [ ] Assign Communications Lead

**Step 3: Immediate Mitigation (5-15 minutes)**
- [ ] Enable maintenance mode if site is broken
  ```bash
  netlify env:set MAINTENANCE_MODE=true
  netlify deploy --prod
  ```
- [ ] Update status page: "Investigating service disruption"
- [ ] Identify root cause (check recent deployments, logs, metrics)

**Step 4: Implement Fix (15-60 minutes)**

Option A: Rollback (if recent deployment caused issue)
```bash
# Rollback to previous deployment
netlify rollback --prod

# Or rollback via Git
git revert HEAD
git push origin main
```

Option B: Hotfix (if configuration or data issue)
```bash
# Quick fix and deploy
git checkout -b hotfix/incident-fix
# Make minimal fix
git commit -m "fix: resolve P0 incident"
git push && gh pr create --title "HOTFIX: P0 incident"
# Get approval and merge
```

Option C: Database Rollback
```bash
# See section 8.8.3 for full procedure
./infrastructure/scripts/rollback.sh production <migration>
```

**Step 5: Verification (60-75 minutes)**
- [ ] Run smoke tests
  ```bash
  npm run test:smoke -- --env production
  ```
- [ ] Manually test affected feature
- [ ] Check error rates in Sentry (should drop to baseline)
- [ ] Verify metrics in monitoring dashboard

**Step 6: Resolution & Communication (75-90 minutes)**
- [ ] Disable maintenance mode
- [ ] Update status page: "Issue resolved"
- [ ] Post resolution message in Slack
- [ ] Email affected customers (if applicable)
- [ ] Update incident timeline

**Step 7: Post-Mortem (Within 48 hours)**
- [ ] Schedule post-mortem meeting
- [ ] Document timeline of events
- [ ] Identify root cause
- [ ] List contributing factors
- [ ] Create action items to prevent recurrence
- [ ] Update runbooks with lessons learned

**SLA: P0 incidents resolved within 1 hour**
```

---

### 8.17.3 Automated Rollback Triggers

**GitHub Actions Auto-Rollback:**

```yaml
# .github/workflows/auto-rollback.yml

name: Auto Rollback on Errors

on:
  deployment_status

jobs:
  monitor-deployment:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest

    steps:
      - name: Wait for deployment to stabilize
        run: sleep 300  # 5 minutes

      - name: Check error rate
        id: check_errors
        run: |
          # Query Sentry API for error rate
          ERROR_RATE=$(curl -s "https://sentry.io/api/0/projects/sk-autosphere/web-app/stats/" \
            -H "Authorization: Bearer ${{ secrets.SENTRY_AUTH_TOKEN }}" \
            | jq '.[-1][1]')

          echo "Error rate: $ERROR_RATE"

          if (( $(echo "$ERROR_RATE > 100" | bc -l) )); then
            echo "High error rate detected!"
            echo "::set-output name=should_rollback::true"
          fi

      - name: Automatic rollback
        if: steps.check_errors.outputs.should_rollback == 'true'
        run: |
          # Trigger rollback
          netlify rollback --prod

          # Notify team
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
            -H 'Content-Type: application/json' \
            -d '{
              "text": "🚨 AUTOMATIC ROLLBACK TRIGGERED",
              "attachments": [{
                "color": "danger",
                "text": "High error rate detected after deployment. Rolled back automatically."
              }]
            }'
```

---

## 8.18 Release Management Process

### 8.18.1 Release Checklist

**Pre-Release (T-1 week):**

```markdown
## Release Preparation Checklist

**Code Freeze (Monday)**
- [ ] Feature branch merges complete
- [ ] All tests passing on main branch
- [ ] No known P0 or P1 bugs
- [ ] Release branch created: `release/v1.3.0`

**Testing (Tuesday-Thursday)**
- [ ] QA testing complete on staging
- [ ] Performance testing complete
- [ ] Security scan passed
- [ ] Accessibility audit complete
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile testing (iOS, Android)

**Documentation (Thursday)**
- [ ] CHANGELOG.md updated
- [ ] API documentation updated (if applicable)
- [ ] User-facing documentation updated
- [ ] Internal runbooks updated

**Communication (Friday)**
- [ ] Release notes drafted
- [ ] Customer support team briefed
- [ ] Marketing notified (if user-facing changes)
- [ ] Stakeholders informed

**Deployment Prep (Friday)**
- [ ] Database migrations tested on staging
- [ ] Rollback plan documented
- [ ] Feature flags configured (if applicable)
- [ ] Monitoring dashboards prepared
- [ ] On-call engineer assigned for deployment window
```

**Release Day Checklist:**

```markdown
## Production Deployment Checklist

**Pre-Deployment (30 minutes before)**
- [ ] Verify all pre-release checks complete
- [ ] Create database backup
  ```bash
  ./infrastructure/scripts/backup-database.sh
  ```
- [ ] Notify team in #releases channel
- [ ] Update status page: "Scheduled maintenance in 30 minutes"

**Deployment (15 minutes)**
- [ ] Run database migrations (if any)
  ```bash
  supabase db push --project-ref teyloksuvmmhqixjqoch
  ```
- [ ] Deploy application
  ```bash
  git checkout main
  git tag -a v1.3.0 -m "Release v1.3.0"
  git push origin v1.3.0
  # CI/CD deploys automatically
  ```
- [ ] Monitor deployment progress in GitHub Actions

**Post-Deployment (30 minutes)**
- [ ] Run smoke tests
  ```bash
  npm run test:smoke -- --env production
  ```
- [ ] Manually test critical paths
  - [ ] User registration and login
  - [ ] Car listing creation
  - [ ] Messaging system
  - [ ] Payment processing
- [ ] Monitor error rates in Sentry (should be <0.1%)
- [ ] Check Core Web Vitals (should be in "Good" range)
- [ ] Verify database performance (query time <100ms avg)

**Communication (15 minutes)**
- [ ] Update status page: "All systems operational"
- [ ] Post release announcement in Slack
- [ ] Create GitHub Release with changelog
  ```bash
  gh release create v1.3.0 \
    --title "SK AutoSphere v1.3.0" \
    --notes-file CHANGELOG.md
  ```
- [ ] Email customer support with release notes
- [ ] Update internal wiki with deployment details

**Total Release Window: ~90 minutes**
```

---

### 8.18.2 Feature Flag Strategy

**LaunchDarkly Integration (Future):**

```typescript
// lib/feature-flags.ts

import { LDClient, init } from 'launchdarkly-node-server-sdk';

const client = init(process.env.LAUNCHDARKLY_SDK_KEY!);

export async function isFeatureEnabled(
  featureKey: string,
  userId: string
): Promise<boolean> {
  await client.waitForInitialization();

  const user = {
    key: userId,
    custom: {
      environment: process.env.NODE_ENV,
    },
  };

  return await client.variation(featureKey, user, false);
}

// Usage:
// const showNewDashboard = await isFeatureEnabled('new-dashboard', user.id);
```

**Simple Environment-Based Feature Flags (Current):**

```typescript
// lib/feature-flags.ts

export const featureFlags = {
  enableAIChat: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true',
  enableShippingCalc: process.env.NEXT_PUBLIC_ENABLE_SHIPPING_CALC === 'true',
  enableSellerVerification: process.env.NEXT_PUBLIC_ENABLE_SELLER_VERIFICATION === 'true',
  maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
};

// Usage in component:
// import { featureFlags } from '@/lib/feature-flags';
//
// {featureFlags.enableAIChat && <AIChatWidget />}
```

---

## 8.19 Cost Optimization Strategies

### 8.19.1 Current Monthly Costs

**Projected Costs (Post-Launch):**

| Service | Tier | Monthly Cost | Notes |
|---------|------|--------------|-------|
| **Netlify** | Pro | $19/month | Hosting + CDN |
| **Supabase** | Pro | $25/month | Database + Auth + Storage |
| **Sentry** | Team | $26/month | Error tracking |
| **Vercel** (backup) | Free | $0 | Only for failover |
| **Upstash Redis** | Free | $0 | 10K requests/day |
| **Google Gemini** | Pay-as-you-go | ~$50/month | AI features |
| **Stripe** | Pay-as-you-go | 2.9% + $0.30/txn | Payment processing |
| **Domain** | - | $12/year | skautosphere.com |
| **Email** (Resend) | Free | $0 | <3K emails/month |
| **Total** | - | **~$140/month** | |

**Cost at Scale (10K DAU):**

| Service | Projected Cost | Cost Driver |
|---------|----------------|-------------|
| Netlify | $99/month | Bandwidth, build minutes |
| Supabase | $599/month (Team) | Database size, connections |
| Sentry | $80/month | Error volume |
| Gemini AI | $200/month | API requests |
| Redis | $20/month | Data transfer |
| **Total** | **~$1,000/month** | |

---

### 8.19.2 Cost Optimization Tactics

**1. Optimize Image Storage:**

```bash
# Compress images before upload
# Use sharp to reduce file size by 70%

# Current: 5MB per car (10 images × 500KB each)
# Optimized: 1.5MB per car (10 images × 150KB each)

# Savings: 70% reduction in storage costs
# Before: 10K cars = 50GB storage
# After: 10K cars = 15GB storage
```

**2. Implement Aggressive Caching:**

```typescript
// Cache frequently accessed data
// Example: Featured cars (viewed by 80% of users)

// Without caching: 10K DAU × 10 requests/day = 100K DB queries/day
// With caching: 100K / 100 (cache hit ratio) = 1K DB queries/day

// Savings: 99% reduction in database load
```

**3. Use Edge Functions Sparingly:**

```typescript
// Move expensive operations to Edge Functions only when necessary
// Use static generation for 90% of pages

// Example: Car listing pages
// Static: Generated at build time (free)
// SSR: Generated per request (costly)

// Savings: ~$50/month in compute costs
```

**4. Optimize Database Queries:**

```sql
-- Use database indexes for common queries
CREATE INDEX idx_cars_status_created ON cars(status, created_at DESC);

-- Use materialized views for expensive aggregations
CREATE MATERIALIZED VIEW seller_stats AS
SELECT
  seller_id,
  COUNT(*) as total_listings,
  AVG(price) as avg_price,
  SUM(views) as total_views
FROM cars
GROUP BY seller_id;

-- Refresh periodically (not on every request)
REFRESH MATERIALIZED VIEW seller_stats;

-- Savings: 95% reduction in query time for analytics
```

**5. Right-Size Infrastructure:**

```bash
# Monitor actual usage vs. provisioned capacity

# Database connections:
# Provisioned: 400 connections (Team tier)
# Actual usage: 150 connections average
# → Can stay on Pro tier (200 connections) for now

# Savings: $574/month by delaying upgrade
```

---

## 8.20 DevOps Best Practices

### 8.20.1 Infrastructure as Code (IaC) Principles

**Golden Rules:**

1. **Everything in Version Control**
   - All infrastructure configuration in Git
   - No manual changes in production
   - Use pull requests for infrastructure changes

2. **Immutable Infrastructure**
   - Never modify running instances
   - Always deploy new versions
   - Makes rollback simple and reliable

3. **Declarative Configuration**
   - Define desired state, not steps
   - Tools handle the "how"
   - Example: Terraform, Docker Compose

4. **Environment Parity**
   - Dev, staging, production should be identical
   - Only difference: environment variables
   - Prevents "works on my machine" issues

5. **Automated Testing**
   - Test infrastructure changes before deployment
   - Use tools like Terratest, Kitchen
   - Fail fast, fail early

---

### 8.20.2 Git Workflow Best Practices

**Branch Naming Convention:**

```bash
feature/<ticket-id>-<description>   # New features
fix/<ticket-id>-<description>       # Bug fixes
hotfix/<description>                # Emergency production fixes
chore/<description>                 # Maintenance tasks
docs/<description>                  # Documentation only
refactor/<description>              # Code refactoring
test/<description>                  # Test additions

# Examples:
feature/SKA-123-add-favorites
fix/SKA-456-payment-timeout
hotfix/database-connection-leak
chore/update-dependencies
```

**Commit Message Template:**

```bash
# .gitmessage

<type>(<scope>): <subject>

<body>

<footer>

# Type: feat, fix, docs, style, refactor, test, chore
# Scope: component/module affected (optional)
# Subject: imperative, lowercase, no period, max 50 chars
# Body: explain what and why (optional, max 72 chars per line)
# Footer: breaking changes, issue references (optional)

# Examples:
# feat(auth): add Google OAuth login
# fix(payments): resolve Stripe webhook timeout
# docs(readme): update deployment instructions
# BREAKING CHANGE: remove deprecated API endpoints
```

---

### 8.20.3 Deployment Checklist Template

```markdown
## Deployment Checklist Template

**Deployment Date:** YYYY-MM-DD HH:MM UTC
**Deployed By:** [Name]
**Release Version:** vX.Y.Z
**Deployment Type:** [Feature / Hotfix / Maintenance]

### Pre-Deployment
- [ ] All tests passing on CI/CD
- [ ] Code review approved (minimum 2 approvers)
- [ ] Database migrations tested on staging
- [ ] Rollback plan documented
- [ ] Team notified in #releases channel
- [ ] Database backup created (<1 hour old)
- [ ] Monitoring dashboards prepared
- [ ] On-call engineer assigned

### Deployment
- [ ] Database migrations applied (if any)
- [ ] Application deployed to production
- [ ] Deployment completed without errors
- [ ] Health checks passing

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Critical user flows tested manually
- [ ] Error rate normal (<0.1%)
- [ ] Performance metrics normal (Core Web Vitals)
- [ ] Database performance normal (query time <100ms)
- [ ] No alerts triggered in monitoring

### Communication
- [ ] Status page updated
- [ ] Team notified of successful deployment
- [ ] GitHub Release created
- [ ] CHANGELOG.md updated
- [ ] Customer support briefed (if user-facing changes)

### Post-Mortem (if issues occurred)
- [ ] Incident documented
- [ ] Root cause identified
- [ ] Action items created
- [ ] Runbooks updated

**Deployment Notes:**
[Any additional notes, issues encountered, or observations]
```

---

### 8.20.4 On-Call Engineer Runbook

**On-Call Rotation:**

- **Rotation:** Weekly (Monday 9 AM - Monday 9 AM)
- **Escalation:** After 30 minutes of no response
- **Backup:** CTO is secondary on-call

**On-Call Responsibilities:**

```markdown
## On-Call Engineer Duties

### During On-Call Week

**Daily (10 minutes)**
- [ ] Check monitoring dashboards
- [ ] Review overnight error logs
- [ ] Verify all health checks passing
- [ ] Clear any false-positive alerts

**Incident Response**
- [ ] Respond to PagerDuty alerts within 5 minutes
- [ ] Acknowledge incident in Slack #incidents
- [ ] Follow incident response playbook
- [ ] Escalate if needed (CTO, DevOps Lead)
- [ ] Document incident timeline

**Communication**
- [ ] Keep team updated in #incidents channel
- [ ] Update status page if customer-facing
- [ ] Write post-mortem within 48 hours

**Handoff (Friday)**
- [ ] Brief next on-call engineer
- [ ] Share any ongoing issues
- [ ] Document any incomplete tasks
```

**On-Call Toolkit:**

```bash
# Essential commands for on-call engineer

# 1. Check application health
curl -f https://skautosphere.com/api/health

# 2. View recent deployments
netlify deploys list --prod

# 3. View application logs
netlify logs --prod

# 4. Rollback deployment
netlify rollback --prod

# 5. Check database status
supabase status --project-ref teyloksuvmmhqixjqoch

# 6. View error logs (Sentry CLI)
sentry-cli events list --project web-app --last 1h

# 7. Check uptime
curl https://uptimerobot.com/api/v2/getMonitors

# 8. SSH into server (if applicable)
# Not applicable for Netlify/Vercel serverless

# 9. Restart services
# Not applicable for serverless

# 10. Check DNS resolution
dig skautosphere.com
```

---

## 📊 Summary & Implementation Roadmap

### Current Status

| Category | Status | Priority |
|----------|--------|----------|
| **Infrastructure Setup** | ✅ Complete | P0 |
| **CI/CD Pipeline** | ✅ Complete | P0 |
| **Monitoring** | 🔄 In Progress | P0 |
| **Backup Strategy** | ✅ Complete | P1 |
| **Scaling Plan** | ✅ Documented | P1 |
| **Security Hardening** | 🔄 In Progress | P0 |
| **Cost Optimization** | 📋 Planned | P2 |
| **Disaster Recovery** | ✅ Documented | P1 |

### Implementation Timeline

**Week 1-2: Foundation (P0) - ✅ COMPLETE**
- ✅ Set up Netlify hosting
- ✅ Configure Supabase production database
- ✅ Create GitHub Actions CI/CD pipeline
- ✅ Set up domain and SSL certificates
- ✅ Configure environment variables

**Week 3-4: Monitoring & Security (P0) - 🔄 IN PROGRESS**
- 🔄 Integrate Sentry error tracking
- 🔄 Set up health check endpoints
- 🔄 Configure uptime monitoring
- 🔄 Implement security headers
- 🔄 Set up automated database backups

**Week 5-6: Optimization (P1) - 📋 PLANNED**
- 📋 Implement Redis caching
- 📋 Optimize image delivery
- 📋 Set up performance monitoring
- 📋 Create automated rollback procedures
- 📋 Document incident response playbooks

**Week 7-8: Scale Preparation (P2) - 📋 PLANNED**
- 📋 Load testing
- 📋 Capacity planning
- 📋 Cost optimization review
- 📋 Disaster recovery drills
- 📋 Team training on runbooks

---

**Document Status:** ✅ Ready for Implementation
**Next Steps:** Begin monitoring setup and security hardening per DevOps Agent deployment strategy (Section 6)
**Owner:** DevOps/Deployment Engineer Agent

---

*This document is a living specification and will be updated as deployment strategies evolve and new requirements emerge.*
