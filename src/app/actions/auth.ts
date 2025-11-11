'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Validation schemas
const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['buyer', 'seller'], 'Role must be either buyer or seller'),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
})

const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignUpData = z.infer<typeof SignUpSchema>
type SignInData = z.infer<typeof SignInSchema>

export type AuthResult = {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData): Promise<AuthResult> {
  try {
    // Validate input
    const validated = SignUpSchema.parse(data)

    const supabase = await createServerSupabaseClient()

    // Sign up user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.fullName,
          role: validated.role,
          phone_number: validated.phoneNumber,
          country: validated.country,
        },
      },
    })

    if (signUpError) {
      return {
        success: false,
        error: signUpError.message,
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create user',
      }
    }

    // Profile is automatically created by database trigger

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        role: validated.role,
      },
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign up',
    }
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData): Promise<AuthResult> {
  try {
    // Validate input
    const validated = SignInSchema.parse(data)

    const supabase = await createServerSupabaseClient()

    // Sign in with Supabase Auth
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (signInError) {
      return {
        success: false,
        error: signInError.message,
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to sign in',
      }
    }

    // Get user profile to include role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    revalidatePath('/', 'layout')

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        role: (profile as any)?.role || 'buyer',
      },
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign in',
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign out',
    }
  }
}

/**
 * Get current authenticated user session
 */
export async function getSession() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get full profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      user,
      profile,
    }
  } catch (error) {
    return null
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: {
  fullName?: string
  phoneNumber?: string
  country?: string
  businessName?: string
  businessRegistration?: string
}): Promise<AuthResult> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        country: data.country,
        business_name: data.businessName,
        business_registration: data.businessRegistration,
      } as any)
      .eq('id', user.id)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/dashboard')

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}
