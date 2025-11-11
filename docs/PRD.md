# SK AutoSphere – Product Requirements Document (PRD v3.0)
_Last Updated: 2025-11-08 05:43 UTC_  
**Project Owner:** Sam (Founder & CEO)  
**Development Stage:** Phase 2.5 – Architecture Alignment & AI Integration  
**Reference Agents:** Product Manager Agent → UX/UI Designer Agent → System Architect Agent

---

## 🧭 1. Executive Summary
**Vision:**  
Build the world’s leading multilingual marketplace connecting **Korean used-car exporters** with **African importers**, powered by **AI translation**, **real-time messaging**, and **total-cost transparency**.

**Mission:**  
Simplify cross-border vehicle trading through automation, trust, and mobile-first design — enabling verified Korean dealers to reach African buyers efficiently.

**Core Objectives:**  
- Reduce transaction friction via AI-generated multilingual content.  
- Provide instant total landed cost estimates.  
- Enable verified, secure dealer–buyer communication.  
- Build trust through KYC, reputation, and escrow integration (Phase 3).  

---

## 🧩 2. System Overview
SK AutoSphere is a **multi-platform ecosystem**:
- 🌐 **Next.js Web App** – listings, chat, admin dashboard.  
- 📱 **React Native Mobile App (Expo)** – optimized for African buyers.  
- ⚙️ **Supabase Backend** – PostgreSQL, Auth, Storage, Realtime.  
- 🤖 **Google Gemini AI** – translation, content generation, image tagging.  
- ☁️ **Netlify & GitHub Actions** – deployment, CI/CD, analytics, monitoring.

**Target Markets:** South Korea (sellers) → Africa (buyers: Nigeria, Kenya, Ghana, Senegal, Liberia, Guinea).  
**Languages:** English 🇬🇧, Korean 🇰🇷, French 🇫🇷, Swahili 🇰🇪.

---

## 🧠 3. Product Strategy Alignment

| Agent Phase | Responsibility | Output |
|--------------|----------------|---------|
| Phase 1 – Product Manager | Defines features, personas, KPIs | `/project-documentation/product-requirements.md` |
| Phase 2 – UX/UI Designer | Builds flows, layouts, tokens | `/project-documentation/ux-ui-spec.md` |
| **Phase 3 – System Architect** | Translates design + PRD → architecture | `/project-documentation/architecture-output.md` |
| Phase 4 – Backend Engineer | Implements APIs & DB |
| Phase 5 – Frontend Engineer | Implements client app |
| Phase 6 – DevOps & QA | Deploys, monitors, and tests |

---

## 👥 4. User Personas

### Persona A — Korean Car Dealer
**Name:** Park Min-ho  
**Goal:** Sell vehicles internationally with minimal friction.  
**Needs:**  
- AI-generated multilingual listings  
- Fast upload tools (photo compression, templates)  
- Verified buyer identity  
**Pain Points:** Manual translations, fraud risk, fragmented channels.

### Persona B — African Importer
**Name:** Adebayo Okonkwo  
**Goal:** Source reliable vehicles at transparent prices.  
**Needs:**  
- Accurate total cost (FOB + duty + shipping)  
- Chat with automatic translation  
- Seller verification & reviews  
**Pain Points:** Unclear costs, language barriers, distrust of new sellers.

---

## ⚙️ 5. Core Features (MVP Scope)

| # | Feature | Description | Priority |
|---|----------|--------------|-----------|
| 1 | **AI-Powered Listings** | Gemini-generated multilingual descriptions & image tagging. | P0 |
| 2 | **Realtime Messaging** | Buyer-seller chat with AI translation. | P0 |
| 3 | **Cost Calculator** | Dynamic total landed cost by port. | P1 |
| 4 | **Seller Verification** | KYC, documents, badges. | P1 |
| 5 | **Listings CRUD** | Web & mobile management with status workflow. | P0 |
| 6 | **Notifications** | Email + push for inquiries & sales. | P2 |
| 7 | **Fraud Reporting** | Moderation and admin review queue. | P2 |
| 8 | **Admin Dashboard** | Manage users, metrics, moderation. | P3 |

---

## 💬 6. User Stories & Acceptance Criteria

### Story 1 – AI Listing Creation
- **As a seller**, I can upload car details once and get localized listings (EN/FR/SW).  
✅ Gemini API generates and stores multilingual text.

### Story 2 – Buyer Inquiry Chat
- **As a buyer**, I can message sellers directly with translation.  
✅ Supabase Realtime; bilingual chat UI; translated + original text.

### Story 3 – Cost Estimation
- **As a buyer**, I can calculate landed cost to my country.  
✅ Uses cached rate tables (FOB, duty, shipping).

### Story 4 – Seller Verification
- **As a buyer**, I see badges for verified sellers.  
✅ Verified dealers show trust badges, higher search ranking.

---

## 🧱 7. Technical Architecture Summary
**Frontend:** Next.js 14 (App Router, RSC), Tailwind, shadcn/ui, React Query, multilingual routing.  
**Backend:** Supabase (Auth, Realtime, Storage, Edge Functions), REST API (OpenAPI 3.1), AI via Gemini.  
**Database:** PostgreSQL (RLS, foreign keys, JSONB).  
**Storage:** Supabase Storage (WebP ≤5MB).  
**CI/CD:** GitHub Actions → Netlify → EAS (mobile).  
**Monitoring:** Sentry, UptimeRobot, Supabase logs.

---

## 🔐 8. Security & Compliance
- JWT + RLS authentication model.  
- HTTPS (TLS 1.3) enforced end-to-end.  
- GDPR & Korean PIPA compliance.  
- AES-256 encryption for sensitive data.  
- Stripe escrow (PCI DSS compliant).  
- AI moderation + admin review for flagged content.

---

## 📊 9. Success Metrics

| Metric | Target |
|---------|---------|
| Page load (4G) | < 2s |
| Chat latency | < 500ms |
| Active listings | 500+ within 6 months |
| Registered users | 1,000+ |
| Verified sellers | ≥70% |
| AI translation accuracy | ≥90% |
| Buyer satisfaction | ≥4.5/5 |

---

## 📱 10. Mobile & PWA Strategy
- React Native (Expo) mobile app.  
- Offline queueing for chats and draft listings.  
- PWA install prompts for browsers.  
- Unified component library via shadcn/ui.

---

## 🌍 11. Localization (i18n)
- Supported languages: EN, KO, FR, SW.  
- JSON i18n files stored in `/locales/`.  
- RTL support ready for future markets.  
- Gemini auto-translation + human edit overrides.

---

## 🧰 12. Integrations
- Supabase (Auth, DB, Realtime, Storage)  
- Gemini AI (translation + image tagging)  
- Stripe (escrow/payment – Phase 3)  
- Shipping APIs (port cost data – Phase 3)

---

## 🧩 13. Non-Functional Requirements

| Category | Requirement |
|-----------|--------------|
| Performance | <2s load time on 4G |
| Scalability | 10k listings, 1k concurrent users |
| Security | JWT, HTTPS, RLS |
| Maintainability | Modular TypeScript + CI/CD |
| Localization | EN/KO/FR/SW |
| Availability | 99.5% uptime |
| Accessibility | WCAG AA compliance |

---

## 🧭 14. Roadmap

| Phase | Milestone | Deliverable |
|--------|------------|-------------|
| 1 | Product Planning | MVP PRD + UX Wireframes |
| 2 | Backend + Mobile MVP | Supabase setup + Messaging |
| 3 | Architecture & AI | System Architect Output + OpenAPI |
| 4 | Escrow & Payments | Stripe integration |
| 5 | Launch & Marketing | Africa beta launch |
| 6 | Scale | AI moderation, performance tuning |

---

## 👥 15. Stakeholders & Contacts
**Founder / PM:** Sam  
**Lead Engineer:** TBD  
**UX/UI Designer:** TBD  
**Partners:** Supabase, Google AI, Netlify, Stripe

---

## 🔁 16. Maintenance & Governance
- GitHub versioned PRDs and architecture.  
- Bi-weekly sprints, monthly roadmap reviews.  
- All outputs centralized in `/project-documentation/`.  
- Each phase validated by upstream agent alignment.

---

✅ **Next Steps:**  
Generate updated `ux-ui-spec.md` and `architecture-output.md` from this PRD for System Architect Agent handoff.
