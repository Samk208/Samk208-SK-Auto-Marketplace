# SK AutoSphere - Database Schema Documentation

**Last Updated:** 2025-01-09
**Database:** PostgreSQL (Supabase)
**Project:** SK AutoSphere - Korean-African Automotive Marketplace

---

## 📊 Current Schema (Phase 2 - Baseline)

### Tables Overview

| Table | Purpose | Row Count (Est.) | Status |
|-------|---------|------------------|--------|
| `profiles` | User profiles (buyers & sellers) | ~1,000 | ✅ Implemented |
| `cars` | Vehicle listings | ~500 | ✅ Implemented |
| `conversations` | Chat threads | ~200 | ❌ Pending |
| `messages` | Individual messages | ~5,000 | ❌ Pending |
| `favorites` | Saved listings | ~300 | ❌ Pending |

---

## 🗃️ Table: `profiles`

**Purpose:** Stores user profile information for both buyers and sellers.

**Relationships:**
- Primary key: `id` (references `auth.users.id`)
- Referenced by: `cars.dealer_id`, `messages.sender_id`

### Schema

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ,
  role TEXT CHECK (role IN ('buyer', 'seller', 'admin'))
);
```

### Fields

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | No | - | User ID (from auth.users) |
| `full_name` | TEXT | Yes | NULL | User's full name |
| `avatar_url` | TEXT | Yes | NULL | Profile picture URL |
| `updated_at` | TIMESTAMPTZ | Yes | NULL | Last profile update timestamp |
| `role` | TEXT | Yes | NULL | User role: 'buyer', 'seller', or 'admin' |

### Missing Fields (To Add in Phase 2)

| Field Name | Type | Purpose | Priority |
|------------|------|---------|----------|
| `language_preference` | TEXT | UI language (en/ko/fr/sw) | P0 |
| `country` | TEXT | User's country | P0 |
| `phone_number` | TEXT | Contact phone | P1 |
| `verification_status` | TEXT | KYC verification level | P1 |
| `seller_rating` | NUMERIC | Average rating (1-5) | P2 |
| `business_name` | TEXT | For sellers: company name | P2 |
| `business_registration` | TEXT | For sellers: registration number | P2 |

### Row Level Security (RLS)

```sql
-- Everyone can view profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Sample Query

```typescript
// Fetch current user's profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// Update profile
const { error } = await supabase
  .from('profiles')
  .update({ full_name: 'John Doe', language_preference: 'en' })
  .eq('id', user.id);
```

---

## 🚗 Table: `cars`

**Purpose:** Stores vehicle listings created by sellers.

**Relationships:**
- Primary key: `id` (UUID)
- Foreign key: `dealer_id` → `profiles.id`

### Schema

```sql
CREATE TABLE public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  price NUMERIC NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT,
  location_country TEXT NOT NULL,
  location_city TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold', 'archived')),
  specifications JSONB,
  dealer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);
```

### Fields

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | No | gen_random_uuid() | Unique listing ID |
| `make` | TEXT | No | - | Car manufacturer (e.g., "Toyota") |
| `model` | TEXT | No | - | Car model (e.g., "Camry") |
| `year` | INTEGER | No | - | Manufacturing year (1900-2030) |
| `price` | NUMERIC | No | - | Asking price (must be ≥ 0) |
| `currency` | TEXT | No | 'USD' | Price currency (USD, KRW, etc.) |
| `description` | TEXT | Yes | NULL | Vehicle description (single language) |
| `location_country` | TEXT | No | - | Vehicle location country |
| `location_city` | TEXT | No | - | Vehicle location city |
| `images` | TEXT[] | No | `{}` | Array of image URLs |
| `status` | TEXT | No | 'draft' | Listing status |
| `specifications` | JSONB | Yes | NULL | Technical specs (flexible JSON) |
| `dealer_id` | UUID | No | - | Seller's profile ID |
| `created_at` | TIMESTAMPTZ | No | now() | Listing creation timestamp |
| `updated_at` | TIMESTAMPTZ | Yes | NULL | Last update timestamp |

### Status Enum Values

| Status | Description | Visible to Buyers? |
|--------|-------------|-------------------|
| `draft` | Incomplete listing | ❌ No |
| `published` | Active listing | ✅ Yes |
| `sold` | Sold vehicle | ❌ No (archive view) |
| `archived` | Removed by seller | ❌ No |

### Specifications JSONB Structure

```json
{
  "engine": "2.0L Inline-4",
  "transmission": "Automatic",
  "mileage": 45000,
  "fuel_type": "Gasoline",
  "body_type": "Sedan",
  "exterior_color": "White",
  "interior_color": "Black",
  "drive_type": "FWD",
  "doors": 4,
  "seats": 5,
  "vin": "1HGBH41JXMN109186"
}
```

### Missing Fields (To Add in Phase 2)

| Field Name | Type | Purpose | Priority |
|------------|------|---------|----------|
| `description_en` | TEXT | English description | P0 |
| `description_fr` | TEXT | French description | P0 |
| `description_sw` | TEXT | Swahili description | P0 |
| `featured` | BOOLEAN | Show on homepage | P1 |
| `view_count` | INTEGER | Number of views | P1 |
| `inquiry_count` | INTEGER | Number of inquiries | P1 |
| `ai_generated` | BOOLEAN | AI description flag | P2 |
| `shipping_available` | BOOLEAN | Can be shipped | P2 |

### Row Level Security (RLS)

```sql
-- Anyone can view published cars
CREATE POLICY "Published cars are viewable by everyone"
  ON public.cars FOR SELECT
  USING (status = 'published' OR dealer_id = auth.uid());

-- Dealers can create listings
CREATE POLICY "Dealers can insert their own cars"
  ON public.cars FOR INSERT
  WITH CHECK (dealer_id = auth.uid());

-- Dealers can update their own listings
CREATE POLICY "Dealers can update their own cars"
  ON public.cars FOR UPDATE
  USING (dealer_id = auth.uid());

-- Dealers can delete their own listings
CREATE POLICY "Dealers can delete their own cars"
  ON public.cars FOR DELETE
  USING (dealer_id = auth.uid());
```

### Indexes

```sql
CREATE INDEX idx_cars_dealer_id ON public.cars(dealer_id);
CREATE INDEX idx_cars_status ON public.cars(status);
CREATE INDEX idx_cars_created_at ON public.cars(created_at DESC);
CREATE INDEX idx_cars_make_model ON public.cars(make, model);
```

### Sample Queries

```typescript
// Fetch published cars (buyers)
const { data: cars } = await supabase
  .from('cars')
  .select(`
    *,
    dealer:profiles!dealer_id(full_name, avatar_url)
  `)
  .eq('status', 'published')
  .order('created_at', { ascending: false })
  .limit(20);

// Fetch seller's own listings
const { data: myCars } = await supabase
  .from('cars')
  .select('*')
  .eq('dealer_id', user.id)
  .order('created_at', { ascending: false });

// Create new listing
const { data, error } = await supabase
  .from('cars')
  .insert({
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    price: 15000,
    currency: 'USD',
    description: 'Well-maintained sedan...',
    location_country: 'South Korea',
    location_city: 'Seoul',
    images: ['https://...', 'https://...'],
    specifications: {
      engine: '2.5L',
      transmission: 'Automatic'
    },
    dealer_id: user.id
  });

// Update listing status
const { error } = await supabase
  .from('cars')
  .update({ status: 'published' })
  .eq('id', carId);
```

---

## 🚧 Tables Pending Implementation (Phase 2)

### `conversations`

**Purpose:** Chat threads between buyers and sellers

```sql
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `messages`

**Purpose:** Individual messages within conversations

```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_translated TEXT, -- AI-translated content
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `favorites`

**Purpose:** Buyers' saved listings

```sql
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, car_id)
);
```

---

## 📝 Migration Strategy

### Current State: Baseline Schema (Migration 1)
- `profiles` table (5 fields)
- `cars` table (14 fields)
- Basic RLS policies
- Triggers for updated_at

### Next Steps:
1. **Migration 2:** Add missing fields to `profiles` (language_preference, country, phone_number)
2. **Migration 3:** Add multilingual description fields to `cars`
3. **Migration 4:** Create messaging tables (conversations, messages)
4. **Migration 5:** Create favorites table
5. **Migration 6:** Add advanced features (offers, transactions)

---

## 🔐 Security Considerations

### Row Level Security (RLS)
- ✅ Enabled on `profiles` and `cars`
- ✅ Public can view published cars
- ✅ Users can only edit their own data
- ❌ Need to add policies for messaging tables

### Data Validation
- ✅ Year constraints (1900-2030)
- ✅ Price must be ≥ 0
- ✅ Status enum validation
- ✅ Role enum validation
- ❌ Need phone number format validation
- ❌ Need email validation

### Best Practices
- All timestamps use TIMESTAMPTZ (timezone-aware)
- Foreign keys use ON DELETE CASCADE for data cleanup
- Indexes on frequently queried columns
- JSONB for flexible specifications (better than JSON)

---

## 📊 Sample Data Sizes

### Estimated Storage (Phase 2 MVP)

| Table | Rows | Avg Row Size | Total Size |
|-------|------|--------------|------------|
| `profiles` | 1,000 | 1 KB | ~1 MB |
| `cars` | 500 | 5 KB | ~2.5 MB |
| `messages` | 5,000 | 2 KB | ~10 MB |
| **Total** | | | **~15 MB** |

### Storage Buckets (Supabase Storage)

| Bucket | Purpose | Est. Size |
|--------|---------|-----------|
| `car-images` | Vehicle photos | ~2 GB (500 cars × 8 photos × 500 KB) |
| `avatars` | Profile pictures | ~50 MB (1,000 users × 50 KB) |
| **Total** | | **~2.05 GB** |

---

## 🔍 Common Queries

### Get featured cars for homepage
```sql
SELECT c.*, p.full_name as dealer_name, p.avatar_url as dealer_avatar
FROM cars c
JOIN profiles p ON c.dealer_id = p.id
WHERE c.status = 'published' AND c.featured = true
ORDER BY c.created_at DESC
LIMIT 6;
```

### Search cars by make/model
```sql
SELECT *
FROM cars
WHERE status = 'published'
  AND make ILIKE '%toyota%'
  AND model ILIKE '%camry%'
ORDER BY created_at DESC;
```

### Get seller statistics
```sql
SELECT
  dealer_id,
  COUNT(*) as total_listings,
  SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as active_listings,
  SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_count,
  SUM(view_count) as total_views
FROM cars
WHERE dealer_id = '...'
GROUP BY dealer_id;
```

---

## 🚀 Next Steps

1. **Run baseline migration** to ensure schema consistency
2. **Add missing fields** to profiles and cars tables
3. **Create messaging tables** (conversations, messages)
4. **Set up Storage buckets** for images
5. **Generate seed data** for testing
6. **Update TypeScript types** after each migration

---

**Questions or Issues?** Contact the development team or refer to Supabase documentation.
