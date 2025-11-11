# SK AutoSphere - Quick Fix Guide for Deployment

**Target:** Get application to production-ready state
**Current Status:** Build fails, cannot deploy
**Estimated Time:** 2-3 hours
**Difficulty:** Medium

---

## Prerequisites

- Node.js and npm installed
- Supabase CLI installed (`npm install -g supabase`)
- Access to Supabase project: `teyloksuvmmhqixjqoch`
- Write access to repository

---

## Step-by-Step Fix Instructions

### Phase 1: Critical Blocker Fixes (1.5 hours)

#### Fix 1: Regenerate Supabase Types (5 minutes)

**Problem:** Manually created types don't match live database schema

**Solution:**
```bash
# Navigate to project root
cd /home/user/Samk208-SK-Auto-Marketplace

# Generate types from live Supabase database
npx supabase gen types typescript \
  --project-id teyloksuvmmhqixjqoch \
  --schema public \
  > src/types/database.types.ts

# Verify file was created
cat src/types/database.types.ts | head -50
```

**Expected Result:** New `database.types.ts` file with proper type definitions

---

#### Fix 2: Fix Field Name Bug (5 minutes)

**Problem:** Code references `seller_id` but database uses `dealer_id`

**Solution:**
```bash
# Open the file
# File: src/components/seller/ListCarPage.tsx

# Find line 238 and change:
# FROM:
onSubmit?.({ ...car, id: newCarId, dealer_id: result.data.seller_id || '' });

# TO:
onSubmit?.({ ...car, id: newCarId, dealer_id: result.data.dealer_id });
```

**Using sed (automated):**
```bash
sed -i 's/result\.data\.seller_id/result.data.dealer_id/g' \
  src/components/seller/ListCarPage.tsx
```

**Verify:**
```bash
grep -n "dealer_id" src/components/seller/ListCarPage.tsx
# Should show line 238 with correct code
```

---

#### Fix 3: Update Import Paths (30 minutes)

**Problem:** 22 files use relative imports instead of `@/` alias

**Solution - Automated (recommended):**
```bash
# Navigate to project root
cd /home/user/Samk208-SK-Auto-Marketplace

# Fix hook imports
find src/components -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i "s|from '\.\./hooks/useTranslation'|from '@/hooks/useTranslation'|g" {} \;

# Fix UI component imports
find src/components -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i "s|from '\./ui/|from '@/components/ui/|g" {} \;

# Fix type imports
find src -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i "s|from '\.\./types'|from '@/types'|g" {} \;

find src -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i "s|from '\./types'|from '@/types'|g" {} \;

# Fix specific component imports
sed -i "s|from '\./CarCard'|from '@/components/car/CarCard'|g" \
  src/components/home/AIRecommendations.tsx

sed -i "s|from '\./ui/Skeleton'|from '@/components/ui/Skeleton'|g" \
  src/components/home/AIRecommendations.tsx

sed -i "s|from '\./ui/Dialog'|from '@/components/ui/Dialog'|g" \
  src/components/home/ChatModal.tsx

sed -i "s|from '\./ui/Input'|from '@/components/ui/Input'|g" \
  src/components/home/ChatModal.tsx
```

**Verify:**
```bash
# Check no relative imports remain in components
grep -r "from '\.\." src/components | wc -l
# Should output 0 or close to 0
```

---

#### Fix 4: Fix Type Assertions (20 minutes)

**Problem:** Profile/user data has `never` type due to type inference issues

**File 1: src/components/layout/Header.tsx**

Lines 131-133 - Add type guards:
```typescript
// BEFORE (lines 131-133):
const userName = profile.full_name || 'User';
const userRole = profile.role;
const avatarUrl = profile.avatar_url;

// AFTER:
const userName = profile?.full_name || 'User';
const userRole = profile?.role || 'buyer';
const avatarUrl = profile?.avatar_url || '';
```

**File 2: src/components/seller/SellerDashboard.tsx**

Line 27 - Add type guard:
```typescript
// BEFORE:
if (profile?.role !== 'seller') {

// AFTER:
if (profile?.role !== 'seller') {
```

Lines 50-61 - Add safe access:
```typescript
// BEFORE:
const user: User = {
  id: profile.id,
  email: '',
  full_name: profile.full_name,
  avatar_url: profile.avatar_url,
  role: profile.role,
  phone_number: profile.phone_number,
  country: profile.country,
  business_description: profile.business_description,
};

// AFTER:
const user: User = {
  id: profile?.id || '',
  email: '',
  full_name: profile?.full_name || '',
  avatar_url: profile?.avatar_url || '',
  role: profile?.role || 'buyer',
  phone_number: profile?.phone_number || '',
  country: profile?.country || '',
  business_description: profile?.business_description || '',
};
```

---

#### Fix 5: Fix Optional Callbacks (10 minutes)

**File: src/components/seller/MyListingsTab.tsx**

Lines 123, 141 - Add optional chaining:
```typescript
// BEFORE (line 123):
onEdit(car.id, car);

// AFTER:
onEdit?.(car.id, car);

// BEFORE (line 141):
onDelete(car.id);

// AFTER:
onDelete?.(car.id);
```

**Using sed:**
```bash
sed -i 's/onEdit(car\.id, car)/onEdit?.(car.id, car)/g' \
  src/components/seller/MyListingsTab.tsx

sed -i 's/onDelete(car\.id)/onDelete?.(car.id)/g' \
  src/components/seller/MyListingsTab.tsx
```

---

#### Fix 6: Verify Build (5 minutes)

**Test TypeScript compilation:**
```bash
npm run type-check
```

**Expected Output:**
```
> sk-autosphere-nextjs@0.1.0 type-check
> tsc --noEmit

(no errors)
```

**Test Build:**
```bash
npm run build
```

**Expected Output:**
```
> sk-autosphere-nextjs@0.1.0 build
> next build

✓ Compiled successfully in Xs
...
✓ Creating an optimized production build
```

If build succeeds, **Phase 1 is COMPLETE!**

---

### Phase 2: Code Cleanup (30 minutes)

#### Cleanup 1: Remove Mock Data (5 minutes)

**File:** `src/lib/constants.ts`

**Delete MOCK_SELLERS array** (lines 15-220 approximately):
```bash
# Option 1: Manual
# Open file and delete the MOCK_SELLERS array

# Option 2: Automated (if structure is consistent)
# Create a new constants.ts without mock data
```

**Verify no references:**
```bash
grep -r "MOCK_SELLERS" src/
# Should return no results or only the definition
```

---

#### Cleanup 2: Enhance Password Validation (15 minutes)

**File:** `src/app/actions/auth.ts`

**Line 11 - Update password schema:**
```typescript
// BEFORE:
password: z.string().min(8, 'Password must be at least 8 characters'),

// AFTER:
password: z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
```

**Test:**
```bash
# After implementing, test signup with weak password
# Should reject "password123"
# Should accept "Password123!"
```

---

### Phase 3: Functional Testing (1-2 hours)

Now that build succeeds, test the application manually:

#### Test 1: Development Server (2 minutes)

```bash
npm run dev
```

Navigate to `http://localhost:3000`

Expected: Homepage loads without errors

---

#### Test 2: Authentication Flow (10 minutes)

**Sign Up:**
1. Click "Sign Up" button in header
2. Fill form:
   - Email: `test-qa-nov11@example.com`
   - Password: `TestPass123!`
   - Full Name: `QA Test User`
   - Role: `Seller`
3. Click "Create Account"

**Expected:**
- Success message appears
- User logged in
- Header shows user name and avatar
- No console errors

**Verify in Supabase:**
```bash
# In Supabase dashboard > Authentication > Users
# Should see new user with email test-qa-nov11@example.com

# In Table Editor > profiles
# Should see new profile with role = 'seller'
```

---

#### Test 3: Car Listing Creation (15 minutes)

**Prerequisites:** Logged in as seller

**Steps:**
1. Navigate to `/list-car`
2. Fill form:
   - Make: `Hyundai`
   - Model: `Sonata`
   - Year: `2023`
   - Price: `25000`
   - Currency: `USD`
   - Location Country: `South Korea`
   - Location City: `Seoul`
   - Description: `Test car listing for QA validation`
3. Upload 2-3 test images (JPEG/PNG)
4. Click "List Car"

**Expected:**
- Image previews appear
- "Main" badge on first image
- Images compress (check browser DevTools network tab - should be <1MB each)
- Success message: "Car listed successfully"
- Redirect to `/seller-dashboard`
- Car appears in dashboard listings

**Verify in Supabase:**
```sql
-- In Supabase SQL Editor:
SELECT * FROM cars WHERE dealer_id = 'YOUR_USER_ID_HERE' ORDER BY created_at DESC LIMIT 1;

-- Should show:
-- make: Hyundai
-- model: Sonata
-- status: published (or draft, depending on form)
-- images: array of URLs
-- dealer_id: matches your user ID
```

**Verify in Storage:**
```
Supabase Dashboard > Storage > car-images
- Navigate to: {your-user-id}/{car-id}/
- Should see uploaded image files with timestamps
```

**Common Issues:**
- **Error: "Only sellers can create"** → Check user role in profiles table
- **Images don't upload** → Check browser console for errors, verify .env.local has Supabase keys
- **Redirect fails** → Check browser console, verify Next.js router is working

---

#### Test 4: Dashboard Operations (10 minutes)

**Prerequisites:** At least one car created

**View Listings:**
1. Navigate to `/seller-dashboard`
2. Click "My Listings" tab

**Expected:**
- Your created car appears
- Shows make, model, price
- Shows status badge
- Shows thumbnail image

**Delete Car:**
1. Click "Delete" button on a car
2. Confirm deletion in dialog

**Expected:**
- Confirmation dialog appears
- After confirm, car removed from list
- Success toast: "Car deleted successfully"
- List refreshes automatically (React Query refetch)

**Verify in Supabase:**
```sql
-- In Supabase SQL Editor:
SELECT * FROM cars WHERE id = 'DELETED_CAR_ID';

-- Should return 0 rows (car deleted from database)
```

---

#### Test 5: Homepage Featured Cars (5 minutes)

**Setup:**
First, mark a car as featured in Supabase:
```sql
-- In Supabase SQL Editor:
UPDATE cars SET featured = true WHERE id = 'YOUR_CAR_ID';
```

**Test:**
1. Navigate to homepage (`/`)
2. Scroll to "Featured Cars" section

**Expected:**
- Featured car appears
- Shows image, make, model, price
- Shows location (country, city)
- Shows dealer info if available

**Common Issue:**
- **No cars show** → Check that at least one car has `status = 'published'` AND `featured = true`

---

#### Test 6: Security Validation (15 minutes)

**Test RLS Policies:**

1. **Test: Buyer cannot create cars**
   - Log out
   - Sign up as buyer (role: `buyer`)
   - Try to navigate to `/list-car`
   - Expected: Redirected or error "Only sellers can create"

2. **Test: User cannot edit other's cars**
   - Create car as Seller A
   - Log out, log in as Seller B
   - Try to edit Seller A's car via API/direct URL
   - Expected: 403 Forbidden or no access

3. **Test: User cannot view other's favorites**
   - Add favorite as User A
   - Log out, log in as User B
   - Check favorites
   - Expected: Only User B's favorites shown

**Verify:**
```bash
# Check browser console for any unauthorized API calls
# Should see errors if RLS policies are working correctly
```

---

### Phase 4: Pre-Deployment Checklist (10 minutes)

Before deploying to production:

- [ ] All TypeScript errors resolved (`npm run type-check` passes)
- [ ] Build succeeds (`npm run build` completes)
- [ ] ESLint passes (`npm run lint`)
- [ ] Authentication works (signup, login, logout)
- [ ] Car creation works with image upload
- [ ] Dashboard shows correct data
- [ ] Delete functionality works
- [ ] Featured cars appear on homepage
- [ ] RLS policies prevent unauthorized access
- [ ] No console errors in browser DevTools
- [ ] Environment variables configured in deployment platform (Netlify/Vercel)
- [ ] Supabase project in production mode
- [ ] Database migrations applied to production database

---

## Troubleshooting Common Issues

### Issue: Type check still shows errors after regenerating types

**Solution:**
```bash
# Clear TypeScript cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Try build again
npm run build
```

---

### Issue: Import paths still have errors

**Solution:**
```bash
# Check tsconfig.json has correct paths
cat tsconfig.json | grep -A 5 "paths"

# Should show:
# "paths": {
#   "@/*": ["./src/*"]
# }

# Restart TypeScript server in VSCode:
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

### Issue: Images don't upload

**Solution:**
```bash
# Check environment variables
cat .env.local | grep SUPABASE

# Verify Supabase Storage bucket exists
# Supabase Dashboard > Storage > Should see "car-images" bucket

# Check RLS policies on Storage
# Storage > car-images > Policies
# Should allow authenticated users to upload
```

---

### Issue: Car creation returns "Only sellers can create"

**Solution:**
```sql
-- In Supabase SQL Editor:
-- Check user role
SELECT id, full_name, role FROM profiles WHERE id = 'YOUR_USER_ID';

-- Update role to seller if needed
UPDATE profiles SET role = 'seller' WHERE id = 'YOUR_USER_ID';
```

---

## Success Criteria

Application is ready for production when:

1. **Build:** `npm run build` succeeds with 0 errors
2. **Tests:** All manual functional tests pass
3. **Security:** RLS policies prevent unauthorized access
4. **Performance:** Homepage loads in <3 seconds
5. **Data:** Cars created successfully appear in database and UI
6. **Images:** Images upload and display correctly

---

## Estimated Timeline

| Phase | Tasks | Time |
|-------|-------|------|
| Phase 1 | Fix critical blockers | 1.5 hours |
| Phase 2 | Code cleanup | 30 minutes |
| Phase 3 | Functional testing | 1-2 hours |
| Phase 4 | Pre-deployment checks | 10 minutes |
| **Total** | | **3-4 hours** |

---

## Next Steps After This Guide

1. **Deploy to Staging:**
   ```bash
   # Push to staging branch
   git add .
   git commit -m "fix: resolve TypeScript errors and critical bugs"
   git push origin staging
   ```

2. **Set up CI/CD:**
   - Configure GitHub Actions for automated testing
   - Add Lighthouse CI for performance checks
   - Set up Playwright for E2E tests

3. **Production Deployment:**
   - Deploy to Netlify/Vercel
   - Configure production environment variables
   - Run smoke tests on production URL
   - Monitor with Sentry or similar

---

**For Questions:**
Refer to `/home/user/Samk208-SK-Auto-Marketplace/QA-TEST-REPORT.md` for detailed findings
Refer to `/home/user/Samk208-SK-Auto-Marketplace/CRITICAL-BUGS.md` for bug details

**Good luck with the fixes!**
