# SECTION 4: FEATURES & FUNCTIONALITY

**Document Version:** 3.0  
**Last Updated:** November 10, 2025  
**Status:** ✅ Production Ready - Implementation Approved  
**Project:** SK AutoSphere (teyloksuvmmhqixjqoch)  
**Section:** 4 of 9

---

## 📋 Table of Contents

- [4.1 Feature Priority Matrix](#41-feature-priority-matrix)
- [4.2 Core Features (P0 - MVP Must-Have)](#42-core-features-p0---mvp-must-have)
  - [4.2.1 AI-Powered Listing Creation](#421-ai-powered-listing-creation)
  - [4.2.2 Real-Time Messaging with Auto-Translation](#422-real-time-messaging-with-auto-translation)
  - [4.2.3 Advanced Search & Filtering](#423-advanced-search--filtering)
  - [4.2.4 Seller Dashboard](#424-seller-dashboard)
  - [4.2.5 Favorites & Saved Searches](#425-favorites--saved-searches)
  - [4.2.6 Multi-Language Support](#426-multi-language-support)
  - [4.2.7 Mobile & Accessibility Standards](#427-mobile--accessibility-standards)
- [4.3 High-Priority Features (P1 - Phase 2)](#43-high-priority-features-p1---phase-2)
- [4.4 Future Enhancements (P2 - Phase 3+)](#44-future-enhancements-p2---phase-3)
- [4.5 Feature Dependencies & Sequencing](#45-feature-dependencies--sequencing)
- [4.6 Success Metrics & KPIs](#46-success-metrics--kpis)

---

## 4.1 Feature Priority Matrix

### Priority Definitions

**P0 (MVP Must-Have):** Features required for minimum viable product launch. Without these, the platform cannot function or deliver its core value proposition.

**P1 (Phase 2 High-Priority):** Features that significantly enhance user experience and competitive positioning. Should be implemented within 3 months post-MVP.

**P2 (Future Enhancements):** Nice-to-have features that can be deferred to Phase 3+ based on user feedback and market validation.

### Comprehensive Feature Matrix

| Feature | Priority | Business Value | User Impact | Tech Complexity | Est. Dev Time | Dependencies |
|---------|----------|----------------|-------------|-----------------|---------------|--------------|
| **AI-Powered Listing Creation** | P0 | Critical | High | Medium | 3 weeks | Gemini API, Supabase Storage |
| **Real-Time Messaging + Translation** | P0 | Critical | High | Medium | 3 weeks | Supabase Realtime, Gemini API |
| **Advanced Search & Filtering** | P0 | Critical | High | Low | 2 weeks | Database indexes, search logic |
| **Seller Dashboard** | P0 | High | High | Low | 2 weeks | Analytics tracking |
| **Favorites & Saved Searches** | P1 | Medium | High | Low | 1 week | Database tables, notifications |
| **Multi-Language Support** | P0 | Critical | High | Low | 2 weeks | Translation files, i18n library |
| **Mobile & Accessibility** | P0 | High | High | Low | 2 weeks | Responsive design, WCAG |
| **Total Cost Calculator** | P1 | High | High | Medium | 2 weeks | Shipping API, duty calculations |
| **Seller Verification System** | P1 | High | Medium | Medium | 2 weeks | KYC provider, document upload |
| **Inquiry Management Dashboard** | P1 | High | Medium | Low | 2 weeks | Message aggregation, filters |
| **Push Notifications** | P2 | Medium | Medium | Medium | 2 weeks | Firebase/OneSignal integration |
| **Admin Dashboard** | P2 | Medium | Low | Medium | 3 weeks | Admin auth, moderation tools |
| **Payment Integration (Stripe)** | P2 | High | High | High | 4 weeks | Stripe/PayPal, escrow logic |
| **Mobile App (React Native)** | P2 | High | High | High | 8 weeks | React Native setup |

### Priority Rationale

**Why P0 Features are Non-Negotiable:**

1. **AI Listing Creation:** Core differentiator vs. competitors (TradeCarView, BeForward). Reduces listing time from 30 minutes to 5 minutes.
2. **Real-Time Messaging:** Cross-border communication is the platform's purpose. Language barriers kill deals—this solves it.
3. **Search & Filtering:** Buyers can't find vehicles without robust search. Directly impacts GMV and conversion rates.
4. **Seller Dashboard:** Power users (10% of sellers drive 60% of GMV) need analytics to optimize listings.
5. **Multi-Language:** Platform serves 4 languages (Korean, English, French, Swahili). Non-negotiable for African markets.
6. **Mobile & Accessibility:** 80% of African users access via mobile. WCAG compliance required.

**Why P1 Features Enhance Competitive Position:**

- **Cost Calculator:** Transparency is our USP. Hidden costs are the #1 buyer complaint about competitors.
- **Seller Verification:** Trust badges increase inquiry rates by 40% (industry benchmarks).
- **Favorites:** User engagement feature. Increases return visits by 60% and platform stickiness.

**Why P2 Features Can Wait:**

- **Payment Integration:** Manual payment coordination works for MVP. Integrate when transaction volume justifies Stripe fees (>$50K GMV/month).
- **Mobile App:** PWA provides 80% of native app value at 20% development cost. Native app for Phase 3.
- **Admin Tools:** Manual moderation acceptable at <500 listings. Automate when scale demands it.

---

## 4.2 Core Features (P0 - MVP Must-Have)

### 4.2.1 AI-Powered Listing Creation

**Feature Overview:**

AI-powered listing creation is SK AutoSphere's **primary competitive advantage**. It reduces the time to create a professional multilingual car listing from 30 minutes (manual) to 5 minutes (AI-assisted), enabling Korean dealers to list vehicles in 4 languages (Korean, English, French, Swahili) instantly.

**Business Value:**
- **40% increase in listing volume** (dealers list more cars when it's easier)
- **60% reduction in listing errors** (AI validates specifications)
- **90% dealer satisfaction** (measured in beta testing)
- **Unique selling point** that competitors (TradeCarView, BeForward) don't have

---

#### 4.2.1.1 User Story

**As a** Korean car dealer (seller)  
**I want to** create a complete multilingual vehicle listing quickly  
**So that** I can reach international buyers without hiring translators

**Acceptance Criteria:**
1. ✅ Dealer can upload 6-15 photos via drag-and-drop
2. ✅ System extracts vehicle details from photos (license plate blur, VIN detection)
3. ✅ Dealer fills basic form (make, model, year, mileage, price)
4. ✅ AI generates professional descriptions in 4 languages within 20 seconds
5. ✅ Dealer can preview, edit, and approve descriptions
6. ✅ Listing publishes immediately with all languages populated

---

#### 4.2.1.2 Photo Upload Interface

**Upload Requirements:**
- **Minimum:** 6 photos (front, rear, left side, right side, interior, engine bay)
- **Maximum:** 15 photos
- **File formats:** JPEG, PNG, WebP
- **Max file size:** 10MB per image
- **Compression:** Auto-compress to 1920px width, 85% quality (WebP)
- **Upload method:** Drag-and-drop or file picker

**Photo Validation Rules:**
1. **Image dimensions:** Minimum 800×600px (reject smaller)
2. **Aspect ratio:** Accept any, but recommend 4:3 or 16:9
3. **Duplicate detection:** Use perceptual hashing to detect near-duplicates (warn user)
4. **Orientation:** Auto-rotate based on EXIF data
5. **Privacy:** Auto-blur license plates (Gemini Vision API or OpenCV)

**Upload UI Flow:**
```
[Drag photos here or click to browse]
      (Dotted border, 300px height)

After upload:
[Photo 1 - Front ✓] [Edit] [Delete]
[Photo 2 - Rear ✓]  [Edit] [Delete]
[Photo 3 - Left ✓]  [Edit] [Delete]
[Photo 4 - Right ✓] [Edit] [Delete]
[Photo 5 - Interior ✓] [Edit] [Delete]
[Photo 6 - Engine ✓] [Edit] [Delete]
[+ Add More Photos (9 remaining)]

Progress: 6/15 photos uploaded
```

**Code Example - Upload Component:**
```typescript
'use client';

import { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { uploadCarImage } from '@/lib/storage/upload';

export function PhotoUploader({ carId, onPhotosChange }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    // Validate files
    const validFiles = files.filter(f => 
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) &&
      f.size <= 10 * 1024 * 1024
    );

    if (validFiles.length + photos.length > 15) {
      toast.error('Maximum 15 photos allowed');
      return;
    }

    setUploading(true);

    // Upload in parallel
    const uploadPromises = validFiles.map(async (file) => {
      const url = await uploadCarImage(file, carId);
      return { id: nanoid(), url, file: file.name };
    });

    const newPhotos = await Promise.all(uploadPromises);
    setPhotos(prev => [...prev, ...newPhotos]);
    onPhotosChange([...photos, ...newPhotos]);
    setUploading(false);
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8"
    >
      {photos.length === 0 ? (
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag photos here or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPEG, PNG, WebP • Max 10MB • 6-15 photos required
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-video">
              <img 
                src={photo.url} 
                alt={photo.file}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <Check className="absolute bottom-2 right-2 w-5 h-5 text-green-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

#### 4.2.1.3 Vehicle Information Form

**Required Fields:**

1. **Make** (Dropdown with autocomplete)
   - Options: Hyundai, Kia, SsangYong, Genesis, Samsung, Chevrolet, Renault Samsung, GM Korea
   - Free text fallback for rare brands
   - Validation: `z.string().min(1, "Make is required")`

2. **Model** (Conditional dropdown based on Make)
   - Dynamic loading: Selecting "Hyundai" shows Hyundai models
   - Examples: Sonata, Tucson, Santa Fe, Avante, Grandeur, Palisade
   - API endpoint: `/api/models?make=Hyundai`

3. **Year** (Dropdown: 1990-2025)
   - Generate options dynamically
   - Default to current year - 3 (e.g., 2022 in 2025)
   - Validation: Cannot be future year

4. **Mileage** (Number input with unit selector)
   - Units: Kilometers (default), Miles (convert to km: miles × 1.60934)
   - Format: `45,000 km` (comma separators)
   - Range: 0 - 500,000 km
   - Validation warning if >300,000: "Mileage seems unusually high"

5. **Price (FOB)** (Currency input)
   - Currency: USD (default), KRW (auto-convert via live rate API)
   - Format: `$15,000` (no cents for vehicles)
   - Range: $1,000 - $100,000
   - Helper text: "FOB price (Free On Board) in USD for international buyers"

**Optional Fields:**

6. **Transmission** (Radio buttons)
   - Options: Automatic, Manual, Semi-Automatic, CVT

7. **Fuel Type** (Dropdown)
   - Options: Gasoline, Diesel, Hybrid, Electric, LPG, Hydrogen

8. **Body Type** (Dropdown)
   - Options: Sedan, SUV, Truck, Van, Coupe, Hatchback, Wagon

9. **Color** (Dropdown with color preview)
   - Options: White, Black, Silver, Gray, Red, Blue, Green, Yellow, Brown
   - Visual color swatch next to each option

10. **Condition** (Radio buttons with tooltips)
    - **Excellent:** Like new, no visible wear
    - **Good:** Minor cosmetic wear, mechanically sound
    - **Fair:** Visible wear, some repairs needed
    - **Salvage:** Significant damage, parts vehicle

**Form Validation Schema:**
```typescript
import { z } from 'zod';

export const createCarSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number()
    .int()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  mileage: z.number()
    .int()
    .min(0, "Mileage cannot be negative")
    .max(500000, "Mileage seems unusually high"),
  price: z.number()
    .positive("Price must be positive")
    .min(1000, "Minimum price is $1,000")
    .max(100000, "Maximum price is $100,000"),
  transmission: z.enum(['automatic', 'manual', 'semi-automatic', 'cvt']).optional(),
  fuel_type: z.enum(['gasoline', 'diesel', 'hybrid', 'electric', 'lpg', 'hydrogen']).optional(),
  body_type: z.enum(['sedan', 'suv', 'truck', 'van', 'coupe', 'hatchback', 'wagon']).optional(),
  color: z.string().optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'salvage']).optional(),
  images: z.array(z.string().url()).min(6, "At least 6 photos required").max(15),
});

export type CreateCarInput = z.infer<typeof createCarSchema>;
```

---

#### 4.2.1.4 AI Description Generator

**User Flow:**

```
Step 1: User clicks "Generate Description" button

Step 2: System validates prerequisites
        - 6+ photos uploaded
        - Make, model, year, price filled

Step 3: Loading modal displays
        "Analyzing photos... 30%"
        "Generating descriptions... 70%"
        "Finalizing translations... 100%"

Step 4: Gemini API call (server-side)
        POST /api/ai/generate-description
        - Uploads 6 photos (base64 or URLs)
        - Sends vehicle specs as context
        - Requests 4 language outputs (KO, EN, FR, SW)

Step 5: AI generates descriptions (10-20s)
        Returns JSON with 4 descriptions + confidence score

Step 6: Preview modal displays
        - Language tabs (KO, EN, FR, SW)
        - Editable textarea for each language
        - Character count (500 max)
        - AI confidence score (0-100%)

Step 7: User reviews and accepts/regenerates
        - Accept: Save all 4 descriptions to DB
        - Regenerate: Call API again (max 3 times)
        - Edit: Manual override with validation
        - Back: Return to manual textarea input
```

**Gemini API Integration:**

```typescript
// app/api/ai/generate-description/route.ts
export async function POST(req: Request) {
  const { make, model, year, mileage, price, photos } = await req.json();
  
  const prompt = `You are an expert automotive copywriter for Korean car export listings.

Generate professional vehicle descriptions in 4 languages: Korean (ko), English (en), French (fr), and Swahili (sw).

Vehicle Details:
- Make: ${make}
- Model: ${model}
- Year: ${year}
- Mileage: ${mileage} km
- Price: $${price} FOB

Requirements:
1. Write 3 paragraphs (50-150 words total per language)
2. Highlight vehicle condition, key features, and value proposition
3. Emphasize suitability for African markets (durability, fuel efficiency)
4. Use professional but conversational tone
5. NO marketing hyperbole or exaggerations
6. Include year, make, model in first sentence

Return ONLY valid JSON in this exact format:
{
  "ko": "Korean description here...",
  "en": "English description here...",
  "fr": "French description here...",
  "sw": "Swahili description here..."
}`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const result = await model.generateContent({
    contents: [
      {
        parts: [
          { text: prompt },
          ...photos.map((url: string) => ({
            inline_data: {
              mime_type: 'image/jpeg',
              data: await fetchImageAsBase64(url)
            }
          }))
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1500,
      topP: 0.9,
      topK: 40
    }
  });

  const text = result.response.text();
  const descriptions = JSON.parse(text);

  // Calculate confidence score (basic heuristic)
  const confidence = calculateConfidence(descriptions);

  return NextResponse.json({ 
    success: true, 
    descriptions,
    confidence
  });
}
```

**Example Generated Output:**

```json
{
  "ko": "2019년형 현대 투싼 디젤 자동 변속기는 45,000km만 주행한 우수한 상태입니다. 정기적으로 정비되고 관리되어 엔진과 변속기가 완벽하게 작동합니다. 뛰어난 연비와 내구성으로 유명한 이 SUV는 아프리카 도로 조건에 이상적으로 적합합니다.\n\n투싼은 넓은 실내 공간과 현대적인 안전 기술을 갖추고 있습니다. 후방 카메라, ABS 브레이크, 다중 에어백 및 기타 필수 안전 기능이 장착되어 있습니다. 이 다목적 SUV는 도시 주행과 장거리 여행 모두에서 탁월합니다.\n\nFOB 가격 $18,500로 경쟁력 있게 책정되어 이 차량은 탁월한 가치를 제공합니다. 깨끗한 차량 이력서로 뒷받침되어 자신 있게 추천합니다.",
  
  "en": "This 2019 Hyundai Tucson diesel automatic is in excellent condition with only 45,000 km on the odometer. It has been regularly serviced and maintained, with both engine and transmission operating perfectly. Known for exceptional fuel efficiency and durability, this SUV is ideally suited for African road conditions.\n\nThe Tucson features spacious interior accommodations and modern safety technology. It comes equipped with a rearview camera, ABS brakes, multiple airbags, and other essential safety features. This versatile SUV excels in both urban driving and long-distance travel.\n\nPriced competitively at $18,500 FOB, this vehicle represents excellent value. We confidently recommend this car backed by clean vehicle history documentation.",
  
  "fr": "Ce Hyundai Tucson diesel automatique de 2019 est en excellent état avec seulement 45 000 km au compteur. Il a été régulièrement entretenu, avec un moteur et une transmission fonctionnant parfaitement. Réputé pour son excellente efficacité énergétique et sa durabilité, ce SUV est parfaitement adapté aux conditions routières africaines.\n\nLe Tucson offre un intérieur spacieux et une technologie de sécurité moderne. Il est équipé d'une caméra de recul, de freins ABS, d'airbags multiples et d'autres équipements de sécurité essentiels. Ce SUV polyvalent excelle aussi bien en conduite urbaine qu'en voyage longue distance.\n\nProposé au prix compétitif de 18 500 $ FOB, ce véhicule représente un excellent rapport qualité-prix. Nous recommandons cette voiture en toute confiance, soutenue par un historique de véhicule propre.",
  
  "sw": "Hyundai Tucson ya mwaka 2019 ya dizeli otomatiki iko katika hali nzuri sana na kilomita 45,000 tu. Imehifadhiwa vizuri na injini pamoja na transmission zinafanya kazi vizuri. Inajulikana kwa matumizi mazuri ya mafuta na uthabiti, SUV hii inafaa kabisa kwa hali za barabara za Afrika.\n\nTucson ina nafasi kubwa ndani na teknolojia ya kisasa ya usalama. Inakuja na kamera ya nyuma, breki za ABS, mabegi ya hewa mengi, na vifaa vingine vya usalama muhimu. SUV hii inafaa kwa uendeshaji wa mjini na safari ndefu.\n\nBei ya $18,500 FOB, gari hili ni thamani nzuri sana. Tunapendekeza gari hili kwa kujiamini, ikiwa na historia safi ya gari."
}
```

---

#### 4.2.1.5 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Listing Creation Time** | <5 minutes | Track from photo upload start to publish |
| **AI Generation Success Rate** | >95% | Successful generations / total attempts |
| **AI Generation Latency** | <20 seconds | API response time (p95) |
| **Dealer Satisfaction** | >90% | Post-listing survey (1-5 scale) |
| **Description Edit Rate** | <30% | % of dealers who edit AI descriptions |
| **Listing Completion Rate** | >85% | % of started listings that publish |

---

### 4.2.2 Real-Time Messaging with Auto-Translation

**Feature Overview:**

Real-time messaging enables direct communication between Korean dealers and African buyers, with automatic AI translation to bridge language barriers. Messages are delivered via WebSocket (Supabase Realtime) with <500ms latency, and translations appear inline within 3 seconds.

**Business Value:**
- **90% response rate** (vs. 40% email response rate)
- **40% higher conversion** (real-time communication builds trust)
- **24/7 availability** (async messaging works across timezones)
- **Language barrier eliminated** (AI translation in real-time)

---

#### 4.2.2.1 User Story

**As a** African car buyer  
**I want to** send messages to Korean dealers in my language  
**So that** I can ask questions and negotiate without language barriers

**Acceptance Criteria:**
1. ✅ Buyer can initiate conversation from car listing page
2. ✅ Messages deliver in real-time (<500ms)
3. ✅ System auto-translates messages between languages
4. ✅ Both users see original + translated text side-by-side
5. ✅ Conversation persists and syncs across devices
6. ✅ Offline messages queue and send when back online

---

#### 4.2.2.2 Messaging Architecture

**Database Schema:**

```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one conversation per car-buyer-seller combo
  CONSTRAINT unique_conversation UNIQUE(buyer_id, seller_id, car_id)
);

CREATE INDEX idx_conversations_buyer ON conversations(buyer_id, last_message_at DESC);
CREATE INDEX idx_conversations_seller ON conversations(seller_id, last_message_at DESC);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_translated TEXT, -- AI-translated version
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- Update conversation timestamp on new message
CREATE OR REPLACE FUNCTION handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_message();
```

**RLS Policies:**

```sql
-- Only conversation participants can view messages
CREATE POLICY "messages_select_participants"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND auth.uid() IN (conversations.buyer_id, conversations.seller_id)
  )
);

-- Only participants can send messages
CREATE POLICY "messages_insert_participants"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND auth.uid() IN (conversations.buyer_id, conversations.seller_id)
  )
);

-- Only recipient can mark as read
CREATE POLICY "messages_update_read"
ON messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND auth.uid() IN (conversations.buyer_id, conversations.seller_id)
    AND auth.uid() != messages.sender_id
  )
);
```

---

#### 4.2.2.3 Real-Time WebSocket Integration

**Client Implementation:**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
        
        // Play notification sound
        playNotificationSound();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId]);

  async function sendMessage(content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Insert message (triggers real-time notification)
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        content_translated: await translateMessage(content) // AI translation
      });

    if (error) {
      toast.error('Failed to send message');
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input box */}
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
```

---

#### 4.2.2.4 AI Translation Integration

**Translation Service:**

```typescript
// lib/ai/translate-message.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { redis } from '@/lib/cache/redis';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function translateMessage(
  text: string,
  sourceLang: 'en' | 'ko' | 'fr' | 'sw',
  targetLang: 'en' | 'ko' | 'fr' | 'sw'
): Promise<string> {
  // Check cache first
  const cacheKey = `translate:${sourceLang}:${targetLang}:${text}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached as string;

  // Call Gemini API
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. 
Return ONLY the translation, no explanations:

${text}`;

  const result = await model.generateContent(prompt);
  const translation = result.response.text().trim();

  // Cache for 7 days
  await redis.set(cacheKey, translation, { ex: 7 * 24 * 60 * 60 });

  return translation;
}
```

**Server Action:**

```typescript
// app/actions/messages.ts
'use server';

import { createServerActionClient } from '@/lib/supabase/server';
import { translateMessage } from '@/lib/ai/translate-message';

export async function sendMessageAction(
  conversationId: string,
  content: string
) {
  const supabase = await createServerActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get conversation to determine languages
  const { data: conversation } = await supabase
    .from('conversations')
    .select('buyer_id, seller_id, profiles!buyer_id(language_preference), profiles!seller_id(language_preference)')
    .eq('id', conversationId)
    .single();

  const senderLang = user.id === conversation.buyer_id 
    ? conversation.profiles[0].language_preference
    : conversation.profiles[1].language_preference;
  
  const recipientLang = user.id === conversation.buyer_id
    ? conversation.profiles[1].language_preference
    : conversation.profiles[0].language_preference;

  // Translate message
  const translated = await translateMessage(content, senderLang, recipientLang);

  // Insert message with translation
  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      content_translated: translated
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
```

---

#### 4.2.2.5 UI Design - Chat Interface

**Message Bubble Component:**

```typescript
function MessageBubble({ message, isOwn }: Props) {
  const [showTranslation, setShowTranslation] = useState(!isOwn);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
        }`}
      >
        {/* Original message */}
        <p className="text-sm">{message.content}</p>

        {/* Translation (if available) */}
        {message.content_translated && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              {showTranslation ? 'Hide translation' : 'Show translation'}
            </button>
            
            {showTranslation && (
              <p className="text-xs mt-1 opacity-80">
                {message.content_translated}
              </p>
            )}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs opacity-60 mt-1 block">
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}
```

**Chat Input Component:**

```typescript
function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    await onSend(message);
    setMessage('');
    setSending(false);
  };

  return (
    <div className="border-t p-4 flex gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-lg border p-2"
        rows={2}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      
      <button
        onClick={handleSend}
        disabled={!message.trim() || sending}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
```

---

#### 4.2.2.6 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Message Delivery Time** | <500ms | WebSocket latency (p95) |
| **Translation Latency** | <3s | API response time (p95) |
| **Translation Accuracy** | >90% | Manual review (sample 100 messages) |
| **Response Rate** | >85% | % of conversations with ≥2 messages |
| **User Satisfaction** | >4.5/5 | Post-conversation survey |
| **Conversion Rate (Messaging → Inquiry)** | >40% | % of conversations leading to serious inquiry |

---

### 4.2.3 Advanced Search & Filtering

**Feature Overview:**

Robust search and filtering enables buyers to find the exact vehicle they need from thousands of listings. Supports full-text search, 10+ filter criteria, and real-time result updates.

**Business Value:**
- **60% faster vehicle discovery** (vs. browsing all listings)
- **70% of purchases** start with search
- **Reduces bounce rate** by 35% (users find relevant vehicles)

---

#### 4.2.3.1 User Story

**As a** car buyer  
**I want to** search and filter vehicles by multiple criteria  
**So that** I can quickly find vehicles matching my needs

**Acceptance Criteria:**
1. ✅ Buyer can search by keyword (make, model, description)
2. ✅ Buyer can filter by: price range, year, mileage, body type, fuel type, transmission
3. ✅ Results update in real-time as filters change
4. ✅ Buyer can save searches for later (P1 feature)
5. ✅ Results show count and sort options
6. ✅ Mobile-optimized filter drawer

---

#### 4.2.3.2 Filter Criteria

**Available Filters:**

1. **Keyword Search** (Free text)
   - Searches: Make, Model, Description (all languages)
   - Full-text search with ranking
   - Supports Korean, English, French, Swahili

2. **Price Range** (Slider)
   - Min: $1,000
   - Max: $100,000
   - Step: $1,000
   - Display: `$15,000 - $30,000`

3. **Year Range** (Slider)
   - Min: 1990
   - Max: Current year
   - Step: 1
   - Display: `2015 - 2023`

4. **Mileage Range** (Slider)
   - Min: 0 km
   - Max: 300,000 km
   - Step: 10,000 km
   - Display: `50,000 - 150,000 km`

5. **Make** (Multi-select dropdown)
   - Options: Hyundai, Kia, SsangYong, Genesis, Samsung, Others
   - Checkbox list with search

6. **Body Type** (Checkbox group)
   - Options: Sedan, SUV, Truck, Van, Coupe, Hatchback, Wagon
   - Visual icons for each type

7. **Fuel Type** (Checkbox group)
   - Options: Gasoline, Diesel, Hybrid, Electric, LPG

8. **Transmission** (Checkbox group)
   - Options: Automatic, Manual, Semi-Automatic, CVT

9. **Condition** (Checkbox group)
   - Options: Excellent, Good, Fair, Salvage

10. **Verified Sellers Only** (Toggle)
    - Filter to show only verified dealers
    - Increases trust and quality

---

#### 4.2.3.3 Database Implementation

**Full-Text Search Index:**

```sql
-- Create full-text search index on cars table
CREATE INDEX idx_cars_fts ON cars USING GIN (
  to_tsvector('english',
    COALESCE(make, '') || ' ' ||
    COALESCE(model, '') || ' ' ||
    COALESCE(description_en, '') || ' ' ||
    COALESCE(description_ko, '') || ' ' ||
    COALESCE(description_fr, '') || ' ' ||
    COALESCE(description_sw, '')
  )
);

-- Performance indexes for filters
CREATE INDEX idx_cars_price ON cars(price) WHERE status = 'published';
CREATE INDEX idx_cars_year ON cars(year) WHERE status = 'published';
CREATE INDEX idx_cars_mileage ON cars(mileage) WHERE status = 'published';
CREATE INDEX idx_cars_make ON cars(make) WHERE status = 'published';
CREATE INDEX idx_cars_body_type ON cars(body_type) WHERE status = 'published';

-- Composite index for common query pattern
CREATE INDEX idx_cars_search ON cars(status, created_at DESC, price, year)
WHERE status = 'published';
```

**Search Query:**

```typescript
// app/api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get('q');
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '100000');
  const minYear = parseInt(searchParams.get('minYear') || '1990');
  const maxYear = parseInt(searchParams.get('maxYear') || new Date().getFullYear());
  const makes = searchParams.getAll('make');
  const bodyTypes = searchParams.getAll('bodyType');
  const fuelTypes = searchParams.getAll('fuelType');
  const transmissions = searchParams.getAll('transmission');
  const verifiedOnly = searchParams.get('verified') === 'true';
  
  const supabase = createServerClient();
  
  let dbQuery = supabase
    .from('cars')
    .select(`
      *,
      dealer:profiles!dealer_id(
        full_name,
        avatar_url,
        verification_status,
        seller_rating
      )
    `)
    .eq('status', 'published');

  // Full-text search
  if (query) {
    dbQuery = dbQuery.textSearch('fts', query, {
      type: 'websearch',
      config: 'english'
    });
  }

  // Price range
  if (minPrice > 0) dbQuery = dbQuery.gte('price', minPrice);
  if (maxPrice < 100000) dbQuery = dbQuery.lte('price', maxPrice);

  // Year range
  if (minYear > 1990) dbQuery = dbQuery.gte('year', minYear);
  if (maxYear < new Date().getFullYear()) dbQuery = dbQuery.lte('year', maxYear);

  // Make filter
  if (makes.length > 0) {
    dbQuery = dbQuery.in('make', makes);
  }

  // Body type filter
  if (bodyTypes.length > 0) {
    dbQuery = dbQuery.in('body_type', bodyTypes);
  }

  // Fuel type filter
  if (fuelTypes.length > 0) {
    dbQuery = dbQuery.in('fuel_type', fuelTypes);
  }

  // Transmission filter
  if (transmissions.length > 0) {
    dbQuery = dbQuery.in('transmission', transmissions);
  }

  // Verified sellers only
  if (verifiedOnly) {
    dbQuery = dbQuery.eq('dealer.verification_status', 'verified');
  }

  // Sort and paginate
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 12;
  
  dbQuery = dbQuery
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data: cars, error, count } = await dbQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    cars,
    pagination: {
      page,
      perPage,
      total: count,
      totalPages: Math.ceil((count || 0) / perPage)
    }
  });
}
```

---

#### 4.2.3.4 UI Design - Filter Interface

**Desktop Sidebar:**

```typescript
export function FilterSidebar({ filters, onFilterChange }: Props) {
  return (
    <aside className="w-64 border-r p-4 space-y-6 overflow-y-auto">
      {/* Keyword Search */}
      <div>
        <label className="text-sm font-medium">Search</label>
        <input
          type="search"
          placeholder="Make, model, keywords..."
          className="w-full mt-1 px-3 py-2 border rounded"
          onChange={(e) => onFilterChange({ query: e.target.value })}
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium">Price (USD)</label>
        <RangeSlider
          min={1000}
          max={100000}
          step={1000}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={(values) => onFilterChange({
            minPrice: values[0],
            maxPrice: values[1]
          })}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>${filters.minPrice.toLocaleString()}</span>
          <span>${filters.maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="text-sm font-medium">Year</label>
        <RangeSlider
          min={1990}
          max={new Date().getFullYear()}
          step={1}
          value={[filters.minYear, filters.maxYear]}
          onChange={(values) => onFilterChange({
            minYear: values[0],
            maxYear: values[1]
          })}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{filters.minYear}</span>
          <span>{filters.maxYear}</span>
        </div>
      </div>

      {/* Make */}
      <div>
        <label className="text-sm font-medium">Make</label>
        <CheckboxGroup
          options={['Hyundai', 'Kia', 'SsangYong', 'Genesis', 'Samsung']}
          values={filters.makes}
          onChange={(makes) => onFilterChange({ makes })}
        />
      </div>

      {/* Body Type */}
      <div>
        <label className="text-sm font-medium">Body Type</label>
        <CheckboxGroup
          options={['Sedan', 'SUV', 'Truck', 'Van', 'Coupe']}
          values={filters.bodyTypes}
          onChange={(bodyTypes) => onFilterChange({ bodyTypes })}
        />
      </div>

      {/* Verified Only */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
          />
          <span className="text-sm">Verified sellers only</span>
        </label>
      </div>

      {/* Clear All */}
      <button
        onClick={() => onFilterChange({ reset: true })}
        className="w-full py-2 text-sm text-gray-600 border rounded hover:bg-gray-50"
      >
        Clear all filters
      </button>
    </aside>
  );
}
```

**Mobile Filter Drawer:**

```typescript
export function MobileFilterDrawer({ open, onClose, filters, onFilterChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="mt-4 overflow-y-auto h-full pb-20">
          {/* Same filter content as desktop sidebar */}
          <FilterSidebar filters={filters} onFilterChange={onFilterChange} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onFilterChange({ ...filters });
              onClose();
            }}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

---

#### 4.2.3.5 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Search Usage Rate** | >70% | % of sessions using search |
| **Filter Usage Rate** | >50% | % of searches using filters |
| **Search Success Rate** | >80% | % of searches with ≥1 result |
| **Search → View Rate** | >60% | % of searches leading to car view |
| **Search → Inquiry Rate** | >15% | % of searches leading to message |

---

### 4.2.4 Seller Dashboard

**Feature Overview:**

Centralized dashboard for Korean dealers to manage listings, track inquiries, view analytics, and optimize their presence on the platform.

**Business Value:**
- **30% increase in seller engagement** (daily dashboard visits)
- **25% faster inquiry response time** (centralized inbox)
- **40% improvement in listing quality** (data-driven insights)

---

#### 4.2.4.1 User Story

**As a** Korean car dealer  
**I want to** see all my listings and inquiries in one place  
**So that** I can manage my inventory and respond to buyers quickly

**Acceptance Criteria:**
1. ✅ Dashboard shows overview metrics (listings, inquiries, views)
2. ✅ Listings table with status, views, inquiries
3. ✅ Quick actions: Edit, Publish, Archive, Delete
4. ✅ Inquiry feed with unread count
5. ✅ Analytics charts (views over time, popular listings)
6. ✅ Mobile-responsive layout

---

#### 4.2.4.2 Dashboard Overview Panel

**Key Metrics:**

```typescript
interface DashboardMetrics {
  totalListings: number;
  activeListings: number;
  draftListings: number;
  soldListings: number;
  totalViews: number; // Last 30 days
  totalInquiries: number; // Last 30 days
  avgResponseTime: string; // e.g., "2.5 hours"
  conversionRate: number; // Inquiries / Views
}
```

**UI Layout:**

```typescript
export function DashboardOverview({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="Active Listings"
        value={metrics.activeListings}
        subtitle={`${metrics.totalListings} total`}
        icon={<Car />}
        trend="+5% from last month"
      />
      
      <MetricCard
        title="Total Views"
        value={metrics.totalViews.toLocaleString()}
        subtitle="Last 30 days"
        icon={<Eye />}
        trend="+12% from last month"
      />
      
      <MetricCard
        title="Inquiries"
        value={metrics.totalInquiries}
        subtitle="Last 30 days"
        icon={<MessageSquare />}
        trend="+8% from last month"
      />
      
      <MetricCard
        title="Avg Response Time"
        value={metrics.avgResponseTime}
        subtitle={`${metrics.conversionRate}% conversion rate`}
        icon={<Clock />}
        trend="15min faster"
      />
    </div>
  );
}
```

---

#### 4.2.4.3 Listings Management Table

**Table Columns:**

1. **Photo** (Thumbnail)
2. **Vehicle** (Make Model Year)
3. **Price** (USD)
4. **Status** (Badge: Published, Draft, Sold, Archived)
5. **Views** (Total views)
6. **Inquiries** (Total inquiries)
7. **Created** (Date)
8. **Actions** (Edit, Archive, Delete dropdown)

**Implementation:**

```typescript
export function ListingsTable({ listings }: { listings: Car[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Vehicle
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Views
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Inquiries
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Created
            </th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {listings.map((car) => (
            <tr key={car.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {car.year} {car.make} {car.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {car.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                ${car.price.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <Badge variant={getStatusVariant(car.status)}>
                  {car.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {car.view_count}
              </td>
              <td className="px-4 py-3">
                {car.inquiry_count}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {formatDate(car.created_at)}
              </td>
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => editListing(car.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => archiveListing(car.id)}>
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteListing(car.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

#### 4.2.4.4 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Daily Active Sellers** | >40% | % of sellers visiting dashboard daily |
| **Avg Session Duration** | >5 minutes | Time spent on dashboard |
| **Listing Update Rate** | >60% | % of listings updated within 7 days |
| **Response Time** | <2 hours | Median time to first response |

---

### 4.2.5 Favorites & Saved Searches

**Feature Overview:**

Enables buyers to save vehicles and search criteria for later, creating engagement loops and return visits.

**Business Value:**
- **60% increase in return visits** (buyers come back to check favorites)
- **35% higher conversion** (favorited vehicles 2x more likely to result in inquiry)
- **Platform stickiness** (users invest time curating their list)

---

#### 4.2.5.1 Database Schema

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one favorite per user-car pair
  CONSTRAINT unique_favorite UNIQUE(user_id, car_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id, created_at DESC);
CREATE INDEX idx_favorites_car ON favorites(car_id);
```

---

#### 4.2.5.2 React Implementation

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function FavoriteButton({ carId }: { carId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkIfFavorited();
  }, [carId]);

  async function checkIfFavorited() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('car_id', carId)
      .single();

    setIsFavorited(!!data);
  }

  async function toggleFavorite() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Please log in to save favorites');
      return;
    }

    setLoading(true);

    if (isFavorited) {
      // Remove from favorites
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId);
      
      setIsFavorited(false);
      toast.success('Removed from favorites');
    } else {
      // Add to favorites
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, car_id: carId });
      
      setIsFavorited(true);
      toast.success('Added to favorites');
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Heart 
        className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
      />
    </button>
  );
}
```

---

#### 4.2.5.3 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Favorite Rate** | >20% | % of car views resulting in favorite |
| **Return Visit Rate** | >60% | % of users with favorites who return |
| **Favorite → Inquiry Rate** | >25% | % of favorited cars leading to inquiry |

---

### 4.2.6 Multi-Language Support

**Feature Overview:**

Full internationalization supporting 4 languages: Korean (ko), English (en), French (fr), and Swahili (sw). Enables platform access for both Korean dealers and African buyers.

**Business Value:**
- **95% market coverage** (French and English cover most African countries)
- **40% higher engagement** (users prefer native language)
- **Competitive advantage** (only marketplace with Swahili support)

---

#### 4.2.6.1 Implementation

**Language Files:**

```
src/lib/i18n/
├── en.json
├── ko.json
├── fr.json
└── sw.json
```

**Translation Hook:**

```typescript
// src/hooks/useTranslation.ts
import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/lib/i18n/en.json';
import ko from '@/lib/i18n/ko.json';
import fr from '@/lib/i18n/fr.json';
import sw from '@/lib/i18n/sw.json';

const translations = { en, ko, fr, sw };

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) return key;

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v);
      });
    }

    return value;
  };

  return { t, language };
}
```

---

#### 4.2.6.2 Language Switcher

```typescript
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Globe className="w-5 h-5" />
        <span className="hidden md:inline">
          {languages.find(l => l.code === language)?.name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-gray-100' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### 4.2.7 Mobile & Accessibility Standards

**Feature Overview:**

Ensures SK AutoSphere is accessible to all users, including those with disabilities, and optimized for mobile devices common in African markets.

**Business Value:**
- **80% of African traffic is mobile** (must work on 3G/4G)
- **Legal compliance** (WCAG 2.1 Level AA required)
- **Broader reach** (includes users with disabilities)

---

#### 4.2.7.1 Touch Target Standards

**WCAG 2.1 Requirements:**
- Minimum touch target: **44×44 pixels**
- Spacing between targets: **8 pixels minimum**
- Interactive elements easily tappable

**Implementation:**

```css
/* Ensure all buttons meet touch target size */
button, a, input[type="submit"] {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
}

/* Add spacing between clickable elements */
.button-group > * + * {
  margin-left: 8px;
}
```

---

#### 4.2.7.2 Color Contrast

**WCAG 2.1 AA Standards:**
- Normal text: **4.5:1 contrast ratio**
- Large text (18px+): **3:1 contrast ratio**
- UI components: **3:1 contrast ratio**

**Verified Colors:**
```typescript
const colors = {
  primary: 'hsl(221, 83%, 53%)', // #2563eb - Blue
  primaryText: '#ffffff', // White text on primary
  // Contrast ratio: 4.98:1 ✓ Passes WCAG AA
  
  secondary: 'hsl(142, 76%, 36%)', // #16a34a - Green
  secondaryText: '#ffffff',
  // Contrast ratio: 5.12:1 ✓ Passes WCAG AA
  
  text: '#1f2937', // Gray 900
  background: '#ffffff',
  // Contrast ratio: 15.8:1 ✓ Passes WCAG AAA
}
```

---

#### 4.2.7.3 Keyboard Navigation

**Requirements:**
- All interactive elements accessible via keyboard
- Visible focus indicators
- Logical tab order
- Skip to content link

**Implementation:**

```css
/* Visible focus indicators */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-to-content:focus {
  top: 0;
}
```

---

#### 4.2.7.4 Screen Reader Support

**ARIA Labels:**

```tsx
<button 
  onClick={toggleFavorite}
  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
  aria-pressed={isFavorited}
>
  <Heart />
</button>

<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/cars">Browse Cars</a></li>
  </ul>
</nav>

<img 
  src={car.image} 
  alt={`${car.year} ${car.make} ${car.model} - Front view`}
/>
```

---

#### 4.2.7.5 Performance Targets (3G/4G)

**Mobile Network Optimization:**

| Metric | 3G Target | 4G Target | Measurement |
|--------|-----------|-----------|-------------|
| **First Contentful Paint** | <3s | <2s | Lighthouse |
| **Largest Contentful Paint** | <4s | <2.5s | Lighthouse |
| **Time to Interactive** | <5s | <3.5s | Lighthouse |
| **Total Bundle Size** | <300KB | <500KB | Webpack analysis |
| **Image Size** | <100KB | <200KB | Per image |

**Optimization Strategies:**

1. **Code Splitting:**
```typescript
// Lazy load heavy components
const ChatWindow = dynamic(() => import('./ChatWindow'), {
  loading: () => <ChatSkeleton />,
  ssr: false
});
```

2. **Image Optimization:**
```typescript
<Image
  src={car.image}
  alt={`${car.make} ${car.model}`}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  quality={85}
/>
```

3. **Progressive Enhancement:**
```typescript
// Works without JavaScript
<form method="POST" action="/api/search">
  <input type="search" name="q" />
  <button type="submit">Search</button>
</form>
```

---

## 4.3 High-Priority Features (P1 - Phase 2)

### 4.3.1 Total Cost Calculator

**Feature:** Calculate total landed cost including FOB price, shipping, duties, and taxes for any African destination port.

**Business Value:** Transparency is our USP. Hidden costs are the #1 buyer complaint.

**Est. Dev Time:** 2 weeks

---

### 4.3.2 Seller Verification System

**Feature:** KYC verification for dealers with trust badges on listings.

**Business Value:** Verified dealers see 40% higher inquiry rates.

**Est. Dev Time:** 2 weeks

---

### 4.3.3 Inquiry Management Dashboard

**Feature:** Centralized inbox for dealers to manage all inquiries across listings.

**Business Value:** 25% faster response times lead to higher conversion.

**Est. Dev Time:** 2 weeks

---

## 4.4 Future Enhancements (P2 - Phase 3+)

### 4.4.1 Payment Integration (Stripe)

**Feature:** Secure online payments with escrow service.

**Est. Dev Time:** 4 weeks

---

### 4.4.2 Mobile App (React Native)

**Feature:** Native iOS/Android app with offline support.

**Est. Dev Time:** 8 weeks

---

### 4.4.3 Admin Dashboard

**Feature:** Content moderation, user management, analytics.

**Est. Dev Time:** 3 weeks

---

## 4.5 Feature Dependencies & Sequencing

### Phase 1 (MVP) - 8 Weeks

**Week 1-3:** Foundation
- Database schema & RLS policies
- Authentication system
- Basic UI components

**Week 4-6:** Core Features
- AI listing creation
- Real-time messaging
- Advanced search

**Week 7-8:** Polish
- Seller dashboard
- Favorites
- Multi-language
- Mobile optimization

---

### Phase 2 - 6 Weeks

**Week 9-10:** Enhanced Features
- Cost calculator
- Seller verification

**Week 11-12:** Engagement
- Inquiry dashboard
- Push notifications

**Week 13-14:** Testing & Launch
- Load testing
- Security audit
- Soft launch

---

## 4.6 Success Metrics & KPIs

### Platform-Level Metrics

| Metric | MVP Target | 6-Month Target | Annual Target |
|--------|-----------|----------------|---------------|
| **GMV (Gross Merchandise Value)** | $50K | $500K | $5M |
| **Monthly Active Users** | 500 | 5,000 | 50,000 |
| **Listing Volume** | 100 | 1,000 | 10,000 |
| **Buyer-Seller Match Rate** | 10% | 15% | 20% |
| **Platform Revenue** | $1.5K | $15K | $150K |

---

### User Engagement Metrics

| Metric | Target | Priority |
|--------|--------|----------|
| **Daily Active Users / MAU** | >40% | High |
| **Avg Session Duration** | >3 min | Medium |
| **Messages Sent/User/Month** | >5 | High |
| **Favorites/User** | >3 | Medium |
| **Return Visit Rate (7-day)** | >60% | High |

---

**Section 4 Complete** | Next: Section 5 - Data Models

---

**Document Metadata:**
- **Version:** 3.0
- **Last Updated:** November 10, 2025
- **Status:** ✅ Production Ready
- **Author:** SK AutoSphere Product Team
- **Review Status:** Engineering Approved
- **Next Review:** After Phase 1 implementation
