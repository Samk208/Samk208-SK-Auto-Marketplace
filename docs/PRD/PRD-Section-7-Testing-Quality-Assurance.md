# SECTION 7: TESTING & QUALITY ASSURANCE STRATEGY

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Status:** ✅ Framework Approved - Implementation In Progress
**Project:** SK AutoSphere (teyloksuvmmhqixjqoch)
**Section:** 7 of 9

---

## 📋 Table of Contents

- [7.1 Testing Philosophy & Approach](#71-testing-philosophy--approach)
- [7.2 Test Framework Configuration](#72-test-framework-configuration)
- [7.3 Unit Testing Strategy](#73-unit-testing-strategy)
- [7.4 Integration Testing Strategy](#74-integration-testing-strategy)
- [7.5 End-to-End Testing Strategy](#75-end-to-end-testing-strategy)
- [7.6 API Testing & Contract Testing](#76-api-testing--contract-testing)
- [7.7 Database Testing](#77-database-testing)
- [7.8 Security Testing](#78-security-testing)
- [7.9 Performance Testing](#79-performance-testing)
- [7.10 Accessibility Testing](#710-accessibility-testing)
- [7.11 Internationalization Testing](#711-internationalization-testing)
- [7.12 Mobile Testing Strategy](#712-mobile-testing-strategy)
- [7.13 AI Feature Testing](#713-ai-feature-testing)
- [7.14 Visual Regression Testing](#714-visual-regression-testing)
- [7.15 Test Data Management](#715-test-data-management)
- [7.16 Continuous Testing & CI/CD](#716-continuous-testing--cicd)
- [7.17 QA Metrics & Reporting](#717-qa-metrics--reporting)
- [7.18 Bug Management Process](#718-bug-management-process)
- [7.19 Quality Checklist Templates](#719-quality-checklist-templates)
- [7.20 Testing Best Practices](#720-testing-best-practices)

---

## 7.1 Testing Philosophy & Approach

### 7.1.1 Quality-First Development Culture

**Core Principles:**

SK AutoSphere adopts a **shift-left testing approach** where quality is built in from the start, not tested in at the end. Every feature development cycle includes:

1. **Test-Driven Development (TDD)** for critical business logic
2. **Behavior-Driven Development (BDD)** for user-facing features
3. **Continuous testing** integrated into CI/CD pipelines
4. **Automated regression prevention** to maintain code stability

**Why This Matters:**

- **60% faster bug resolution** when caught in development vs. production
- **80% reduction in production incidents** with comprehensive test coverage
- **90% developer confidence** in refactoring with robust test suites
- **40% faster feature delivery** with automated quality gates

---

### 7.1.2 Testing Pyramid Strategy

```
                    /\
                   /  \
                  / E2E\        10% - Critical user journeys
                 /______\       ~50 tests
                /        \
               /Integration\    30% - API, DB, service integration
              /____________\   ~200 tests
             /              \
            /  Unit Tests    \  60% - Functions, components, logic
           /__________________\ ~500 tests

```

**Distribution Targets:**

| Test Type | Coverage % | Count Target | Execution Time | Environment |
|-----------|------------|--------------|----------------|-------------|
| **Unit** | 60% | ~500 tests | <2 minutes | Local/CI |
| **Integration** | 30% | ~200 tests | <5 minutes | Local/CI |
| **E2E** | 10% | ~50 tests | <15 minutes | CI/Staging |

**Rationale:**

- **Unit tests** are fast, cheap, and catch 70% of bugs early
- **Integration tests** validate service boundaries and data flows
- **E2E tests** verify critical business flows but are expensive to maintain

---

### 7.1.3 Quality Gates & Acceptance Criteria

**Pre-Merge Quality Gates:**

All pull requests must pass:

1. ✅ **Unit test coverage** ≥ 80% for new code
2. ✅ **Integration tests** pass for affected modules
3. ✅ **E2E tests** pass for modified user flows
4. ✅ **TypeScript compilation** with zero errors
5. ✅ **ESLint** with zero errors, max 5 warnings
6. ✅ **Build succeeds** without warnings
7. ✅ **Lighthouse score** ≥ 90 for performance, accessibility, SEO
8. ✅ **Bundle size** doesn't increase >5% without justification

**Pre-Production Quality Gates:**

Before deploying to production:

1. ✅ **Full E2E test suite** passes (100% success rate)
2. ✅ **Security scan** shows zero critical/high vulnerabilities
3. ✅ **Performance budget** maintained (Core Web Vitals green)
4. ✅ **Accessibility audit** passes WCAG 2.1 AA
5. ✅ **Database migrations** tested with rollback plan
6. ✅ **Monitoring & alerts** configured for new features
7. ✅ **Feature flags** configured for gradual rollout
8. ✅ **Rollback plan** documented and rehearsed

---

### 7.1.4 Test Coverage Targets

**Overall Coverage Goals:**

| Component | Unit Coverage | Integration Coverage | E2E Coverage |
|-----------|---------------|---------------------|--------------|
| **Business Logic** | 95% | 80% | N/A |
| **API Routes** | 85% | 90% | 70% |
| **UI Components** | 80% | 60% | 50% |
| **Database Queries** | 90% | 95% | N/A |
| **Authentication** | 100% | 100% | 90% |
| **Payment Flows** | 100% | 100% | 100% |
| **AI Features** | 75% | 85% | 60% |

**Critical Path Coverage = 100%:**

Must have E2E tests covering:
- User registration and login
- Car listing creation and publishing
- Search and filtering
- Messaging with translation
- Favorites management
- Seller dashboard analytics

---

## 7.2 Test Framework Configuration

### 7.2.1 Vitest Setup (Unit & Integration Tests)

**Implementation Status:** ⏳ **Pending Configuration**

**Installation:**

```bash
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event happy-dom
```

**Configuration File - vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'out/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/types/**',
      ],
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'out', 'e2e'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Setup File - vitest.setup.ts:**

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClientComponentClient: () => ({
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    storage: {
      from: vi.fn(),
    },
    channel: vi.fn(),
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.GEMINI_API_KEY = 'test-gemini-key';
```

**Package.json Scripts:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch"
  }
}
```

---

### 7.2.2 Playwright Setup (E2E Tests)

**Implementation Status:** ⏳ **Pending Configuration**

**Installation:**

```bash
npm install --save-dev @playwright/test
npx playwright install chromium firefox webkit
```

**Configuration File - playwright.config.ts:**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers (critical for African markets)
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Slow 3G simulation (African network conditions)
    {
      name: 'slow-3g',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--network-conditions={"offline":false,"downloadThroughput":50000,"uploadThroughput":20000,"latency":2000}',
          ],
        },
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

**Package.json Scripts:**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

---

### 7.2.3 Testing Library Configuration

**React Testing Library Utilities - src/test/utils.tsx:**

```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

// Custom render with providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 7.3 Unit Testing Strategy

### 7.3.1 Component Testing

**Target Coverage:** 80% of React components

**What to Test:**

1. ✅ **Rendering:** Component renders without crashing
2. ✅ **Props:** Component handles various prop combinations
3. ✅ **User Interactions:** Clicks, inputs, form submissions
4. ✅ **Conditional Rendering:** Different states (loading, error, success)
5. ✅ **Edge Cases:** Empty states, missing data, invalid inputs

**What NOT to Test:**

❌ Implementation details (internal state)
❌ Third-party library internals
❌ CSS styling (use visual regression tests)
❌ Static content that doesn't change

---

#### 7.3.1.1 Example: CarCard Component Test

**Component - components/car/CarCard.tsx:**

```typescript
import type { Car } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Image from 'next/image';
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
  const isFavorited = false; // Simplified for example

  return (
    <Card className={variant === 'compact' ? 'p-3' : 'p-6'}>
      <div className="relative aspect-video">
        <Image
          src={car.images[0] || '/placeholder-car.jpg'}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover rounded-lg"
        />
        {onFavorite && (
          <button
            onClick={() => onFavorite(car.id)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full"
            aria-label="Add to favorites"
          >
            <Heart
              className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">
          {car.make} {car.model}
        </h3>
        <p className="text-sm text-gray-600">
          {car.year} • {car.mileage.toLocaleString()} km
        </p>
        <p className="mt-2 text-xl font-bold text-primary">
          {formatCurrency(car.price, car.currency)}
        </p>
      </div>
    </Card>
  );
}
```

**Test - components/car/CarCard.test.tsx:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import CarCard from './CarCard';
import type { Car } from '@/types/database';

const mockCar: Car = {
  id: 'car-123',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  mileage: 45000,
  price: 25000,
  currency: 'USD',
  images: ['/test-image.jpg'],
  status: 'published',
  seller_id: 'seller-1',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

describe('CarCard Component', () => {
  it('renders car information correctly', () => {
    render(<CarCard car={mockCar} />);

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
    expect(screen.getByText(/45,000 km/)).toBeInTheDocument();
    expect(screen.getByText(/\$25,000/)).toBeInTheDocument();
  });

  it('renders in compact variant', () => {
    const { container } = render(
      <CarCard car={mockCar} variant="compact" />
    );

    const card = container.querySelector('.p-3');
    expect(card).toBeInTheDocument();
  });

  it('calls onFavorite when heart icon is clicked', async () => {
    const handleFavorite = vi.fn();
    const user = userEvent.setup();

    render(<CarCard car={mockCar} onFavorite={handleFavorite} />);

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(favoriteButton);

    expect(handleFavorite).toHaveBeenCalledWith('car-123');
  });

  it('does not render favorite button when onFavorite is not provided', () => {
    render(<CarCard car={mockCar} />);

    const favoriteButton = screen.queryByRole('button', { name: /add to favorites/i });
    expect(favoriteButton).not.toBeInTheDocument();
  });

  it('displays placeholder image when car has no images', () => {
    const carWithoutImage = { ...mockCar, images: [] };

    render(<CarCard car={carWithoutImage} />);

    const image = screen.getByAltText('Toyota Camry');
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder-car.jpg'));
  });

  it('formats currency based on car currency', () => {
    const carInKRW = { ...mockCar, price: 30000000, currency: 'KRW' };

    render(<CarCard car={carInKRW} />);

    expect(screen.getByText(/₩30,000,000/)).toBeInTheDocument();
  });
});
```

**Coverage Target:** ✅ 90% for this component

---

### 7.3.2 Hook Testing

**Target Coverage:** 85% of custom React hooks

#### Example: useTranslation Hook Test

**Hook - hooks/useTranslation.ts:**

```typescript
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

export function useTranslation() {
  const { language } = useContext(LanguageContext);

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language]?.[key] || key;

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }

    return text;
  };

  return { t, language };
}
```

**Test - hooks/useTranslation.test.tsx:**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from './useTranslation';
import { LanguageProvider } from '@/context/LanguageContext';

describe('useTranslation Hook', () => {
  it('returns translated text for valid key', () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: ({ children }) => (
        <LanguageProvider initialLanguage="en">
          {children}
        </LanguageProvider>
      ),
    });

    expect(result.current.t('hero_title')).toBe('Connecting Continents, Driving Dreams');
  });

  it('returns key when translation is missing', () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('non_existent_key')).toBe('non_existent_key');
  });

  it('replaces parameters in translation', () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: LanguageProvider,
    });

    const translated = result.current.t('welcome_message', { name: 'Sam' });
    expect(translated).toBe('Welcome back, Sam!');
  });

  it('returns current language', () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: ({ children }) => (
        <LanguageProvider initialLanguage="ko">
          {children}
        </LanguageProvider>
      ),
    });

    expect(result.current.language).toBe('ko');
  });
});
```

---

### 7.3.3 Utility Function Testing

**Target Coverage:** 95% for utility functions

#### Example: formatCurrency Test

**Utility - lib/utils/format.ts:**

```typescript
export function formatCurrency(amount: number, currency: string): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    KRW: new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }),
    NGN: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }),
  };

  const formatter = formatters[currency] || formatters.USD;
  return formatter.format(amount);
}

export function formatMileage(km: number, locale: string = 'en'): string {
  return `${km.toLocaleString(locale)} km`;
}

export function formatDate(date: string, locale: string = 'en'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
```

**Test - lib/utils/format.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatMileage, formatDate } from './format';

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(25000, 'USD')).toBe('$25,000.00');
    });

    it('formats KRW correctly', () => {
      expect(formatCurrency(30000000, 'KRW')).toBe('₩30,000,000');
    });

    it('falls back to USD for unknown currency', () => {
      expect(formatCurrency(1000, 'UNKNOWN')).toBe('$1,000.00');
    });

    it('handles zero amount', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });

    it('handles negative amounts', () => {
      expect(formatCurrency(-500, 'USD')).toBe('-$500.00');
    });
  });

  describe('formatMileage', () => {
    it('formats with English locale', () => {
      expect(formatMileage(45000, 'en')).toBe('45,000 km');
    });

    it('formats with Korean locale', () => {
      expect(formatMileage(45000, 'ko')).toBe('45,000 km');
    });

    it('uses default locale when not specified', () => {
      expect(formatMileage(100000)).toBe('100,000 km');
    });
  });

  describe('formatDate', () => {
    it('formats date in English', () => {
      const result = formatDate('2024-01-15', 'en');
      expect(result).toMatch(/Jan.*15.*2024/);
    });

    it('formats date in Korean', () => {
      const result = formatDate('2024-01-15', 'ko');
      expect(result).toContain('2024');
    });
  });
});
```

---

### 7.3.4 Server Action Testing

**Target Coverage:** 90% for server actions

#### Example: createCar Server Action Test

**Server Action - app/actions/cars.ts:**

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { carCreateSchema } from '@/lib/validations/car';

export async function createCar(formData: FormData) {
  const supabase = createServerActionClient({ cookies });

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Validate input
  const rawData = {
    make: formData.get('make'),
    model: formData.get('model'),
    year: Number(formData.get('year')),
    mileage: Number(formData.get('mileage')),
    price: Number(formData.get('price')),
    currency: formData.get('currency'),
  };

  const validation = carCreateSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: 'Invalid input', details: validation.error.errors };
  }

  // Insert car
  const { data, error } = await supabase
    .from('cars')
    .insert({
      ...validation.data,
      seller_id: user.id,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to create car' };
  }

  revalidatePath('/seller-dashboard');
  return { data };
}
```

**Test - app/actions/cars.test.ts:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCar } from './cars';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
  })),
};

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerActionClient: () => mockSupabase,
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createCar Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates car successfully with valid data', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    mockSupabase.from().insert().select().single.mockResolvedValue({
      data: { id: 'car-123', make: 'Toyota' },
      error: null,
    });

    const formData = new FormData();
    formData.set('make', 'Toyota');
    formData.set('model', 'Camry');
    formData.set('year', '2020');
    formData.set('mileage', '45000');
    formData.set('price', '25000');
    formData.set('currency', 'USD');

    const result = await createCar(formData);

    expect(result.error).toBeUndefined();
    expect(result.data).toHaveProperty('id');
  });

  it('returns error when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const formData = new FormData();
    const result = await createCar(formData);

    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when validation fails', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    const formData = new FormData();
    formData.set('make', ''); // Invalid: empty make

    const result = await createCar(formData);

    expect(result.error).toBe('Invalid input');
    expect(result.details).toBeDefined();
  });
});
```

---

## 7.4 Integration Testing Strategy

### 7.4.1 API Integration Tests

**Target Coverage:** 90% of API routes

#### Example: Car Listing API Integration Test

**API Route - app/api/cars/route.ts:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const searchParams = request.nextUrl.searchParams;

  const make = searchParams.get('make');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  let query = supabase
    .from('cars')
    .select('*')
    .eq('status', 'published');

  if (make) {
    query = query.eq('make', make);
  }

  if (minPrice) {
    query = query.gte('price', Number(minPrice));
  }

  if (maxPrice) {
    query = query.lte('price', Number(maxPrice));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

**Test - app/api/cars/route.test.ts:**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { GET } from './route';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

describe('GET /api/cars', () => {
  beforeEach(async () => {
    // Seed test data
    await supabase.from('cars').insert([
      {
        id: 'car-1',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        price: 25000,
        status: 'published',
        seller_id: 'test-seller',
      },
      {
        id: 'car-2',
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        price: 22000,
        status: 'published',
        seller_id: 'test-seller',
      },
    ]);
  });

  afterEach(async () => {
    // Cleanup test data
    await supabase.from('cars').delete().in('id', ['car-1', 'car-2']);
  });

  it('returns all published cars', async () => {
    const request = new Request('http://localhost:3000/api/cars');
    const response = await GET(request as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(2);
  });

  it('filters cars by make', async () => {
    const request = new Request('http://localhost:3000/api/cars?make=Toyota');
    const response = await GET(request as any);
    const body = await response.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].make).toBe('Toyota');
  });

  it('filters cars by price range', async () => {
    const request = new Request('http://localhost:3000/api/cars?minPrice=20000&maxPrice=23000');
    const response = await GET(request as any);
    const body = await response.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].make).toBe('Honda');
  });
});
```

---

### 7.4.2 Database Integration Tests

**Target Coverage:** 95% of database operations

#### Example: RLS Policy Verification Test

**Test - tests/integration/database/rls-policies.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

describe('Row Level Security Policies', () => {
  describe('Cars Table RLS', () => {
    it('allows authenticated users to view published cars', async () => {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Sign in as test user
      await supabase.auth.signInWithPassword({
        email: 'buyer@test.com',
        password: 'testpassword',
      });

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'published');

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('prevents users from viewing other sellers draft cars', async () => {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      await supabase.auth.signInWithPassword({
        email: 'buyer@test.com',
        password: 'testpassword',
      });

      const { data } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'draft')
        .neq('seller_id', (await supabase.auth.getUser()).data.user?.id);

      expect(data).toHaveLength(0);
    });

    it('allows sellers to update their own cars', async () => {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      await supabase.auth.signInWithPassword({
        email: 'seller@test.com',
        password: 'testpassword',
      });

      const userId = (await supabase.auth.getUser()).data.user?.id;

      const { error } = await supabase
        .from('cars')
        .update({ price: 26000 })
        .eq('seller_id', userId)
        .eq('id', 'test-car-id');

      expect(error).toBeNull();
    });

    it('prevents sellers from updating other sellers cars', async () => {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      await supabase.auth.signInWithPassword({
        email: 'seller@test.com',
        password: 'testpassword',
      });

      const { error } = await supabase
        .from('cars')
        .update({ price: 26000 })
        .neq('seller_id', (await supabase.auth.getUser()).data.user?.id);

      expect(error).not.toBeNull();
      expect(error?.code).toBe('42501'); // Insufficient privileges
    });
  });

  describe('Messages Table RLS', () => {
    it('allows users to view messages in their conversations', async () => {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      await supabase.auth.signInWithPassword({
        email: 'user@test.com',
        password: 'testpassword',
      });

      const userId = (await supabase.auth.getUser()).data.user?.id;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          conversation:conversations!inner(*)
        `)
        .or(`conversations.buyer_id.eq.${userId},conversations.seller_id.eq.${userId}`);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });
});
```

---

### 7.4.3 Third-Party Service Mocking

**Target:** Mock all external APIs in integration tests

#### Example: Gemini AI Mock

**Mock - tests/mocks/gemini.ts:**

```typescript
import { vi } from 'vitest';

export const mockGeminiClient = {
  generateContent: vi.fn(async (prompt: string) => {
    if (prompt.includes('car description')) {
      return {
        response: {
          text: () => 'Excellent condition Toyota Camry 2020 with low mileage...',
        },
      };
    }

    if (prompt.includes('translate')) {
      return {
        response: {
          text: () => '훌륭한 상태의 2020 도요타 캠리...',
        },
      };
    }

    throw new Error('Unexpected prompt');
  }),
};

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: () => mockGeminiClient,
  })),
}));
```

---

## 7.5 End-to-End Testing Strategy

### 7.5.1 Critical User Journey Tests

**Target Coverage:** 100% of critical paths

#### Example: User Registration Flow

**Test - e2e/auth/registration.spec.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('buyer can register successfully', async ({ page }) => {
    await page.goto('/signup');

    // Fill registration form
    await page.fill('[name="email"]', 'newbuyer@test.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirmPassword"]', 'SecurePass123!');
    await page.fill('[name="fullName"]', 'John Doe');
    await page.selectOption('[name="role"]', 'buyer');
    await page.selectOption('[name="country"]', 'Nigeria');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify email confirmation message
    await expect(page.locator('text=Check your email')).toBeVisible();

    // Simulate email verification (in test environment)
    const confirmationLink = await getConfirmationLink('newbuyer@test.com');
    await page.goto(confirmationLink);

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome, John Doe')).toBeVisible();
  });

  test('shows validation errors for invalid input', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="password"]', '123'); // Too short
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('prevents duplicate email registration', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('[name="email"]', 'existing@test.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirmPassword"]', 'SecurePass123!');
    await page.fill('[name="fullName"]', 'Jane Doe');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Email already registered')).toBeVisible();
  });
});
```

---

#### Example: Car Listing Creation Flow

**Test - e2e/cars/create-listing.spec.ts:**

```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Car Listing Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as seller
    await page.goto('/login');
    await page.fill('[name="email"]', 'seller@test.com');
    await page.fill('[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/seller-dashboard');
  });

  test('seller can create complete car listing', async ({ page }) => {
    await page.click('text=Create New Listing');

    // Step 1: Upload photos
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      path.join(__dirname, '../fixtures/car-front.jpg'),
      path.join(__dirname, '../fixtures/car-rear.jpg'),
      path.join(__dirname, '../fixtures/car-interior.jpg'),
    ]);

    await expect(page.locator('text=3/15 photos uploaded')).toBeVisible();
    await page.click('text=Next');

    // Step 2: Basic details
    await page.selectOption('[name="make"]', 'Toyota');
    await page.selectOption('[name="model"]', 'Camry');
    await page.fill('[name="year"]', '2020');
    await page.fill('[name="mileage"]', '45000');
    await page.fill('[name="price"]', '25000');
    await page.selectOption('[name="currency"]', 'USD');
    await page.click('text=Generate AI Description');

    // Wait for AI generation
    await expect(page.locator('text=Generating...')).toBeVisible();
    await expect(page.locator('text=Generating...')).not.toBeVisible({ timeout: 30000 });

    // Verify AI descriptions generated
    await expect(page.locator('[data-testid="description-en"]')).not.toBeEmpty();
    await expect(page.locator('[data-testid="description-ko"]')).not.toBeEmpty();
    await expect(page.locator('[data-testid="description-fr"]')).not.toBeEmpty();

    await page.click('text=Next');

    // Step 3: Review and publish
    await expect(page.locator('text=Toyota Camry')).toBeVisible();
    await expect(page.locator('text=$25,000')).toBeVisible();

    await page.click('text=Publish Listing');

    // Verify success
    await expect(page.locator('text=Listing published successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/seller-dashboard\/listings/);
  });

  test('validates required fields', async ({ page }) => {
    await page.click('text=Create New Listing');

    // Try to proceed without uploading photos
    await page.click('text=Next');

    await expect(page.locator('text=Please upload at least 6 photos')).toBeVisible();
  });
});
```

---

#### Example: Messaging Flow with Translation

**Test - e2e/messaging/conversation.spec.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Real-Time Messaging', () => {
  test('buyer can send message to seller and receive auto-translation', async ({ browser }) => {
    // Create two browser contexts for buyer and seller
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();

    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();

    // Buyer logs in
    await buyerPage.goto('/login');
    await buyerPage.fill('[name="email"]', 'buyer@test.com');
    await buyerPage.fill('[name="password"]', 'testpass123');
    await buyerPage.click('button[type="submit"]');

    // Seller logs in
    await sellerPage.goto('/login');
    await sellerPage.fill('[name="email"]', 'seller@test.com');
    await sellerPage.fill('[name="password"]', 'testpass123');
    await sellerPage.click('button[type="submit"]');
    await sellerPage.goto('/messages');

    // Buyer starts conversation from car listing
    await buyerPage.goto('/cars/car-123');
    await buyerPage.click('text=Contact Seller');

    // Buyer sends message in English
    await buyerPage.fill('[name="message"]', 'Is this car still available?');
    await buyerPage.click('button[aria-label="Send message"]');

    // Verify message sent
    await expect(buyerPage.locator('text=Is this car still available?')).toBeVisible();

    // Seller receives message (auto-translated to Korean)
    await sellerPage.waitForSelector('text=이 차량은 아직 구매 가능한가요?', { timeout: 10000 });
    await expect(sellerPage.locator('text=이 차량은 아직 구매 가능한가요?')).toBeVisible();

    // Seller can see original message
    await sellerPage.click('[aria-label="Show original"]');
    await expect(sellerPage.locator('text=Is this car still available?')).toBeVisible();

    // Seller replies in Korean
    await sellerPage.fill('[name="message"]', '네, 아직 판매 중입니다.');
    await sellerPage.click('button[aria-label="Send message"]');

    // Buyer receives translated message
    await buyerPage.waitForSelector('text=Yes, it is still for sale.', { timeout: 10000 });
    await expect(buyerPage.locator('text=Yes, it is still for sale.')).toBeVisible();

    await buyerContext.close();
    await sellerContext.close();
  });

  test('shows typing indicator in real-time', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const user1Page = await context1.newPage();
    const user2Page = await context2.newPage();

    // Both users join same conversation
    await user1Page.goto('/messages/conversation-123');
    await user2Page.goto('/messages/conversation-123');

    // User 1 starts typing
    await user1Page.fill('[name="message"]', 'Hello');

    // User 2 sees typing indicator
    await expect(user2Page.locator('text=typing...')).toBeVisible({ timeout: 2000 });

    // User 1 stops typing
    await user1Page.fill('[name="message"]', '');

    // Typing indicator disappears
    await expect(user2Page.locator('text=typing...')).not.toBeVisible({ timeout: 3000 });

    await context1.close();
    await context2.close();
  });
});
```

---

### 7.5.2 Mobile Responsiveness Testing

**Test - e2e/responsive/mobile-navigation.spec.ts:**

```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] });

  test('mobile menu navigation works correctly', async ({ page }) => {
    await page.goto('/');

    // Verify hamburger menu is visible
    const menuButton = page.locator('[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();

    // Navigate to car listings
    await page.click('text=Browse Cars');
    await expect(page).toHaveURL('/cars');

    // Verify mobile layout
    await expect(page.locator('.grid-cols-1')).toBeVisible();
  });

  test('car cards display correctly on mobile', async ({ page }) => {
    await page.goto('/cars');

    // Verify single column layout
    const carCards = page.locator('[data-testid="car-card"]');
    const firstCard = carCards.first();

    const boundingBox = await firstCard.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(300);
    expect(boundingBox?.width).toBeLessThan(400);
  });

  test('search filters work on mobile', async ({ page }) => {
    await page.goto('/cars');

    // Open filter drawer
    await page.click('[aria-label="Open filters"]');
    await expect(page.locator('text=Filters')).toBeVisible();

    // Apply filters
    await page.selectOption('[name="make"]', 'Toyota');
    await page.fill('[name="maxPrice"]', '30000');
    await page.click('text=Apply Filters');

    // Verify filtered results
    await expect(page.locator('text=Toyota')).toBeVisible();
  });
});
```

---

### 7.5.3 Slow 3G Network Testing

**Test - e2e/performance/slow-network.spec.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Slow 3G Network Performance', () => {
  test.use({
    contextOptions: {
      offline: false,
    },
  });

  test('homepage loads within 10 seconds on slow 3G', async ({ page, context }) => {
    // Simulate slow 3G
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (50 * 1024) / 8, // 50 Kbps
      uploadThroughput: (20 * 1024) / 8,   // 20 Kbps
      latency: 2000, // 2 seconds
    });

    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000); // Less than 10 seconds

    // Verify critical content is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="search-bar"]')).toBeVisible();
  });

  test('images lazy load on slow connection', async ({ page, context }) => {
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (50 * 1024) / 8,
      uploadThroughput: (20 * 1024) / 8,
      latency: 2000,
    });

    await page.goto('/cars');

    // Verify images below fold are not loaded immediately
    const belowFoldImage = page.locator('img').nth(10);
    const isLoaded = await belowFoldImage.evaluate((img) => (img as HTMLImageElement).complete);

    expect(isLoaded).toBe(false);

    // Scroll to image
    await belowFoldImage.scrollIntoViewIfNeeded();

    // Wait for image to load
    await expect(belowFoldImage).toHaveAttribute('src', /.+/);
  });
});
```

---

## 7.6 API Testing & Contract Testing

### 7.6.1 REST API Endpoint Testing

**Target Coverage:** 95% of API routes

#### Example: Comprehensive API Test Suite

**Test - tests/api/cars/endpoints.test.ts:**

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('Cars API Endpoints', () => {
  let authToken: string;
  let testCarId: string;

  beforeAll(async () => {
    // Get auth token for testing
    const { data } = await supabase.auth.signInWithPassword({
      email: 'seller@test.com',
      password: 'testpass123',
    });
    authToken = data.session!.access_token;
  });

  afterAll(async () => {
    // Cleanup
    if (testCarId) {
      await supabase.from('cars').delete().eq('id', testCarId);
    }
  });

  describe('POST /api/cars', () => {
    it('creates a new car listing', async () => {
      const response = await fetch(`${baseURL}/api/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          mileage: 45000,
          price: 25000,
          currency: 'USD',
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.data).toHaveProperty('id');
      testCarId = data.data.id;
    });

    it('validates required fields', async () => {
      const response = await fetch(`${baseURL}/api/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          make: 'Toyota',
          // Missing required fields
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('requires authentication', async () => {
      const response = await fetch(`${baseURL}/api/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: 'Toyota',
          model: 'Camry',
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/cars/:id', () => {
    it('returns car details', async () => {
      const response = await fetch(`${baseURL}/api/cars/${testCarId}`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.make).toBe('Toyota');
    });

    it('returns 404 for non-existent car', async () => {
      const response = await fetch(`${baseURL}/api/cars/non-existent-id`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/cars/:id', () => {
    it('updates car details', async () => {
      const response = await fetch(`${baseURL}/api/cars/${testCarId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          price: 26000,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.price).toBe(26000);
    });

    it('prevents updating other sellers cars', async () => {
      // Create another user's car
      const otherCarId = 'other-seller-car';

      const response = await fetch(`${baseURL}/api/cars/${otherCarId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          price: 30000,
        }),
      });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/cars/:id', () => {
    it('soft deletes car listing', async () => {
      const response = await fetch(`${baseURL}/api/cars/${testCarId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);

      // Verify car is marked as deleted
      const { data } = await supabase
        .from('cars')
        .select('status')
        .eq('id', testCarId)
        .single();

      expect(data?.status).toBe('deleted');
    });
  });
});
```

---

### 7.6.2 Rate Limiting Tests

**Test - tests/api/rate-limiting.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';

describe('API Rate Limiting', () => {
  it('enforces rate limit of 100 requests per minute', async () => {
    const requests = Array.from({ length: 101 }, (_, i) =>
      fetch('http://localhost:3000/api/cars')
    );

    const responses = await Promise.all(requests);

    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  it('includes rate limit headers', async () => {
    const response = await fetch('http://localhost:3000/api/cars');

    expect(response.headers.has('X-RateLimit-Limit')).toBe(true);
    expect(response.headers.has('X-RateLimit-Remaining')).toBe(true);
    expect(response.headers.has('X-RateLimit-Reset')).toBe(true);
  });
});
```

---

## 7.7 Database Testing

### 7.7.1 Migration Testing

**Test - tests/database/migrations.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('Database Migrations', () => {
  it('all migrations execute without errors', async () => {
    const migrationsDir = path.join(__dirname, '../../supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();

    for (const file of migrationFiles) {
      if (!file.endsWith('.sql')) continue;

      const migrationSQL = fs.readFileSync(
        path.join(migrationsDir, file),
        'utf-8'
      );

      const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

      expect(error).toBeNull();
    }
  });

  it('creates all expected tables', async () => {
    const { data, error } = await supabase.rpc('get_tables');

    expect(error).toBeNull();
    expect(data).toContain('profiles');
    expect(data).toContain('cars');
    expect(data).toContain('conversations');
    expect(data).toContain('messages');
    expect(data).toContain('favorites');
  });

  it('creates all indexes for performance', async () => {
    const { data } = await supabase.rpc('get_indexes', { table_name: 'cars' });

    const indexNames = data.map((idx: any) => idx.indexname);

    expect(indexNames).toContain('idx_cars_make');
    expect(indexNames).toContain('idx_cars_model');
    expect(indexNames).toContain('idx_cars_price');
    expect(indexNames).toContain('idx_cars_status');
  });
});
```

---

### 7.7.2 Data Integrity Tests

**Test - tests/database/data-integrity.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('Data Integrity Constraints', () => {
  it('enforces foreign key constraint on cars.seller_id', async () => {
    const { error } = await supabase.from('cars').insert({
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      seller_id: 'non-existent-user-id',
    });

    expect(error).not.toBeNull();
    expect(error?.code).toBe('23503'); // Foreign key violation
  });

  it('enforces unique constraint on profiles.email', async () => {
    // Insert first profile
    await supabase.from('profiles').insert({
      id: 'user-1',
      email: 'duplicate@test.com',
      full_name: 'User One',
    });

    // Try to insert duplicate email
    const { error } = await supabase.from('profiles').insert({
      id: 'user-2',
      email: 'duplicate@test.com',
      full_name: 'User Two',
    });

    expect(error).not.toBeNull();
    expect(error?.code).toBe('23505'); // Unique violation
  });

  it('enforces check constraint on cars.year', async () => {
    const { error } = await supabase.from('cars').insert({
      make: 'Toyota',
      model: 'Camry',
      year: 1899, // Before 1900
      seller_id: 'valid-seller-id',
    });

    expect(error).not.toBeNull();
  });
});
```

---

## 7.8 Security Testing

### 7.8.1 Authentication & Authorization Tests

**Test - tests/security/authentication.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

describe('Authentication Security', () => {
  it('requires strong passwords', async () => {
    const { error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: '123', // Weak password
    });

    expect(error).not.toBeNull();
    expect(error?.message).toContain('Password');
  });

  it('prevents SQL injection in email field', async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "' OR '1'='1",
      password: 'password',
    });

    expect(error).not.toBeNull();
  });

  it('implements rate limiting on login attempts', async () => {
    const attempts = Array.from({ length: 10 }, () =>
      supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
    );

    const results = await Promise.all(attempts);
    const lastResult = results[results.length - 1];

    expect(lastResult.error?.message).toContain('rate limit');
  });

  it('invalidates tokens after password change', async () => {
    // Sign in and get token
    const { data: session1 } = await supabase.auth.signInWithPassword({
      email: 'user@test.com',
      password: 'oldpassword',
    });

    const oldToken = session1?.session?.access_token;

    // Change password
    await supabase.auth.updateUser({ password: 'newpassword' });

    // Try to use old token
    const response = await fetch('http://localhost:3000/api/protected', {
      headers: { Authorization: `Bearer ${oldToken}` },
    });

    expect(response.status).toBe(401);
  });
});
```

---

### 7.8.2 XSS Prevention Tests

**Test - tests/security/xss-prevention.test.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('XSS Prevention', () => {
  test('escapes user input in car descriptions', async ({ page }) => {
    await page.goto('/cars/create');

    // Attempt XSS in description field
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('[name="description"]', xssPayload);
    await page.click('button[type="submit"]');

    // Verify script is not executed
    page.on('dialog', () => {
      throw new Error('XSS alert was triggered!');
    });

    // Verify escaped output
    await page.goto('/cars/test-car-id');
    const description = await page.locator('[data-testid="car-description"]').textContent();
    expect(description).toContain('&lt;script&gt;');
  });

  test('sanitizes HTML in message content', async ({ page }) => {
    await page.goto('/messages/conversation-123');

    await page.fill('[name="message"]', '<img src=x onerror="alert(1)">');
    await page.click('button[aria-label="Send message"]');

    // Verify no alert
    page.on('dialog', () => {
      throw new Error('XSS triggered via image onerror!');
    });

    await page.waitForTimeout(1000);
  });
});
```

---

### 7.8.3 CSRF Protection Tests

**Test - tests/security/csrf-protection.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';

describe('CSRF Protection', () => {
  it('rejects requests without CSRF token', async () => {
    const response = await fetch('http://localhost:3000/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        make: 'Toyota',
        model: 'Camry',
      }),
    });

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain('CSRF');
  });

  it('validates CSRF token matches session', async () => {
    const response = await fetch('http://localhost:3000/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'invalid-token',
      },
      body: JSON.stringify({
        make: 'Toyota',
        model: 'Camry',
      }),
    });

    expect(response.status).toBe(403);
  });
});
```

---

### 7.8.4 Dependency Vulnerability Scanning

**Configuration - .github/workflows/security-scan.yml:**

```yaml
name: Security Scan

on:
  push:
    branches: [main, staging]
  pull_request:
  schedule:
    - cron: '0 0 * * 1' # Weekly on Mondays

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  code-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run CodeQL analysis
        uses: github/codeql-action/init@v2
        with:
          languages: typescript, javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

---

## 7.9 Performance Testing

### 7.9.1 Lighthouse Performance Audits

**Test - tests/performance/lighthouse.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

describe('Lighthouse Performance Audits', () => {
  it('homepage achieves Lighthouse score > 90', async () => {
    const chrome = await launch({ chromeFlags: ['--headless'] });

    const runnerResult = await lighthouse('http://localhost:3000', {
      port: chrome.port,
      onlyCategories: ['performance', 'accessibility', 'seo'],
    });

    await chrome.kill();

    const scores = runnerResult?.lhr.categories;

    expect(scores?.performance.score).toBeGreaterThan(0.9);
    expect(scores?.accessibility.score).toBeGreaterThan(0.9);
    expect(scores?.seo.score).toBeGreaterThan(0.9);
  });

  it('car listing page meets Core Web Vitals thresholds', async () => {
    const chrome = await launch({ chromeFlags: ['--headless'] });

    const runnerResult = await lighthouse('http://localhost:3000/cars/test-car', {
      port: chrome.port,
    });

    await chrome.kill();

    const audits = runnerResult?.lhr.audits;

    // LCP < 2.5s
    const lcp = audits?.['largest-contentful-paint'].numericValue || 0;
    expect(lcp).toBeLessThan(2500);

    // FID < 100ms (TBT as proxy)
    const tbt = audits?.['total-blocking-time'].numericValue || 0;
    expect(tbt).toBeLessThan(300);

    // CLS < 0.1
    const cls = audits?.['cumulative-layout-shift'].numericValue || 0;
    expect(cls).toBeLessThan(0.1);
  });
});
```

---

### 7.9.2 API Response Time Tests

**Test - tests/performance/api-benchmarks.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';

describe('API Response Time Benchmarks', () => {
  it('GET /api/cars responds in < 500ms (p95)', async () => {
    const iterations = 100;
    const responseTimes: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await fetch('http://localhost:3000/api/cars');
      const duration = Date.now() - start;
      responseTimes.push(duration);
    }

    responseTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(iterations * 0.95);
    const p95ResponseTime = responseTimes[p95Index];

    expect(p95ResponseTime).toBeLessThan(500);
  });

  it('Search API handles 100 concurrent requests', async () => {
    const requests = Array.from({ length: 100 }, () =>
      fetch('http://localhost:3000/api/cars/search?q=toyota')
    );

    const start = Date.now();
    const responses = await Promise.all(requests);
    const duration = Date.now() - start;

    const allSuccessful = responses.every(r => r.status === 200);

    expect(allSuccessful).toBe(true);
    expect(duration).toBeLessThan(5000); // All complete in 5s
  });
});
```

---

### 7.9.3 Database Query Performance Tests

**Test - tests/performance/database-queries.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('Database Query Performance', () => {
  it('car listing query executes in < 100ms', async () => {
    const start = Date.now();

    await supabase
      .from('cars')
      .select('*')
      .eq('status', 'published')
      .limit(50);

    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });

  it('complex join query with seller profile executes in < 200ms', async () => {
    const start = Date.now();

    await supabase
      .from('cars')
      .select(`
        *,
        seller:profiles!seller_id (
          full_name,
          avatar_url,
          seller_rating
        )
      `)
      .eq('status', 'published')
      .limit(50);

    const duration = Date.now() - start;

    expect(duration).toBeLessThan(200);
  });

  it('full-text search performs efficiently', async () => {
    const start = Date.now();

    await supabase
      .from('cars')
      .select('*')
      .textSearch('make', 'toyota', { type: 'websearch' })
      .limit(50);

    const duration = Date.now() - start;

    expect(duration).toBeLessThan(150);
  });
});
```

---

## 7.10 Accessibility Testing

### 7.10.1 Automated Accessibility Tests

**Test - tests/accessibility/axe-core.test.ts:**

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('car listing page is accessible', async ({ page }) => {
    await page.goto('/cars/test-car');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('forms have proper labels and ARIA attributes', async ({ page }) => {
    await page.goto('/signup');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

### 7.10.2 Keyboard Navigation Tests

**Test - tests/accessibility/keyboard-navigation.test.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('user can navigate entire site using only keyboard', async ({ page }) => {
    await page.goto('/');

    // Tab through navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('href', '/cars');

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('href', '/about');

    // Activate link with Enter
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/about');
  });

  test('skip to main content link works', async ({ page }) => {
    await page.goto('/');

    // First tab should focus skip link
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText(/skip to main content/i);

    // Pressing Enter skips navigation
    await page.keyboard.press('Enter');
    const focusedElement = page.locator(':focus');

    const tagName = await focusedElement.evaluate(el => el.tagName);
    expect(tagName).toBe('MAIN');
  });

  test('modals trap focus', async ({ page }) => {
    await page.goto('/cars/test-car');

    // Open contact seller modal
    await page.click('text=Contact Seller');

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Tab through modal elements
    await page.keyboard.press('Tab'); // Focus close button
    await page.keyboard.press('Tab'); // Focus message input
    await page.keyboard.press('Tab'); // Focus send button
    await page.keyboard.press('Tab'); // Should cycle back to close button

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('aria-label', 'Close');
  });

  test('dropdowns are keyboard accessible', async ({ page }) => {
    await page.goto('/cars');

    // Focus filter dropdown
    const makeSelect = page.locator('select[name="make"]');
    await makeSelect.focus();

    // Open with keyboard
    await page.keyboard.press('Space');

    // Navigate options
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const selectedValue = await makeSelect.inputValue();
    expect(selectedValue).toBeTruthy();
  });
});
```

---

### 7.10.3 Screen Reader Testing

**Test - tests/accessibility/screen-reader.test.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Screen Reader Compatibility', () => {
  test('images have alt text', async ({ page }) => {
    await page.goto('/cars');

    const images = await page.locator('img').all();

    for (const img of images) {
      const altText = await img.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText).not.toBe('image'); // Not generic
    }
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/');

    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      const accessibleName =
        (await button.textContent()) ||
        (await button.getAttribute('aria-label'));

      expect(accessibleName).toBeTruthy();
    }
  });

  test('form inputs have associated labels', async ({ page }) => {
    await page.goto('/signup');

    const inputs = await page.locator('input').all();

    for (const input of inputs) {
      const inputId = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Input must have either: id with label, aria-label, or aria-labelledby
      const hasLabel = inputId || ariaLabel || ariaLabelledBy;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('ARIA landmarks are properly used', async ({ page }) => {
    await page.goto('/');

    // Verify main landmarks exist
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Verify navigation has proper role
    await expect(page.locator('nav')).toHaveCount(1);
  });

  test('dynamic content updates announce to screen readers', async ({ page }) => {
    await page.goto('/messages');

    // Verify live region for new messages
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeInViewport();

    // Simulate new message
    // New message should appear in live region
  });
});
```

---

## 7.11 Internationalization Testing

### 7.11.1 Translation Completeness Tests

**Test - tests/i18n/translations.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { translations } from '@/locales/translations';

describe('Translation Completeness', () => {
  const languages = ['en', 'ko', 'fr', 'sw'];

  it('all languages have same set of keys', () => {
    const enKeys = Object.keys(translations.en);

    for (const lang of languages) {
      if (lang === 'en') continue;

      const langKeys = Object.keys(translations[lang]);

      expect(langKeys.sort()).toEqual(enKeys.sort());
    }
  });

  it('no translation values are empty', () => {
    for (const lang of languages) {
      const entries = Object.entries(translations[lang]);

      for (const [key, value] of entries) {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });

  it('parameter placeholders are consistent across languages', () => {
    const enEntries = Object.entries(translations.en);

    for (const [key, enValue] of enEntries) {
      const enParams = (enValue.match(/\{[^}]+\}/g) || []).sort();

      for (const lang of languages) {
        if (lang === 'en') continue;

        const langValue = translations[lang][key];
        const langParams = (langValue.match(/\{[^}]+\}/g) || []).sort();

        expect(langParams).toEqual(enParams);
      }
    }
  });
});
```

---

### 7.11.2 Language Switching Tests

**Test - e2e/i18n/language-switching.spec.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('user can switch between languages', async ({ page }) => {
    await page.goto('/');

    // Default language (English)
    await expect(page.locator('h1')).toContainText('Connecting Continents');

    // Switch to Korean
    await page.click('[aria-label="Language selector"]');
    await page.click('text=한국어');

    await expect(page.locator('h1')).toContainText('대륙을 연결하고');

    // Switch to French
    await page.click('[aria-label="Language selector"]');
    await page.click('text=Français');

    await expect(page.locator('h1')).toContainText('Relier les Continents');
  });

  test('language preference persists across sessions', async ({ page, context }) => {
    await page.goto('/');

    // Switch to Korean
    await page.click('[aria-label="Language selector"]');
    await page.click('text=한국어');

    // Close and reopen
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('/');

    // Should still be Korean
    await expect(newPage.locator('h1')).toContainText('대륙을 연결하고');
  });

  test('content updates when language changes', async ({ page }) => {
    await page.goto('/cars/test-car');

    const descriptionEn = await page.locator('[data-testid="car-description"]').textContent();

    await page.click('[aria-label="Language selector"]');
    await page.click('text=한국어');

    const descriptionKo = await page.locator('[data-testid="car-description"]').textContent();

    expect(descriptionKo).not.toEqual(descriptionEn);
  });
});
```

---

### 7.11.3 Currency & Date Formatting Tests

**Test - tests/i18n/formatting.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '@/lib/utils/format';

describe('Internationalization Formatting', () => {
  describe('Currency Formatting', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(25000, 'USD')).toBe('$25,000.00');
    });

    it('formats KRW correctly', () => {
      expect(formatCurrency(30000000, 'KRW')).toContain('₩');
    });

    it('formats NGN correctly', () => {
      expect(formatCurrency(10000000, 'NGN')).toContain('₦');
    });
  });

  describe('Date Formatting', () => {
    it('formats date for English locale', () => {
      const formatted = formatDate('2024-01-15', 'en');
      expect(formatted).toMatch(/Jan.*15.*2024/);
    });

    it('formats date for Korean locale', () => {
      const formatted = formatDate('2024-01-15', 'ko');
      expect(formatted).toContain('2024');
    });

    it('formats date for French locale', () => {
      const formatted = formatDate('2024-01-15', 'fr');
      expect(formatted).toContain('janv');
    });
  });
});
```

---

## 7.12 Mobile Testing Strategy

### 7.12.1 Responsive Design Tests

**Test - e2e/mobile/responsive-layout.spec.ts:**

```typescript
import { test, expect, devices } from '@playwright/test';

const viewports = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] },
  { name: 'iPad', ...devices['iPad (gen 7)'] },
  { name: 'Desktop', viewport: { width: 1920, height: 1080 } },
];

for (const device of viewports) {
  test.describe(`Responsive Layout - ${device.name}`, () => {
    test.use(device);

    test('homepage layout adapts correctly', async ({ page }) => {
      await page.goto('/');

      // Verify mobile menu on small screens
      const isMobile = device.viewport.width < 768;
      const mobileMenu = page.locator('[aria-label="Open menu"]');

      if (isMobile) {
        await expect(mobileMenu).toBeVisible();
      } else {
        await expect(mobileMenu).not.toBeVisible();
      }
    });

    test('car cards display appropriately', async ({ page }) => {
      await page.goto('/cars');

      const grid = page.locator('[data-testid="car-grid"]');
      const gridClass = await grid.getAttribute('class');

      if (device.viewport.width < 640) {
        expect(gridClass).toContain('grid-cols-1');
      } else if (device.viewport.width < 1024) {
        expect(gridClass).toContain('grid-cols-2');
      } else {
        expect(gridClass).toContain('grid-cols-3');
      }
    });
  });
}
```

---

### 7.12.2 Touch Interaction Tests

**Test - e2e/mobile/touch-interactions.spec.ts:**

```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Touch Interactions', () => {
  test.use(devices['iPhone 12']);

  test('swipe gesture works on image carousel', async ({ page }) => {
    await page.goto('/cars/test-car');

    const carousel = page.locator('[data-testid="image-carousel"]');
    const firstImage = carousel.locator('img').first();

    const firstSrc = await firstImage.getAttribute('src');

    // Swipe left
    await carousel.dispatchEvent('touchstart', { touches: [{ clientX: 300, clientY: 200 }] });
    await carousel.dispatchEvent('touchmove', { touches: [{ clientX: 100, clientY: 200 }] });
    await carousel.dispatchEvent('touchend');

    await page.waitForTimeout(500);

    const newSrc = await firstImage.getAttribute('src');
    expect(newSrc).not.toBe(firstSrc);
  });

  test('tap targets are minimum 44x44 pixels', async ({ page }) => {
    await page.goto('/');

    const buttons = await page.locator('button, a').all();

    for (const button of buttons) {
      const box = await button.boundingBox();
      if (!box) continue;

      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('pull-to-refresh works on car listings', async ({ page }) => {
    await page.goto('/cars');

    // Simulate pull down
    await page.dispatchEvent('body', 'touchstart', { touches: [{ clientX: 200, clientY: 100 }] });
    await page.dispatchEvent('body', 'touchmove', { touches: [{ clientX: 200, clientY: 300 }] });
    await page.dispatchEvent('body', 'touchend');

    // Verify refresh indicator
    await expect(page.locator('[data-testid="refresh-indicator"]')).toBeVisible();
  });
});
```

---

## 7.13 AI Feature Testing

### 7.13.1 AI Description Generation Tests

**Test - tests/ai/description-generation.test.ts:**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateCarDescription } from '@/lib/ai/description-generator';
import { mockGeminiClient } from '../mocks/gemini';

describe('AI Description Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates description in all 4 languages', async () => {
    const carData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 45000,
      condition: 'excellent',
    };

    const result = await generateCarDescription(carData);

    expect(result.en).toBeTruthy();
    expect(result.ko).toBeTruthy();
    expect(result.fr).toBeTruthy();
    expect(result.sw).toBeTruthy();
  });

  it('includes key vehicle details in description', async () => {
    const carData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 45000,
      condition: 'excellent',
    };

    const result = await generateCarDescription(carData);

    expect(result.en).toContain('Toyota');
    expect(result.en).toContain('Camry');
    expect(result.en).toContain('2020');
  });

  it('handles API errors gracefully', async () => {
    mockGeminiClient.generateContent.mockRejectedValue(new Error('API Error'));

    const carData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
    };

    await expect(generateCarDescription(carData)).rejects.toThrow();
  });

  it('validates minimum description length', async () => {
    const carData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
    };

    const result = await generateCarDescription(carData);

    expect(result.en.length).toBeGreaterThan(100);
  });

  it('caches descriptions to avoid duplicate API calls', async () => {
    const carData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
    };

    await generateCarDescription(carData);
    await generateCarDescription(carData); // Second call

    expect(mockGeminiClient.generateContent).toHaveBeenCalledTimes(1);
  });
});
```

---

### 7.13.2 Message Translation Tests

**Test - tests/ai/message-translation.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { translateMessage } from '@/lib/ai/translator';

describe('Message Translation', () => {
  it('translates English to Korean', async () => {
    const result = await translateMessage(
      'Is this car still available?',
      'en',
      'ko'
    );

    expect(result).toContain('차량');
    expect(result).toContain('구매');
  });

  it('translates Korean to English', async () => {
    const result = await translateMessage(
      '이 차량은 아직 판매 중인가요?',
      'ko',
      'en'
    );

    expect(result.toLowerCase()).toContain('car');
    expect(result.toLowerCase()).toContain('available');
  });

  it('preserves numbers and special characters', async () => {
    const result = await translateMessage(
      'Price: $25,000 - Year: 2020',
      'en',
      'ko'
    );

    expect(result).toContain('25,000');
    expect(result).toContain('2020');
  });

  it('handles very long messages', async () => {
    const longMessage = 'Hello '.repeat(500);

    const result = await translateMessage(longMessage, 'en', 'ko');

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns original if languages are the same', async () => {
    const message = 'Test message';

    const result = await translateMessage(message, 'en', 'en');

    expect(result).toBe(message);
  });
});
```

---

## 7.14 Visual Regression Testing

### 7.14.1 Screenshot Comparison Tests

**Test - e2e/visual/screenshot-comparison.spec.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage matches baseline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('car card component matches baseline', async ({ page }) => {
    await page.goto('/cars');

    const carCard = page.locator('[data-testid="car-card"]').first();
    await expect(carCard).toHaveScreenshot('car-card.png');
  });

  test('mobile menu matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.click('[aria-label="Open menu"]');
    await expect(page.locator('nav')).toHaveScreenshot('mobile-menu.png');
  });

  test('dark mode matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Toggle dark mode"]');

    await expect(page).toHaveScreenshot('homepage-dark.png');
  });
});
```

---

## 7.15 Test Data Management

### 7.15.1 Seed Data Strategy

**Seed Script - tests/seed/seed-database.ts:**

```typescript
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function seedDatabase() {
  // Seed users
  const users = await seedUsers(10);

  // Seed cars
  const cars = await seedCars(50, users);

  // Seed conversations
  await seedConversations(20, users, cars);

  console.log('Database seeded successfully');
}

async function seedUsers(count: number) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const { data } = await supabase.auth.admin.createUser({
      email: faker.internet.email(),
      password: 'testpass123',
      email_confirm: true,
    });

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: faker.person.fullName(),
        role: i < 5 ? 'seller' : 'buyer',
        country: faker.location.country(),
      });

      users.push(data.user);
    }
  }

  return users;
}

async function seedCars(count: number, users: any[]) {
  const sellers = users.filter((_, i) => i < 5);
  const makes = ['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia'];
  const cars = [];

  for (let i = 0; i < count; i++) {
    const make = faker.helpers.arrayElement(makes);

    const { data } = await supabase.from('cars').insert({
      make,
      model: faker.vehicle.model(),
      year: faker.number.int({ min: 2015, max: 2023 }),
      mileage: faker.number.int({ min: 10000, max: 100000 }),
      price: faker.number.int({ min: 15000, max: 50000 }),
      currency: 'USD',
      status: 'published',
      seller_id: faker.helpers.arrayElement(sellers).id,
      images: [faker.image.urlLoremFlickr({ category: 'car' })],
    }).select().single();

    if (data) cars.push(data);
  }

  return cars;
}

async function seedConversations(count: number, users: any[], cars: any[]) {
  const buyers = users.filter((_, i) => i >= 5);
  const sellers = users.filter((_, i) => i < 5);

  for (let i = 0; i < count; i++) {
    const car = faker.helpers.arrayElement(cars);
    const buyer = faker.helpers.arrayElement(buyers);
    const seller = sellers.find(s => s.id === car.seller_id);

    const { data: conversation } = await supabase.from('conversations').insert({
      car_id: car.id,
      buyer_id: buyer.id,
      seller_id: seller.id,
    }).select().single();

    if (conversation) {
      // Add some messages
      for (let j = 0; j < 5; j++) {
        await supabase.from('messages').insert({
          conversation_id: conversation.id,
          sender_id: j % 2 === 0 ? buyer.id : seller.id,
          content: faker.lorem.sentence(),
          language: 'en',
        });
      }
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}
```

---

### 7.15.2 Test Fixtures

**Fixture - tests/fixtures/cars.ts:**

```typescript
import type { Car } from '@/types/database';

export const mockCars: Car[] = [
  {
    id: 'car-1',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 45000,
    price: 25000,
    currency: 'USD',
    status: 'published',
    seller_id: 'seller-1',
    images: ['/test-images/camry-front.jpg'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    description_en: 'Excellent condition Toyota Camry',
    description_ko: '훌륭한 상태의 도요타 캠리',
    description_fr: 'Toyota Camry en excellent état',
    description_sw: 'Toyota Camry katika hali nzuri',
  },
  {
    id: 'car-2',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    mileage: 30000,
    price: 22000,
    currency: 'USD',
    status: 'published',
    seller_id: 'seller-1',
    images: ['/test-images/civic-front.jpg'],
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

export const createMockCar = (overrides?: Partial<Car>): Car => ({
  id: 'test-car',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  mileage: 45000,
  price: 25000,
  currency: 'USD',
  status: 'published',
  seller_id: 'seller-1',
  images: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});
```

---

## 7.16 Continuous Testing & CI/CD

### 7.16.1 GitHub Actions Workflow

**Configuration - .github/workflows/test.yml:**

```yaml
name: Test Suite

on:
  push:
    branches: [main, staging]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  unit-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests

  integration-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run Supabase locally
        run: npx supabase start

      - name: Run integration tests
        run: npm run test:integration
        env:
          SUPABASE_URL: http://localhost:54321
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/cars
          uploadArtifacts: true
```

---

### 7.16.2 Pre-commit Hooks

**Configuration - .husky/pre-commit:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run unit tests for staged files
npm run test -- --run --changed
```

**Package.json:**

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "vitest related --run"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## 7.17 QA Metrics & Reporting

### 7.17.1 Test Coverage Tracking

**Target Metrics:**

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Overall Coverage** | 80% | 0% | ⏳ Pending |
| **Unit Test Coverage** | 85% | 0% | ⏳ Pending |
| **Integration Coverage** | 75% | 0% | ⏳ Pending |
| **E2E Coverage** | 60% | 0% | ⏳ Pending |
| **Critical Path Coverage** | 100% | 0% | ⏳ Pending |

**Reporting:**

- Daily coverage reports generated by Codecov
- Coverage trends tracked over time
- PR comments with coverage diff
- Quality gate: No PR merge if coverage drops >2%

---

### 7.17.2 Defect Density Tracking

**Calculation:**

```
Defect Density = (Total Bugs Found / Total Lines of Code) × 1000
```

**Targets:**

- **Critical Bugs (P0):** 0 per release
- **High Bugs (P1):** < 2 per 1000 LOC
- **Medium Bugs (P2):** < 5 per 1000 LOC
- **Low Bugs (P3):** < 10 per 1000 LOC

---

### 7.17.3 Test Execution Metrics

**Key Performance Indicators:**

| KPI | Target | Measurement |
|-----|--------|-------------|
| **Test Execution Time** | < 20 min (full suite) | CI pipeline duration |
| **Flaky Test Rate** | < 1% | Failed tests / total tests |
| **Test Reliability** | > 99% | Successful runs / total runs |
| **Mean Time to Detect (MTTD)** | < 1 hour | Bug report timestamp - bug introduction |
| **Mean Time to Resolve (MTTR)** | < 24 hours (P0/P1) | Bug fix timestamp - bug report |

---

## 7.18 Bug Management Process

### 7.18.1 Bug Severity Classification

**P0 - Critical (Immediate Fix):**
- Application crashes or doesn't load
- Data loss or corruption
- Security vulnerabilities
- Payment processing failures
- Complete feature breakdown

**P1 - High (Fix within 24 hours):**
- Major feature not working as expected
- Significant user experience degradation
- Performance issues affecting >50% users
- Authentication/authorization issues

**P2 - Medium (Fix within 1 week):**
- Minor feature issues
- UI/UX inconsistencies
- Non-critical performance issues
- Edge case failures

**P3 - Low (Fix when possible):**
- Cosmetic issues
- Nice-to-have improvements
- Documentation errors
- Minor inconsistencies

---

### 7.18.2 Bug Report Template

```markdown
## Bug Report

**Title:** [Brief description]

**Severity:** P0 / P1 / P2 / P3

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- URL: https://skautosphere.com/cars/123

**Steps to Reproduce:**
1. Navigate to...
2. Click on...
3. Enter...
4. Observe...

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Videos:**
[Attach if applicable]

**Console Errors:**
```
[Paste console errors]
```

**Additional Context:**
- User ID: user-123
- Timestamp: 2024-11-10 14:30 UTC
- Session ID: session-456

**Proposed Fix:**
[Optional: If you have ideas]
```

---

### 7.18.3 Bug Lifecycle

```
[New] → [Triaged] → [Assigned] → [In Progress] → [Fixed] → [Verified] → [Closed]
                ↓
            [Duplicate]
            [Won't Fix]
            [Cannot Reproduce]
```

---

## 7.19 Quality Checklist Templates

### 7.19.1 Feature Acceptance Checklist

```markdown
## Feature Acceptance Checklist

**Feature:** [Feature Name]
**Developer:** [Name]
**Reviewer:** [Name]
**Date:** [YYYY-MM-DD]

### Functionality
- [ ] Feature works as specified in requirements
- [ ] All user stories/acceptance criteria met
- [ ] Edge cases handled gracefully
- [ ] Error messages are user-friendly
- [ ] Loading states implemented

### Code Quality
- [ ] Code follows project style guide
- [ ] No ESLint errors or warnings
- [ ] TypeScript compiles without errors
- [ ] No console.log statements in production code
- [ ] Code is well-commented where necessary

### Testing
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests covering critical paths
- [ ] Manual testing completed
- [ ] Tested on multiple browsers

### Performance
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No unnecessary re-renders
- [ ] Images optimized
- [ ] Code splitting implemented where needed

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels added where needed
- [ ] Forms have proper labels

### Internationalization
- [ ] All text externalized to translation files
- [ ] Tested in all 4 languages
- [ ] Date/currency formatting correct
- [ ] RTL support (if applicable)

### Security
- [ ] Input validation implemented
- [ ] XSS prevention measures in place
- [ ] CSRF protection enabled
- [ ] Authentication/authorization checked
- [ ] Sensitive data not exposed

### Documentation
- [ ] README updated (if needed)
- [ ] API documentation updated
- [ ] Comments added for complex logic
- [ ] Changelog updated

### Deployment
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Monitoring/alerts configured

**Approved By:** _______________
**Date:** _______________
```

---

### 7.19.2 Pre-Deployment Checklist

```markdown
## Pre-Deployment Checklist

**Deployment Date:** [YYYY-MM-DD]
**Environment:** Staging / Production
**Version:** [v1.0.0]

### Pre-Deployment
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed and approved
- [ ] QA sign-off received
- [ ] Staging environment tested
- [ ] Performance testing completed
- [ ] Security scan passed (0 critical/high issues)
- [ ] Database backup taken
- [ ] Rollback plan documented

### Configuration
- [ ] Environment variables set
- [ ] Feature flags configured
- [ ] API keys rotated (if needed)
- [ ] CORS settings verified
- [ ] Rate limits configured

### Monitoring
- [ ] Error tracking enabled (Sentry)
- [ ] Performance monitoring active
- [ ] Alerts configured
- [ ] Log aggregation set up
- [ ] Uptime monitoring enabled

### Communication
- [ ] Stakeholders notified of deployment window
- [ ] Support team briefed on changes
- [ ] Release notes prepared
- [ ] User communication drafted (if needed)

### Post-Deployment
- [ ] Smoke tests run on production
- [ ] Critical user flows verified
- [ ] Error rates monitored (first 30 min)
- [ ] Performance metrics checked
- [ ] User feedback collected

**Deployment Approved:** _______________
**Deployed By:** _______________
**Deployment Time:** _______________
```

---

## 7.20 Testing Best Practices

### 7.20.1 Test Naming Conventions

**Pattern:** `describe` blocks for grouping, `it` blocks for specific tests

```typescript
describe('ComponentName or FeatureName', () => {
  describe('SubFeature or Method', () => {
    it('should do something when condition is met', () => {
      // Test implementation
    });

    it('should handle error when input is invalid', () => {
      // Test implementation
    });
  });
});
```

**Examples:**

✅ Good:
```typescript
describe('formatCurrency', () => {
  it('should format USD with dollar sign and two decimals', () => {});
  it('should format KRW without decimals', () => {});
  it('should fall back to USD when currency is unknown', () => {});
});
```

❌ Bad:
```typescript
describe('currency tests', () => {
  it('test 1', () => {});
  it('format', () => {});
});
```

---

### 7.20.2 Test Organization Structure

```
tests/
├── unit/
│   ├── components/
│   │   ├── car/
│   │   │   ├── CarCard.test.tsx
│   │   │   └── CarGrid.test.tsx
│   │   └── layout/
│   ├── hooks/
│   │   └── useTranslation.test.ts
│   └── lib/
│       └── utils/
│           └── format.test.ts
├── integration/
│   ├── api/
│   │   └── cars.test.ts
│   └── database/
│       ├── migrations.test.ts
│       └── rls-policies.test.ts
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── registration.spec.ts
│   ├── cars/
│   │   └── create-listing.spec.ts
│   └── messaging/
│       └── conversation.spec.ts
├── fixtures/
│   ├── cars.ts
│   └── users.ts
└── mocks/
    ├── gemini.ts
    └── supabase.ts
```

---

### 7.20.3 When to Write vs Skip Tests

**Always Write Tests For:**

✅ Business logic and calculations
✅ Data transformations
✅ API endpoints
✅ Authentication/authorization
✅ Payment processing
✅ Critical user flows
✅ Complex UI interactions
✅ Data validation

**Consider Skipping Tests For:**

⚠️ Simple presentational components (pure UI)
⚠️ Third-party library wrappers (unless adding logic)
⚠️ Configuration files
⚠️ Type definitions
⚠️ Mock data/fixtures

**General Rule:** If it has logic, test it. If it's pure display, visual regression test it.

---

### 7.20.4 Mocking Best Practices

**Mock External Dependencies:**

```typescript
// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClientComponentClient: () => mockSupabase,
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
```

**Don't Over-Mock:**

❌ Bad: Mocking everything, including the thing you're testing
```typescript
vi.mock('./formatCurrency'); // Don't mock what you're testing!
```

✅ Good: Only mock external dependencies
```typescript
vi.mock('@/lib/api/exchange-rates'); // Mock external API
```

---

### 7.20.5 Test Maintenance Strategy

**Regular Maintenance Tasks:**

1. **Weekly:**
   - Review and fix flaky tests
   - Update test data/fixtures
   - Check test execution time trends

2. **Monthly:**
   - Review test coverage trends
   - Remove obsolete tests
   - Update E2E tests for UI changes
   - Refresh visual regression baselines

3. **Per Release:**
   - Run full regression suite
   - Update integration tests for API changes
   - Verify all critical paths tested
   - Document new test requirements

---

## 📊 Summary & Implementation Roadmap

### Current Status

| Category | Status | Priority |
|----------|--------|----------|
| **Test Framework Setup** | ⏳ Pending | P0 |
| **Unit Tests** | ⏳ Pending | P0 |
| **Integration Tests** | ⏳ Pending | P1 |
| **E2E Tests** | ⏳ Pending | P1 |
| **CI/CD Integration** | ⏳ Pending | P0 |
| **Security Testing** | ⏳ Pending | P1 |
| **Performance Testing** | ⏳ Pending | P1 |
| **Accessibility Testing** | ⏳ Pending | P2 |

### Implementation Timeline

**Week 1-2: Foundation (P0)**
- Configure Vitest and Playwright
- Set up CI/CD pipeline
- Write first 50 unit tests for utilities and components
- Implement pre-commit hooks

**Week 3-4: Critical Paths (P0)**
- Write E2E tests for auth flows
- Write E2E tests for car listing creation
- Write API integration tests
- Achieve 60% unit test coverage

**Week 5-6: Comprehensive Coverage (P1)**
- Write database integration tests
- Write security tests
- Write performance tests
- Achieve 80% unit test coverage

**Week 7-8: Quality & Polish (P1-P2)**
- Implement accessibility tests
- Set up visual regression testing
- Configure monitoring and reporting
- Achieve 90% critical path coverage

---

**Document Status:** ✅ Ready for Implementation
**Next Steps:** Configure test frameworks and begin writing tests per QA Agent deployment strategy (Section 6)
**Owner:** QA/Test Automation Engineer Agent

---

*This document is a living specification and will be updated as testing strategies evolve and new requirements emerge.*
