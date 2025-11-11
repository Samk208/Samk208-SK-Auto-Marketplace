/**
 * Setup Supabase Storage Buckets
 * This script creates the car-images and avatars buckets if they don't exist
 * Run with: node scripts/setup-storage.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Note: Service role key is required to create storage buckets');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupStorageBuckets() {
  console.log('🚀 Setting up Supabase storage buckets...\n');

  try {
    // Get existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      throw listError;
    }

    const existingBucketNames = buckets.map(b => b.name);
    console.log('📦 Existing buckets:', existingBucketNames.join(', ') || 'none');

    // Create car-images bucket
    if (!existingBucketNames.includes('car-images')) {
      console.log('\n📸 Creating car-images bucket...');
      const { data: carImagesBucket, error: carImagesError } = await supabase.storage.createBucket('car-images', {
        public: true,
        fileSizeLimit: 5242880, // 5 MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });

      if (carImagesError) {
        if (carImagesError.message.includes('already exists')) {
          console.log('✅ car-images bucket already exists');
        } else {
          console.error('❌ Error creating car-images bucket:', carImagesError.message);
        }
      } else {
        console.log('✅ car-images bucket created successfully');
      }
    } else {
      console.log('✅ car-images bucket already exists');
    }

    // Create avatars bucket
    if (!existingBucketNames.includes('avatars')) {
      console.log('\n👤 Creating avatars bucket...');
      const { data: avatarsBucket, error: avatarsError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 2097152, // 2 MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });

      if (avatarsError) {
        if (avatarsError.message.includes('already exists')) {
          console.log('✅ avatars bucket already exists');
        } else {
          console.error('❌ Error creating avatars bucket:', avatarsError.message);
        }
      } else {
        console.log('✅ avatars bucket created successfully');
      }
    } else {
      console.log('✅ avatars bucket already exists');
    }

    // Verify final state
    console.log('\n🔍 Verifying buckets...');
    const { data: finalBuckets } = await supabase.storage.listBuckets();
    const carImages = finalBuckets.find(b => b.name === 'car-images');
    const avatars = finalBuckets.find(b => b.name === 'avatars');

    console.log('\n📊 Final bucket configuration:');
    if (carImages) {
      console.log('  ✅ car-images: public =', carImages.public, '| size limit =', (carImages.file_size_limit / 1024 / 1024).toFixed(1), 'MB');
    }
    if (avatars) {
      console.log('  ✅ avatars: public =', avatars.public, '| size limit =', (avatars.file_size_limit / 1024 / 1024).toFixed(1), 'MB');
    }

    console.log('\n✨ Storage bucket setup complete!');
    console.log('\n⚠️  NOTE: RLS policies must be applied manually via SQL Editor:');
    console.log('   Run the SQL in: supabase/migrations/20250111000000_setup_storage.sql');
    console.log('   Dashboard: https://supabase.com/dashboard/project/teyloksuvmmhqixjqoch/sql/new');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupStorageBuckets();
