'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type AuthResult =
  | { success: true; userId: string }
  | { success: false; error: string };

/**
 * Sign up a new user with email and password
 * Creates both auth user and profile record
 */
export async function signUpWithEmail(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const role = formData.get('role') as 'buyer' | 'dealer';

  if (!email || !password || !fullName || !role) {
    return { success: false, error: 'All fields are required' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  const supabase = await createServerSupabaseClient();

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user account' };
    }

    // Create profile record
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
      verification_status: 'unverified',
    });

    if (profileError) {
      // Profile creation failed - cleanup orphaned auth user
      const userId = authData.user.id;
      console.error('Profile creation failed:', profileError.message);
      
      try {
        // Attempt to delete the auth user to prevent orphaned accounts
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteError) {
          console.error('Failed to cleanup auth user after profile error:', deleteError.message);
        }
      } catch (cleanupError) {
        console.error('Error during auth user cleanup:', cleanupError);
      }
      
      return {
        success: false,
        error: 'Failed to create user profile: ' + profileError.message,
      };
    }

    revalidatePath('/', 'layout');
    return { success: true, userId: authData.user.id };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during signup',
    };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signInWithEmail(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Login failed' };
    }

    revalidatePath('/', 'layout');
    return { success: true, userId: data.user.id };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred during login' };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResult> {
  const supabase = await createServerSupabaseClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during logout',
    };
  }

  // Perform navigation outside try-catch to avoid catching NEXT_REDIRECT
  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * Sign in with Google OAuth
 * Returns the URL to redirect to for OAuth flow
 */
export async function signInWithGoogle(): Promise<{ url: string } | { error: string }> {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.url) {
      return { error: 'Failed to generate OAuth URL' };
    }

    return { url: data.url };
  } catch (error) {
    console.error('Google OAuth error:', error);
    return { error: 'An unexpected error occurred with Google sign-in' };
  }
}

/**
 * Update user profile information
 */
export async function updateProfile(formData: FormData): Promise<AuthResult> {
  const fullName = formData.get('fullName') as string;
  const phoneNumber = formData.get('phoneNumber') as string | null;
  const country = formData.get('country') as string | null;
  const businessName = formData.get('businessName') as string | null;

  const supabase = await createServerSupabaseClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const updates: any = {
      full_name: fullName,
      updated_at: new Date().toISOString(),
    };

    if (phoneNumber) updates.phone_number = phoneNumber;
    if (country) updates.country = country;
    if (businessName) updates.business_name = businessName;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating profile',
    };
  }
}

/**
 * Request email verification resend
 */
export async function resendVerificationEmail(
  email: string
): Promise<AuthResult> {
  const supabase = await createServerSupabaseClient();

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, userId: '' };
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while resending verification email',
    };
  }
}

/**
 * Request password reset email
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = await createServerSupabaseClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, userId: '' };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while requesting password reset',
    };
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  newPassword: string
): Promise<AuthResult> {
  if (newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  const supabase = await createServerSupabaseClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Password update error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating password',
    };
  }
}
