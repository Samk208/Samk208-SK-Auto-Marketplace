-- =============================================
-- SK AutoSphere - Sample Seed Data
-- =============================================
-- Description: Test data for development and testing
-- WARNING: Only run in development/staging environments

-- Clear existing data (careful!)
-- TRUNCATE public.favorites, public.messages, public.conversations, public.cars, public.profiles CASCADE;

-- =============================================
-- 1. SAMPLE PROFILES
-- =============================================
-- Note: These use fake UUIDs. In production, profiles are created via auth.users

INSERT INTO public.profiles (id, full_name, avatar_url, role, language_preference, country, phone_number, verification_status, seller_rating, business_name, created_at)
VALUES
  -- Sellers (Korean dealers)
  ('00000000-0000-0000-0000-000000000001', 'Park Min-ho', 'https://i.pravatar.cc/150?img=12', 'seller', 'ko', 'South Korea', '+82-10-1234-5678', 'verified', 4.8, 'Seoul Auto Export', now() - interval '6 months'),
  ('00000000-0000-0000-0000-000000000002', 'Kim Ji-woo', 'https://i.pravatar.cc/150?img=14', 'seller', 'ko', 'South Korea', '+82-10-2345-6789', 'verified', 4.5, 'Busan Car Traders', now() - interval '4 months'),
  ('00000000-0000-0000-0000-000000000003', 'Lee Sung-min', 'https://i.pravatar.cc/150?img=33', 'seller', 'ko', 'South Korea', '+82-10-3456-7890', 'pending', 0, 'Incheon Motors', now() - interval '1 month'),

  -- Buyers (African importers)
  ('00000000-0000-0000-0000-000000000011', 'Adebayo Okonkwo', 'https://i.pravatar.cc/150?img=51', 'buyer', 'en', 'Nigeria', '+234-803-123-4567', 'verified', 0, NULL, now() - interval '3 months'),
  ('00000000-0000-0000-0000-000000000012', 'Amara Nkrumah', 'https://i.pravatar.cc/150?img=47', 'buyer', 'en', 'Ghana', '+233-24-123-4567', 'verified', 0, NULL, now() - interval '2 months'),
  ('00000000-0000-0000-0000-000000000013', 'Fatima Hassan', 'https://i.pravatar.cc/150?img=20', 'buyer', 'fr', 'Senegal', '+221-77-123-4567', 'unverified', 0, NULL, now() - interval '1 week')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. SAMPLE CARS
-- =============================================
INSERT INTO public.cars (id, make, model, year, price, currency, description, description_en, location_country, location_city, images, status, specifications, dealer_id, featured, ai_generated, created_at)
VALUES
  -- Featured cars
  (
    '10000000-0000-0000-0000-000000000001',
    'Toyota',
    'Camry',
    2019,
    15000,
    'USD',
    '잘 관리된 2019 토요타 캠리입니다. 낮은 주행거리와 깨끗한 상태를 자랑합니다.',
    'Well-maintained 2019 Toyota Camry. Low mileage and excellent condition.',
    'South Korea',
    'Seoul',
    ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068'],
    'published',
    '{"engine": "2.5L I4", "transmission": "Automatic", "mileage": 45000, "fuel_type": "Gasoline", "body_type": "Sedan", "exterior_color": "White", "interior_color": "Black", "drive_type": "FWD", "doors": 4, "seats": 5}'::jsonb,
    '00000000-0000-0000-0000-000000000001',
    true,
    false,
    now() - interval '5 days'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Hyundai',
    'Santa Fe',
    2020,
    22000,
    'USD',
    '2020 현대 산타페 SUV. 가족용 차량으로 완벽합니다.',
    '2020 Hyundai Santa Fe SUV. Perfect family vehicle with spacious interior.',
    'South Korea',
    'Busan',
    ARRAY['https://images.unsplash.com/photo-1619767886558-efdc259cde1a', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6'],
    'published',
    '{"engine": "2.4L I4", "transmission": "Automatic", "mileage": 32000, "fuel_type": "Gasoline", "body_type": "SUV", "exterior_color": "Silver", "interior_color": "Gray", "drive_type": "AWD", "doors": 5, "seats": 7}'::jsonb,
    '00000000-0000-0000-0000-000000000002',
    true,
    true,
    now() - interval '3 days'
  ),

  -- Regular listings
  (
    '10000000-0000-0000-0000-000000000003',
    'Kia',
    'Sportage',
    2018,
    13500,
    'USD',
    '2018 기아 스포티지. 경제적이고 안정적인 SUV입니다.',
    '2018 Kia Sportage. Economical and reliable SUV with great fuel efficiency.',
    'South Korea',
    'Seoul',
    ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293f24'],
    'published',
    '{"engine": "2.0L I4", "transmission": "Automatic", "mileage": 58000, "fuel_type": "Diesel", "body_type": "SUV", "exterior_color": "Red", "interior_color": "Black", "drive_type": "FWD", "doors": 5, "seats": 5}'::jsonb,
    '00000000-0000-0000-0000-000000000001',
    false,
    false,
    now() - interval '1 day'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Toyota',
    'Corolla',
    2021,
    18000,
    'USD',
    'Almost new 2021 Toyota Corolla with minimal wear.',
    '거의 새것 같은 2021 토요타 코롤라. 최소한의 사용감만 있습니다.',
    'South Korea',
    'Incheon',
    ARRAY['https://images.unsplash.com/photo-1627454820516-fef5ba880261'],
    'published',
    '{"engine": "1.8L I4", "transmission": "CVT", "mileage": 15000, "fuel_type": "Gasoline", "body_type": "Sedan", "exterior_color": "Blue", "interior_color": "Beige", "drive_type": "FWD", "doors": 4, "seats": 5}'::jsonb,
    '00000000-0000-0000-0000-000000000003',
    false,
    true,
    now() - interval '12 hours'
  ),

  -- Draft listing (not visible to buyers)
  (
    '10000000-0000-0000-0000-000000000005',
    'Hyundai',
    'Elantra',
    2017,
    11000,
    'USD',
    'Draft listing - not yet published.',
    NULL,
    'South Korea',
    'Seoul',
    ARRAY[]::text[],
    'draft',
    NULL,
    '00000000-0000-0000-0000-000000000001',
    false,
    false,
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. SAMPLE CONVERSATIONS
-- =============================================
INSERT INTO public.conversations (id, car_id, buyer_id, seller_id, created_at)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    now() - interval '2 days'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000002',
    now() - interval '1 day'
  )
ON CONFLICT (car_id, buyer_id, seller_id) DO NOTHING;

-- =============================================
-- 4. SAMPLE MESSAGES
-- =============================================
INSERT INTO public.messages (conversation_id, sender_id, content, created_at)
VALUES
  -- Conversation 1
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'Hello! I am interested in the 2019 Toyota Camry. Is it still available?',
    now() - interval '2 days'
  ),
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '안녕하세요! 네, 아직 판매 중입니다. 언제든지 방문하실 수 있습니다.',
    now() - interval '2 days' + interval '30 minutes'
  ),
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'Can you provide more photos of the interior and engine?',
    now() - interval '1 day'
  ),

  -- Conversation 2
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000012',
    'What is the total cost including shipping to Ghana (Tema Port)?',
    now() - interval '1 day'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    '차량 가격은 $22,000이고, 가나 테마항까지 배송비는 약 $1,600입니다.',
    now() - interval '1 day' + interval '1 hour'
  );

-- =============================================
-- 5. SAMPLE FAVORITES
-- =============================================
INSERT INTO public.favorites (user_id, car_id)
VALUES
  ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000004')
ON CONFLICT (user_id, car_id) DO NOTHING;

-- =============================================
-- Update view counts for realism
-- =============================================
UPDATE public.cars
SET view_count = FLOOR(RANDOM() * 100 + 10)::INTEGER
WHERE status = 'published';

-- =============================================
-- Verify seed data
-- =============================================
SELECT 'Seed data inserted successfully!' as status;
SELECT 'Profiles: ' || COUNT(*) FROM public.profiles;
SELECT 'Cars: ' || COUNT(*) FROM public.cars;
SELECT 'Conversations: ' || COUNT(*) FROM public.conversations;
SELECT 'Messages: ' || COUNT(*) FROM public.messages;
SELECT 'Favorites: ' || COUNT(*) FROM public.favorites;
