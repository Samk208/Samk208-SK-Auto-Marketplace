import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { SellerDashboardClient } from './SellerDashboardClient';

/**
 * Seller Dashboard Page (Server Component)
 *
 * This is a protected route that requires authentication.
 * The middleware handles auth checks, but we double-check here for security.
 *
 * Server Component responsibilities:
 * - Verify authentication
 * - Check user role (must be dealer)
 * - Pass authenticated user data to Client Component
 */
export default async function SellerDashboardPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (authError || !user) {
    redirect('/auth/login?redirect=/seller-dashboard');
  }

  // Get user profile to check role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    redirect('/auth/login?redirect=/seller-dashboard');
  }

  // Check if user is a dealer
  if (profile.role !== 'dealer') {
    redirect('/?error=unauthorized');
  }

  // Pass profile data to Client Component
  // Client Component handles all interactivity and data fetching
  return <SellerDashboardClient profile={profile} />;
}

// Metadata for SEO
export const metadata = {
  title: 'Seller Dashboard | SK AutoSphere',
  description: 'Manage your car listings, view analytics, and track inquiries',
};
