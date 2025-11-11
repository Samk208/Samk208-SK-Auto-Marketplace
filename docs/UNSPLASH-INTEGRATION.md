# Unsplash Integration Guide

**Project:** SK AutoSphere
**Purpose:** High-quality car images for development and fallback
**API:** Unsplash Developer API
**Status:** ✅ Configured & Ready

---

## 🎯 Overview

SK AutoSphere uses Unsplash API to provide:

- **Realistic car images** during development
- **Fallback images** when dealers haven't uploaded photos
- **Avatar placeholders** for users without profile pictures
- **Marketing images** for landing pages

---

## 🔑 Configuration

### Environment Variable

Located in `.env.local`:

```env
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=YOUR_UNSPLASH_ACCESS_KEY
```

**Important:**

- Replace `YOUR_UNSPLASH_ACCESS_KEY` with your actual Unsplash API key
- Store real keys in `.env.local` only (never commit to version control)
- Get your key from: https://unsplash.com/developers

---

## 📚 Utility Functions

All Unsplash utilities are located in: `src/lib/utils/unsplash.ts`

### 1. Get Car Images

```typescript
import { getCarImages } from "@/lib/utils/unsplash";

// Get 6 high-quality images of a specific car
const images = getCarImages("Hyundai", "Sonata", 6);
// Returns: Array of 6 different Hyundai Sonata image URLs

// Default is 6 images
const defaultImages = getCarImages("Kia", "EV6");
```

### 2. Get Single Car Image

```typescript
import { getKoreanCarImage } from "@/lib/utils/unsplash";

// Get a single image of a Korean car
const image = getKoreanCarImage("Hyundai", "Tucson");

// Just the brand (random model)
const genericImage = getKoreanCarImage("Genesis");
```

### 3. Get Generic Image

```typescript
import { getUnsplashImage } from "@/lib/utils/unsplash";

// Get any image with custom query
const carImage = getUnsplashImage({
  query: "luxury car",
  width: 1200,
  height: 800,
  orientation: "landscape",
});

// Get a specific size
const thumbnail = getUnsplashImage({
  query: "car interior",
  width: 400,
  height: 300,
});
```

### 4. Get Avatar/Profile Image

```typescript
import { getAvatarImage } from "@/lib/utils/unsplash";

// Get consistent avatar for a user
const avatar = getAvatarImage("user-id-123");
// Same user ID always returns same portrait

// Different avatars for different users
const avatar1 = getAvatarImage("alice");
const avatar2 = getAvatarImage("bob");
```

### 5. Random Korean Car Generator

```typescript
import { getRandomKoreanCar } from "@/lib/utils/unsplash";

// Get a random Korean car make and model
const { make, model } = getRandomKoreanCar();
// Returns: { make: 'Hyundai', model: 'Palisade' }

// Use it to generate test data
const car = {
  ...getRandomKoreanCar(),
  year: 2023,
  price: 40000,
};
```

---

## 🎨 Usage Examples

### In Components

```typescript
// components/car/CarCard.tsx
import { getCarImages } from "@/lib/utils/unsplash";

export function CarCard({ car }: { car: Car }) {
  // Use Unsplash if no images uploaded yet
  const images =
    car.imageUrls.length > 0
      ? car.imageUrls
      : getCarImages(car.make, car.model, 6);

  return (
    <div>
      <img src={images[0]} alt={`${car.make} ${car.model}`} />
    </div>
  );
}
```

### In Mock Data

```typescript
// lib/constants.ts
import { getCarImages, getAvatarImage } from "@/lib/utils/unsplash";

export const MOCK_CARS: Car[] = [
  {
    id: "1",
    make: "Hyundai",
    model: "Sonata",
    imageUrls: getCarImages("Hyundai", "Sonata", 6),
    // ... other fields
  },
];

export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    avatarUrl: getAvatarImage("user-1"),
  },
];
```

### In Server Components

```typescript
// app/cars/[id]/page.tsx
import { getCarImages } from "@/lib/utils/unsplash";

export default async function CarDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const car = await fetchCar(params.id);

  // Fallback to Unsplash if no images
  const images =
    car.images?.length > 0 ? car.images : getCarImages(car.make, car.model);

  return (
    <div>
      <ImageGallery images={images} />
    </div>
  );
}
```

---

## 🚦 API Limits

### Free Tier (Current)

- **50 requests per hour**
- **Per application** (not per user)
- Resets every hour

### Rate Limit Handling

```typescript
// Good: Cache images in component state
const [images, setImages] = useState(() => getCarImages("Kia", "EV6"));

// Bad: Generate new images on every render
const images = getCarImages("Kia", "EV6"); // ❌ Wastes API calls
```

### Best Practices

1. **Cache images** - Don't regenerate on every render
2. **Use mock data** - Pre-generate images in constants
3. **Monitor usage** - Check Unsplash dashboard for analytics
4. **Implement fallbacks** - Use placeholder if API fails

---

## 🎭 Supported Korean Car Brands

```typescript
export const KOREAN_CAR_MODELS = {
  Hyundai: [
    "Sonata",
    "Elantra",
    "Tucson",
    "Santa Fe",
    "Palisade",
    "Kona",
    "Venue",
    "Ioniq 5",
    "Ioniq 6",
    "Grandeur",
  ],
  Kia: [
    "Sportage",
    "Sorento",
    "Telluride",
    "Seltos",
    "Soul",
    "Forte",
    "K5",
    "Carnival",
    "EV6",
    "Niro",
  ],
  Genesis: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
};
```

All these models will return relevant, high-quality images from Unsplash.

---

## 🔄 Image Optimization

### Responsive Images

```typescript
import { optimizeUnsplashUrl, getCarImages } from "@/lib/utils/unsplash";

const baseImages = getCarImages("Hyundai", "Sonata");

// Generate different sizes for responsive loading
const thumbnail = optimizeUnsplashUrl(baseImages[0], {
  width: 400,
  quality: 70,
});
const medium = optimizeUnsplashUrl(baseImages[0], { width: 800, quality: 80 });
const large = optimizeUnsplashUrl(baseImages[0], { width: 1200, quality: 85 });

// Use in srcset
<img
  src={medium}
  srcSet={`${thumbnail} 400w, ${medium} 800w, ${large} 1200w`}
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="Car"
/>;
```

### WebP Format

```typescript
import { optimizeUnsplashUrl } from "@/lib/utils/unsplash";

const imageUrl = getUnsplashImage({ query: "car" });

// Convert to WebP for better compression
const webpUrl = optimizeUnsplashUrl(imageUrl, {
  format: "webp",
  quality: 80,
  width: 1200,
});
```

---

## 🛠️ Development vs Production

### Development (Current)

```typescript
// Use Unsplash for all images
const images = getCarImages(car.make, car.model);
```

### Production (After Storage Setup)

```typescript
// Prioritize user uploads, fallback to Unsplash
const images =
  car.images?.length > 0
    ? car.images // From Supabase Storage
    : getCarImages(car.make, car.model); // Fallback to Unsplash
```

---

## 🐛 Troubleshooting

### Issue: Images Not Loading

**Symptoms:** Broken image links, 404 errors

**Causes:**

1. API rate limit exceeded (50/hour)
2. Invalid query (e.g., typo in car model)
3. Network issues

**Solutions:**

```typescript
// Add error handling
function getCarImagesWithFallback(make: string, model: string) {
  try {
    return getCarImages(make, model);
  } catch (error) {
    console.error("Unsplash API error:", error);
    // Return placeholder images
    return ["/images/placeholder-car-1.jpg", "/images/placeholder-car-2.jpg"];
  }
}
```

### Issue: Same Images Repeating

**Cause:** Unsplash returns similar results for same query

**Solution:**

```typescript
// Add unique seed to get variety
const images = Array.from({ length: 6 }, (_, i) => {
  const seed = Date.now() + i;
  return (
    getUnsplashImage({
      query: `${make} ${model}`,
    }) + `&sig=${seed}`
  );
});
```

### Issue: Slow Image Loading

**Cause:** Large image sizes

**Solution:**

```typescript
// Optimize image sizes
const optimizedImage = optimizeUnsplashUrl(imageUrl, {
  width: 800, // Reduce size
  quality: 75, // Lower quality
  format: "webp", // Use modern format
});
```

---

## 📊 Monitoring Usage

### Check API Usage

Visit your Unsplash dashboard:

```
https://unsplash.com/developers/applications/{YOUR_APP_ID}/stats
```

### Log API Calls (Development)

```typescript
let apiCallCount = 0;

export function getUnsplashImage(options) {
  apiCallCount++;
  console.log(`Unsplash API calls: ${apiCallCount}`);

  // ... rest of function
}
```

---

## 🚀 Next Steps

### Immediate

- ✅ Unsplash configured
- ✅ Utility functions created
- ✅ Mock data updated with real images

### Short-term

- [ ] Create Supabase Storage buckets
- [ ] Implement dealer photo upload
- [ ] Add fallback logic (Storage → Unsplash → Placeholder)

### Long-term

- [ ] Consider upgrading to Unsplash+ for unlimited requests
- [ ] Implement image CDN for caching
- [ ] Add image compression pipeline

---

## 📚 Resources

- **Unsplash API Docs:** https://unsplash.com/documentation
- **Rate Limits:** https://unsplash.com/documentation#rate-limiting
- **Guidelines:** https://unsplash.com/documentation#guidelines--crediting
- **Dashboard:** https://unsplash.com/developers

---

## 📝 Attribution

Per Unsplash guidelines, attribute photos when possible:

```typescript
// In photo detail view
<a href="https://unsplash.com" target="_blank">
  Photo by Unsplash
</a>
```

---

**Status:** ✅ Ready to Use
**API Calls Remaining:** 50/hour (resets hourly)
**Integration Complete:** Yes
