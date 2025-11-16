# Query Pattern Reference - FK-Free Approach

Quick reference for fetching cars with dealer information in SK AutoSphere.

---

## Pattern Overview

**DO NOT USE:** Foreign key join syntax (causes 400 errors)
**USE INSTEAD:** Separate fetch + application-level merge

---

## The Pattern

### Step 1: Fetch Cars
```typescript
const { data: carsData, error } = await supabase
  .from('cars')
  .select('*')
  .eq('status', 'published')
  // Add your filters here
  .order('created_at', { ascending: false });

if (error) throw new Error('Failed to fetch cars');
if (!carsData || carsData.length === 0) return [];
```

### Step 2: Extract Unique Dealer IDs
```typescript
const dealerIds = [...new Set(carsData.map(car => car.dealer_id))];
```

### Step 3: Fetch Profiles
```typescript
const { data: profilesData } = await supabase
  .from('profiles')
  .select('id, full_name, avatar_url, seller_rating, verification_status')
  .in('id', dealerIds);
```

### Step 4: Create Lookup Map
```typescript
const profilesMap = new Map(
  (profilesData || []).map(profile => [profile.id, profile])
);
```

### Step 5: Merge Data
```typescript
const carsWithDealers = carsData.map(car => ({
  ...car,
  dealer: profilesMap.get(car.dealer_id) || null
})) as Car[];

return carsWithDealers;
```

---

## Complete Examples

### Example 1: Featured Cars
```typescript
export function useFeaturedCars() {
  return useQuery({
    queryKey: ['cars', 'featured'],
    queryFn: async () => {
      const supabase = createClient();

      // Step 1: Fetch cars
      const { data: carsData, error } = await supabase
        .from('cars')
        .select('*')
        .eq('featured', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw new Error('Failed to load featured vehicles');
      if (!carsData || carsData.length === 0) return [];

      // Step 2-3: Fetch profiles
      const dealerIds = [...new Set(carsData.map(car => car.dealer_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, seller_rating, verification_status')
        .in('id', dealerIds);

      // Step 4-5: Merge
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      return carsData.map(car => ({
        ...car,
        dealer: profilesMap.get(car.dealer_id) || null
      })) as Car[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

### Example 2: Single Car Detail
```typescript
export function useCarDetail(id: string | null) {
  return useQuery({
    queryKey: ['cars', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Car ID required');
      const supabase = createClient();

      // Step 1: Fetch car
      const { data: carData, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error('Failed to load vehicle details');

      // Step 2: Fetch single profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, seller_rating, verification_status')
        .eq('id', carData.dealer_id)
        .single();

      // Step 3: Merge
      return {
        ...carData,
        dealer: profileData || null
      } as Car;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
```

### Example 3: Search/Filter with Pagination
```typescript
export function useCarSearch(filters: CarSearchInput) {
  return useQuery({
    queryKey: ['cars', 'list', filters],
    queryFn: async () => {
      const supabase = createClient();

      // Step 1: Build query with filters
      let query = supabase
        .from('cars')
        .select('*')
        .eq('status', 'published');

      if (filters.make) query = query.ilike('make', `%${filters.make}%`);
      if (filters.model) query = query.ilike('model', `%${filters.model}%`);
      if (filters.minPrice) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice);

      const { data: carsData, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw new Error('Failed to search vehicles');
      if (!carsData || carsData.length === 0) return [];

      // Step 2-5: Same as above
      const dealerIds = [...new Set(carsData.map(car => car.dealer_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, seller_rating, verification_status')
        .in('id', dealerIds);

      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      return carsData.map(car => ({
        ...car,
        dealer: profilesMap.get(car.dealer_id) || null
      })) as Car[];
    },
    staleTime: 2 * 60 * 1000,
  });
}
```

---

## Server Component Example

For Next.js Server Components (e.g., `/app/cars/page.tsx`):

```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function CarsPage() {
  const supabase = await createServerSupabaseClient();

  // Step 1: Fetch cars
  const { data: carsData, error } = await supabase
    .from('cars')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error || !carsData || carsData.length === 0) {
    return <div>No cars found</div>;
  }

  // Step 2-3: Fetch profiles
  const dealerIds = [...new Set(carsData.map(car => car.dealer_id))];
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', dealerIds);

  // Step 4-5: Merge
  const profilesMap = new Map(
    (profilesData || []).map(profile => [profile.id, profile])
  );

  const cars = carsData.map(car => ({
    ...car,
    profiles: profilesMap.get(car.dealer_id) || null
  }));

  return <CarsGrid cars={cars} />;
}
```

---

## Profile Fields Reference

Always select these fields from `profiles`:

```typescript
.select('id, full_name, avatar_url, seller_rating, verification_status')
```

| Field | Type | Purpose |
|-------|------|---------|
| `id` | `string` | Dealer UUID (for mapping) |
| `full_name` | `string \| null` | Dealer display name |
| `avatar_url` | `string \| null` | Profile picture URL |
| `seller_rating` | `number \| null` | Star rating (0-5) |
| `verification_status` | `'unverified' \| 'pending' \| 'verified' \| 'rejected' \| null` | KYC status |

**Note:** Do NOT use `verified` field - it doesn't exist in the schema.

---

## What NOT to Do

### ❌ WRONG: FK Join Syntax
```typescript
// This will fail with 400 error
const { data } = await supabase
  .from('cars')
  .select(`
    *,
    dealer:profiles!cars_dealer_id_fkey(*)
  `);
```

### ❌ WRONG: Simple Join
```typescript
// This will also fail (no FK exists)
const { data } = await supabase
  .from('cars')
  .select('*, profiles(*)');
```

### ❌ WRONG: Inner Join
```typescript
// Not supported by PostgREST without FK
const { data } = await supabase
  .from('cars')
  .select('*, dealer:profiles(*)');
```

---

## Why This Pattern?

1. **No FK Constraint:** The database doesn't have a foreign key between `cars.dealer_id` and `profiles.id`
2. **PostgREST Requirement:** Supabase PostgREST requires explicit FK for join syntax
3. **Reliability:** Separate fetches always work, regardless of schema
4. **Minimal Overhead:** 2 requests vs 1, but deduplicates dealer fetches
5. **Type Safety:** Works perfectly with existing `Car` type

---

## Performance Considerations

### Network Overhead
- **Requests:** 2 (cars + profiles)
- **Typical Time:** 150-200ms total
- **Data Size:** 3-5KB for featured cars
- **Optimization:** Profiles are fetched once per unique dealer

### Caching
- TanStack Query caches both requests
- Stale time prevents unnecessary refetches
- Query keys ensure proper invalidation

### When to Optimize
- If fetching 100+ cars regularly
- If dealers are highly fragmented (many unique dealer_ids)
- If network latency is > 500ms consistently

**Current Verdict:** No optimization needed for typical usage

---

## Troubleshooting

### Issue: Dealer is always `null`
**Cause:** Wrong profile field names
**Fix:** Use `verification_status`, not `verified`

### Issue: Duplicate profiles fetched
**Cause:** Forgot to deduplicate dealer IDs
**Fix:** Use `[...new Set(carsData.map(car => car.dealer_id))]`

### Issue: Type error on `Car`
**Cause:** Missing `dealer` field in returned object
**Fix:** Always include `dealer: profilesMap.get(...) || null`

### Issue: Profile fetch fails silently
**Cause:** Error not handled for profiles
**Fix:** Check `profilesData || []` for safety

---

## Summary

Always use this 5-step pattern when fetching cars with dealer info:

1. Fetch cars
2. Extract dealer IDs (deduplicated)
3. Fetch profiles
4. Create map
5. Merge

**Copy the examples above for consistency across the codebase.**

---

**Last Updated:** November 16, 2025
