import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * OAuth Callback Handler
 * Handles the OAuth redirect from Google (or other providers)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createServerSupabaseClient();

    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(
          new URL('/auth/login?error=oauth_failed', requestUrl.origin)
        );
      }

      if (data.user) {
        // Check if profile exists, create if not
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          // Create profile for OAuth user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email || '',
              full_name:
                data.user.user_metadata.full_name ||
                data.user.user_metadata.name ||
                '',
              avatar_url: data.user.user_metadata.avatar_url || null,
              role: 'buyer', // Default role for OAuth users
              verification_status: 'unverified',
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Continue anyway - they can update profile later
          }
        }

        // Successful authentication - redirect to home
        return NextResponse.redirect(new URL('/', requestUrl.origin));
      }
    } catch (error) {
      console.error('Unexpected OAuth error:', error);
      return NextResponse.redirect(
        new URL('/auth/login?error=unexpected', requestUrl.origin)
      );
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(
    new URL('/auth/login?error=no_code', requestUrl.origin)
  );
}
