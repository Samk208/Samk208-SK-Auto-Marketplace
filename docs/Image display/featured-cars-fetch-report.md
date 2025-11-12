# Homepage Featured Cars Integration – Investigation Report  
_Date: November 12, 2025_  

---

## 1. Context
- Goal: replace the placeholder homepage list with Supabase-backed featured cars.  
- Implementation attempt (commit-in-progress):
  - `src/app/page.tsx`: added `getFeaturedCars()` using Supabase server client and a join on `profiles`.
  - UI components updated (e.g., `CarCard`) for resilient image handling and hydration fixes.
  - `next.config.ts`: remote image domains configured for Unsplash and Supabase.
- Database state before testing:
  - Seed script inserted 5 cars (`featured=true` on 2) for dealer `d5917cbd-aa6b-4492-b21e-cb40f56ebca7`.
  - Attempted to add FK `cars_dealer_id_fkey` (with `ON DELETE SET NULL`).

## 2. What We Observed
| Observation | Details |
|-------------|---------|
| Console overlay | “A tree hydrated…” warning initially resolved by normalizing SVG `viewBox`. |
| Runtime error (current blocker) | `PGRST200: Could not find a relationship between 'cars' and 'profiles' using the hint 'cars_dealer_id_fkey'`. Logged from `getFeaturedCars()` (line 49). |
| UI effect | Featured list stays empty (“No Featured Cars Yet”). |
| Terminal logs | Repeated messages: `Searched for a foreign key relationship ... hint: Perhaps you meant 'favorites' instead of 'profiles'.` |
| TypeScript check | `npm run type-check` fails with numerous pre-existing path + typing issues (see `typecheck-report.txt`). Not addressed in this iteration. |

## 3. Analysis
1. **Supabase join hint mismatch**  
   - The query uses `profiles!cars_dealer_id_fkey`.  
   - Error indicates no such FK in the schema cache → either the constraint was never applied or is named differently.  
   - The inline PL/pgSQL block that adds the FK may have failed silently (wrapped in DO block without logging). Current schema likely still lacks the FK.

2. **Fallback path**  
   - Because `error` is truthy, the data resolver returns `{ cars: [], sellers: [] }`, so the UI sees an empty array and renders the empty state.

3. **Additional warnings**  
   - Browser console: unused preload (`https://picsum.photos/...`) originates from existing hero background logic; unrelated but worth cleanup later.

## 4. Evidence (key snippets)
```text
[home] featured cars fetch failed {
  code: 'PGRST200',
  details: "Searched for a foreign key relationship between 'cars' and 'profiles' using the hint 'cars_dealer_id_fkey' in the schema 'public', but no matches were found.",
  hint: "Perhaps you meant 'favorites' instead of 'profiles'.",
  message: "Could not find a relationship between 'cars' and 'profiles' in the schema cache"
}
```

```ts
// src/app/page.tsx (current)
const { data, error } = await supabase
  .from('cars')
  .select(`
    *,
    dealer:profiles!cars_dealer_id_fkey ( ... )
  `)
  .eq('status', 'published')
  .eq('featured', true);
```

## 5. Root-Cause Hypothesis
The homepage code is functioning as expected but depends on a Supabase relationship named `cars_dealer_id_fkey`. That foreign key was not present (or has a different name), so PostgREST cannot join `profiles`. Without data, the component renders its empty state.  

## 6. Recommended Next Steps (deferred)
1. **Confirm schema**  
   - Run: `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='cars' AND constraint_type='FOREIGN KEY';`
   - If absent, add FK explicitly (outside of a nested DO block to surface errors):  
     ```sql
     ALTER TABLE public.cars
       ADD CONSTRAINT cars_dealer_id_fkey
       FOREIGN KEY (dealer_id) REFERENCES public.profiles(id)
       ON UPDATE CASCADE
       ON DELETE SET NULL;
     ```
   - Re-run Supabase migration/CLI `db pull` to sync types.
2. **Short-term unblock**  
   - If FK cannot be added immediately, adjust the query to select dealer details via a second request (or use `select('*, profiles(*)')` with `eq('dealer_id', ...)` post-process).  
3. **Clean up seed script**  
   - Ensure future seeds verify constraint existence and log successes/failures.
4. **Type-check debt**  
   - Schedule separate pass to resolve path alias issues and ID typing inconsistencies (e.g., `useFavorites` currently expects numeric IDs).

## 7. Status
- **Fix outcome:** Not yet successful – homepage still shows empty state.  
- **Next session:** Resume after schema verification or query refactor.  

Prepared by: ChatGPT (engineering agent)  
Location: `docs/Image display/featured-cars-fetch-report.md`

