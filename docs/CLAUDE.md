# SK AutoSphere - Project Context for AI Development

**Last Updated:** November 6, 2025  
**Project Type:** Korean-African Automotive Marketplace (Web + Mobile)  
**Tech Stack:** Next.js 14 + Supabase + React Native

---

## 🎯 Project Mission

Building an AI-powered digital marketplace connecting Korean car exporters with African buyers. This is a production application targeting real users and investors.

---

## 📁 Project Structure

```
sk-autosphere/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                  # Auth routes (login, signup)
│   ├── (dashboard)/             # Protected seller dashboard
│   ├── cars/                    # Public car listings
│   │   └── [id]/               # Individual car detail
│   ├── api/                     # API routes & server actions
│   │   ├── ai/                 # Gemini AI endpoints
│   │   └── webhooks/           # Third-party webhooks
│   └── layout.tsx              # Root layout with providers
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── car/                     # Car-specific components
│   ├── messaging/               # Chat system
│   └── layout/                  # Header, Footer, Nav
├── lib/
│   ├── supabase/               # Supabase client utilities
│   ├── ai/                     # Gemini integration
│   ├── utils/                  # Helper functions
│   └── validations/            # Zod schemas
├── hooks/                       # Custom React hooks
├── context/                     # React Context providers
├── locales/                     # i18n translations
├── public/                      # Static assets
├── supabase/
│   ├── migrations/             # Database migrations
│   └── functions/              # Edge Functions
└── docs/                        # PRD and documentation
    ├── PRD.md
    ├── 02-TECHNICAL-STACK.md
    ├── 03-FEATURES-CORE.md
    ├── 04-FEATURES-AI.md
    └── 05-DATABASE-SCHEMA.md
```

---

## 🛠️ Development Commands

### Essential Commands

```bash
# Development
npm run dev                # Start Next.js dev server (localhost:3000)
npm run build             # Production build
npm start                 # Start production server

# Database
npm run db:start          # Start local Supabase (Docker)
npm run db:migrate        # Apply migrations
npm run db:reset          # Reset local DB
npm run db:seed           # Seed with test data
npm run db:generate-types # Generate TypeScript types

# Code Quality
npm run lint              # ESLint check
npm run type-check        # TypeScript check
npm run format            # Prettier format

# Testing
npm run test              # Run Vitest tests
npm run test:e2e          # Playwright E2E tests
```

### Key Scripts

- **Generate embeddings:** `npm run generate-embeddings` (for AI recommendations)
- **Database backup:** `npm run db:dump`

---

## 💻 Coding Standards & Patterns

### TypeScript Guidelines

**✅ DO:**
```typescript
// Use explicit types for function parameters and returns
export async function getCar(id: string): Promise<Car | null> {
  // ...
}

// Use Zod for runtime validation
const carSchema = z.object({
  make: z.string().min(1),
  price: z.number().positive(),
});

// Prefer type imports
import type { Database } from '@/types/supabase';
```

**❌ DON'T:**
```typescript
// Avoid implicit any
function updateCar(data) { ... }  // BAD

// Don't disable type checking
// @ts-ignore                      // BAD

// Avoid non-null assertions unless absolutely certain
const car = await getCar(id)!;    // RISKY
```

### React & Next.js Best Practices

**✅ Server Components (Default):**
```typescript
// app/cars/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function CarsPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: cars } = await supabase
    .from('cars')
    .select('*')
    .eq('status', 'published');
  
  return <CarList cars={cars} />;
}
```

**✅ Client Components (When Needed):**
```typescript
// components/car/FavoriteButton.tsx
'use client';  // Required for interactivity

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function FavoriteButton({ carId }: { carId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const supabase = createClientComponentClient();
  
  const toggle = async () => {
    // Client-side mutation
  };
  
  return <button onClick={toggle}>...</button>;
}
```

**Server Actions (Preferred for Mutations):**
```typescript
// app/actions/cars.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function createCar(formData: FormData) {
  const supabase = createServerActionClient({ cookies });
  
  const { data, error } = await supabase
    .from('cars')
    .insert({ /* ... */ });
  
  if (error) throw error;
  
  revalidatePath('/dashboard/cars');
  return data;
}
```

### Component Structure

```typescript
// components/car/CarCard.tsx
import type { Car } from '@/types/database';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/format';

interface CarCardProps {
  car: Car;
  onFavorite?: (carId: string) => void;
  variant?: 'default' | 'compact';
}

export default function CarCard({ 
  car, 
  onFavorite,
  variant = 'default' 
}: CarCardProps) {
  return (
    <Card className={variant === 'compact' ? 'p-3' : 'p-6'}>
      {/* Component JSX */}
    </Card>
  );
}

// Export prop types for reuse
export type { CarCardProps };
```

---

## 🎨 Styling Conventions

### Tailwind CSS Guidelines

**✅ Recommended Patterns:**
```typescript
// Use Tailwind utility classes
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">

// Responsive design (mobile-first)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Use @apply sparingly (only for complex, repeated patterns)
// globals.css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-white rounded-lg;
  }
}
```

**❌ Avoid:**
```typescript
// Don't use inline styles
<div style={{ padding: '16px' }}>  // Use Tailwind instead

// Don't mix Tailwind with CSS modules unnecessarily
import styles from './Button.module.css';
<button className={`${styles.button} px-4`}>  // Choose one approach
```

### Component Library

We use **shadcn/ui** (built on Radix UI):
- Button, Card, Dialog, Dropdown, Toast, etc.
- Located in `components/ui/`
- Fully customizable with Tailwind

**Usage:**
```typescript
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

<Button variant="default" size="lg">
  Click me
</Button>
```

---

## 🗄️ Database Patterns

### Supabase Client Usage

**✅ Server-side (RSC, Server Actions, API Routes):**
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createServerComponentClient({ cookies });
```

**✅ Client-side:**
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();
```

### Query Patterns

**Simple Query:**
```typescript
const { data, error } = await supabase
  .from('cars')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false })
  .limit(10);
```

**Join Query (Foreign Key Relationships):**
```typescript
const { data: cars } = await supabase
  .from('cars')
  .select(`
    *,
    seller:profiles!seller_id (
      full_name,
      avatar_url,
      seller_rating
    )
  `)
  .eq('status', 'published');

// Access: cars[0].seller.full_name
```

**Realtime Subscription:**
```typescript
const channel = supabase
  .channel('car-changes')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'cars' },
    (payload) => {
      console.log('New car:', payload.new);
    }
  )
  .subscribe();

// Cleanup
return () => { channel.unsubscribe(); };
```

---

## 🌐 Internationalization (i18n)

### Current Implementation

**Structure:**
```typescript
// locales/translations.ts
export const translations = {
  en: {
    'hero_title': 'Connecting Continents, Driving Dreams',
    'search_placeholder': 'Search for your dream car...',
  },
  ko: {
    'hero_title': '대륙을 연결하고, 꿈을 향해 나아가다',
    'search_placeholder': '꿈의 자동차를 검색하세요...',
  },
  fr: { /* ... */ },
  sw: { /* ... */ },
};
```

**Usage in Components:**
```typescript
import { useTranslation } from '@/hooks/useTranslation';

export default function HeroSection() {
  const { t } = useTranslation();
  
  return <h1>{t('hero_title')}</h1>;
}
```

**With Dynamic Values:**
```typescript
// Translation key
'welcome_message': 'Welcome back, {name}!'

// Usage
t('welcome_message', { name: user.full_name })
```

---

## 🤖 AI Integration Guidelines

### Gemini API Best Practices

**✅ Always use server-side:**
```typescript
// app/api/ai/generate-description/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// NEVER expose API key to client
```

**Prompt Engineering:**
```typescript
// Good prompt structure
const prompt = `You are an expert {role}.

Task: {task description}

Input:
{structured input data}

Requirements:
1. {specific requirement}
2. {another requirement}

Output format:
{expected format}`;
```

**Error Handling:**
```typescript
try {
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Validate AI output
  if (!response || response.length < 50) {
    throw new Error('Invalid AI response');
  }
  
  return response;
} catch (error) {
  console.error('AI generation failed:', error);
  // Fallback or user-friendly error
}
```

---

## 🔒 Security Guidelines

### Environment Variables

**NEVER commit:**
- API keys (Supabase, Gemini, Stripe)
- Service role keys
- Webhook secrets

**Storage:**
- Development: `.env.local` (gitignored)
- Production: Netlify environment variables

### Row Level Security (RLS)

**All tables MUST have RLS enabled:**
```sql
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Example policy
CREATE POLICY "Users can view own cars"
ON public.cars FOR SELECT
USING (auth.uid() = seller_id OR status = 'published');
```

### Authentication Checks

```typescript
// Always verify user on protected actions
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Check user role for seller actions
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (profile.role !== 'seller') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## 📝 Commit Message Format

We follow **Conventional Commits:**

```bash
# Format
<type>(<scope>): <subject>

# Types
feat: New feature
fix: Bug fix
docs: Documentation only
style: Code style (formatting, no logic change)
refactor: Code refactoring
test: Adding tests
chore: Build process, dependencies

# Examples
feat(auth): add Google OAuth login
fix(search): resolve filter reset bug
docs(prd): update mobile app strategy
refactor(api): extract AI prompt builders
test(cars): add CarCard component tests
```

---

## 🐛 Common Issues & Solutions

### Issue: Supabase client not authenticated
```typescript
// Problem: Using wrong client type
const supabase = createClient(url, key);  // ❌

// Solution: Use appropriate helper
const supabase = createServerComponentClient({ cookies });  // ✅
```

### Issue: Hydration errors with translations
```typescript
// Problem: Server/client mismatch
<h1>{t('title')}</h1>  // Language changes on client

// Solution: Use 'use client' or pass translated text as prop
```

### Issue: Type errors with Supabase queries
```typescript
// Problem: No types generated
const { data } = await supabase.from('cars').select('*');
// data is 'any'

// Solution: Generate types
npm run db:generate-types

// Then use typed client
import type { Database } from '@/types/supabase';
const supabase = createClient<Database>(...);
```

---

## 🎯 Current Sprint Focus (Phase 2)

**Active Tasks:**
1. ✅ Supabase project setup
2. 🔄 Complete auth flow (email + OAuth)
3. 🔄 Migrate cars table to Supabase
4. 📋 Build messaging system with Realtime
5. 📋 Image upload to Supabase Storage
6. 📋 AI description generator integration

**Reference:**
- See `09-ROADMAP.md` for full feature timeline
- Check `03-FEATURES-CORE.md` for detailed user stories

---

## 📚 Key Documentation References

- **PRD:** `docs/PRD.md` - Project overview and navigation
- **Tech Stack:** `docs/02-TECHNICAL-STACK.md` - Detailed architecture
- **Database Schema:** `docs/05-DATABASE-SCHEMA.md` - All tables and RLS policies
- **Core Features:** `docs/03-FEATURES-CORE.md` - Implementation guides
- **AI Features:** `docs/04-FEATURES-AI.md` - Gemini integration patterns

---

## 💡 Working with This Project

### For New Features

1. Read the relevant section in `03-FEATURES-CORE.md` or `04-FEATURES-AI.md`
2. Check `05-DATABASE-SCHEMA.md` for data model
3. Create feature branch: `feature/FEATURE-ID-description`
4. Implement with test coverage
5. Update documentation if needed

### For Bug Fixes

1. Reproduce the bug locally
2. Check if it's a known issue in GitHub
3. Create fix branch: `fix/brief-description`
4. Add test to prevent regression
5. Submit PR with clear description

### When Adding New Dependencies

```bash
# Always save exact versions
npm install --save-exact <package>

# Update package.json comment
"dependencies": {
  "new-package": "1.2.3",  // Purpose: what it's used for
}
```

---

## 🚀 Deployment Notes

- **Platform:** Netlify (primary), Vercel (backup)
- **Domain:** skautosphere.com
- **Branch Strategy:**
  - `main` → Production
  - `staging` → Preview environment
  - `feature/*` → PR previews
- **CI/CD:** GitHub Actions (`.github/workflows/`)

---

**Need Help?**
- Check documentation first
- Review similar implemented features
- Ask specific questions with context
- Include error messages and code snippets

**Happy Coding! 🎉**
