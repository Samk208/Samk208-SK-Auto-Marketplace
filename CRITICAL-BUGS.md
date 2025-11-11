# SK AutoSphere - Critical Bugs & Fixes

**Date:** November 11, 2025
**Status:** 6 bugs identified (2 P0, 2 P1, 2 P2)

---

## P0 - MUST FIX BEFORE TESTING (BLOCKERS)

### BUG-001: Field Name Mismatch - Car Creation Will Fail at Runtime

**Severity:** CRITICAL
**File:** `/src/components/seller/ListCarPage.tsx:238`
**Status:** OPEN

**Problem:**
Code tries to access `result.data.seller_id` but the actual database field is `dealer_id`.

**Current Code:**
```typescript
// Line 238 - WRONG
onSubmit?.({ ...car, id: newCarId, dealer_id: result.data.seller_id || '' });
```

**Fix:**
```typescript
// CORRECTED
onSubmit?.({ ...car, id: newCarId, dealer_id: result.data.dealer_id });
```

**Impact:**
- Car is created in database successfully
- BUT UI receives empty string for dealer_id
- User won't see their car in dashboard
- Subsequent operations will fail

**Estimated Fix Time:** 5 minutes
**Assigned To:** Frontend Engineer Agent

---

### BUG-002: TypeScript Build Failure - Cannot Deploy

**Severity:** CRITICAL (blocks deployment)
**Files:** Multiple (48 errors across project)
**Status:** OPEN

**Primary Errors:**

1. **Supabase Type Inference** (10 errors)
   - Files: `auth.ts:240`, `cars.ts:27`, `cars.ts:154`
   - Error: `Argument of type 'any' is not assignable to parameter of type 'never'`

2. **Import Path Issues** (22 errors)
   - Files: `SearchBar.tsx`, `AIRecommendations.tsx`, `ChatModal.tsx`, etc.
   - Error: `Cannot find module '../hooks/useTranslation'`

3. **Type Mismatches** (12 errors)
   - Files: `Header.tsx:131-133`, `SellerDashboard.tsx:27-61`
   - Error: `Property 'full_name' does not exist on type 'never'`

4. **Optional Callbacks** (2 errors)
   - Files: `MyListingsTab.tsx:123`, `:141`
   - Error: `Cannot invoke an object which is possibly 'undefined'`

**Fix Steps:**

**Step 1: Regenerate Supabase Types** (5 minutes)
```bash
npx supabase gen types typescript \
  --project-id teyloksuvmmhqixjqoch \
  > src/types/database.types.ts
```

**Step 2: Fix Import Paths** (30 minutes)
```bash
# Find all files with relative imports
find src/components -type f -name "*.tsx" -o -name "*.ts" | \
  xargs grep -l "from '\.\."

# Replace patterns (manual or script):
# '../hooks/useTranslation' → '@/hooks/useTranslation'
# './ui/Button' → '@/components/ui/Button'
# '../types' → '@/types'
```

**Step 3: Fix Type Assertions** (20 minutes)
```typescript
// In Header.tsx, SellerDashboard.tsx
// Add proper type guards or assertions

// Example fix for Header.tsx:131
const userName = profile?.full_name || 'User';
const userRole = profile?.role || 'buyer';
const avatarUrl = profile?.avatar_url || '';
```

**Step 4: Fix Optional Callbacks** (10 minutes)
```typescript
// In MyListingsTab.tsx:123, :141
// Change:
onEdit(car.id, car);
// To:
onEdit?.(car.id, car);
```

**Step 5: Verify Build** (5 minutes)
```bash
npm run build
```

**Estimated Fix Time:** 1-2 hours
**Assigned To:** Backend Engineer Agent (Step 1), Frontend Engineer Agent (Steps 2-4)

---

## P1 - SHOULD FIX BEFORE PRODUCTION

### BUG-003: Import Path Inconsistencies Across Project

**Severity:** HIGH
**Files:** 22 files in `src/components/`
**Status:** OPEN

**Problem:**
Components use relative imports instead of configured `@/` alias, causing TypeScript errors and making refactoring difficult.

**Examples:**
```typescript
// WRONG (current)
import { useTranslation } from '../hooks/useTranslation'
import { Button } from './ui/Button'
import { Car } from '../types'

// CORRECT (should be)
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/Button'
import { Car } from '@/types'
```

**Affected Files:**
- `src/components/car/SearchBar.tsx`
- `src/components/home/AIRecommendations.tsx`
- `src/components/home/ChatModal.tsx`
- `src/components/home/HowItWorksSection.tsx`
- `src/components/home/Statistics.tsx`
- `src/components/seller/ProfileTab.tsx`
- `src/lib/constants.ts`
- `src/locales/translations.ts`
- And 14 more...

**Fix Script:**
```bash
# Find all relative imports
grep -r "from '\.\." src/components src/lib

# Use sed or manual find-replace:
sed -i "s|from '\.\./hooks/|from '@/hooks/|g" src/components/**/*.tsx
sed -i "s|from '\./ui/|from '@/components/ui/|g" src/components/**/*.tsx
sed -i "s|from '\.\./types'|from '@/types'|g" src/**/*.tsx
```

**Estimated Fix Time:** 30-45 minutes
**Assigned To:** Frontend Engineer Agent

---

### BUG-004: Optional Callbacks Invoked Without Null Check

**Severity:** MEDIUM
**Files:** `src/components/seller/MyListingsTab.tsx:123`, `:141`
**Status:** OPEN

**Problem:**
Callbacks `onEdit` and `onDelete` are invoked directly without checking if they're defined, causing TypeScript errors and potential runtime errors.

**Current Code:**
```typescript
// Line 123
const handleEdit = (car: Car) => {
  onEdit(car.id, car); // ERROR: Cannot invoke possibly undefined
};

// Line 141
const handleDelete = (car: Car) => {
  onDelete(car.id); // ERROR: Cannot invoke possibly undefined
};
```

**Fix:**
```typescript
// Option 1: Optional chaining
const handleEdit = (car: Car) => {
  onEdit?.(car.id, car);
};

// Option 2: Null check
const handleEdit = (car: Car) => {
  if (onEdit) {
    onEdit(car.id, car);
  }
};
```

**Estimated Fix Time:** 10 minutes
**Assigned To:** Frontend Engineer Agent

---

## P2 - NICE TO HAVE (SECURITY & CODE QUALITY)

### BUG-005: Weak Password Validation

**Severity:** LOW (security enhancement)
**File:** `/src/app/actions/auth.ts:11`
**Status:** OPEN

**Problem:**
Password validation only checks minimum length (8 characters), not complexity.

**Current Validation:**
```typescript
password: z.string().min(8, 'Password must be at least 8 characters')
```

**Recommended Enhancement:**
```typescript
password: z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
```

**Impact:**
- Current: Users can create weak passwords like "password"
- Enhanced: Forces stronger passwords

**Estimated Fix Time:** 15 minutes
**Assigned To:** Backend Engineer Agent

---

### BUG-006: Unused Mock Data in Codebase

**Severity:** LOW (code cleanup)
**File:** `/src/lib/constants.ts`
**Status:** OPEN

**Problem:**
`MOCK_SELLERS` array (200+ lines) still exists but is unused after backend integration.

**Impact:**
- Confusing for developers
- Takes up unnecessary space
- Could be accidentally referenced in new code

**Fix:**
Delete lines 15-220 in `src/lib/constants.ts` (the entire MOCK_SELLERS array).

**Verification:**
```bash
# Ensure no references exist
grep -r "MOCK_SELLERS" src/
```

**Estimated Fix Time:** 5 minutes
**Assigned To:** Frontend Engineer Agent

---

## Fix Priority Order

### Immediate (Next 2 Hours)

1. BUG-002 Step 1: Regenerate Supabase types (5 min)
2. BUG-001: Fix field name mismatch (5 min)
3. BUG-002 Step 2: Fix import paths (30 min)
4. BUG-002 Step 3: Fix type assertions (20 min)
5. BUG-002 Step 4: Fix optional callbacks (10 min)
6. BUG-002 Step 5: Verify build succeeds (5 min)

**Total Time:** ~1.5 hours

### After Build Succeeds (Functional Testing Phase)

7. Run manual functional tests (2 hours)
8. Fix any bugs discovered during testing

### Before Production Deployment

9. BUG-005: Enhance password validation (15 min)
10. BUG-006: Remove mock data (5 min)
11. Add unit and E2E tests (8-12 hours)

---

## Bug Tracking Status

| Bug ID | Priority | Status | Assignee | ETA |
|--------|----------|--------|----------|-----|
| BUG-001 | P0 | OPEN | Frontend | 5 min |
| BUG-002 | P0 | OPEN | Backend + Frontend | 1.5 hrs |
| BUG-003 | P1 | OPEN | Frontend | 45 min |
| BUG-004 | P1 | OPEN | Frontend | 10 min |
| BUG-005 | P2 | OPEN | Backend | 15 min |
| BUG-006 | P2 | OPEN | Frontend | 5 min |

**Total Estimated Fix Time:** 2.5 - 3 hours

---

## Verification Checklist

After all fixes applied:

- [ ] Run `npm run type-check` - expect 0 errors
- [ ] Run `npm run lint` - expect 0 errors
- [ ] Run `npm run build` - expect success
- [ ] Test signup flow manually
- [ ] Test car creation flow manually
- [ ] Test dashboard view manually
- [ ] Verify images upload successfully
- [ ] Check Supabase database has correct data
- [ ] Deploy to staging environment
- [ ] Run smoke tests on staging

---

**Last Updated:** November 11, 2025
**Next Review:** After P0 bugs fixed
