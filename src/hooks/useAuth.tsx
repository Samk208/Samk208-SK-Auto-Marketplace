'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession, signIn, signUp, signOut as signOutAction } from '@/app/actions/auth'
import type { AuthResult } from '@/app/actions/auth'

/**
 * Hook to manage authentication state with React Query
 */
export function useAuth() {
  const queryClient = useQueryClient()

  // Fetch current session
  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: signOutAction,
    onSuccess: () => {
      queryClient.clear() // Clear all queries on sign out
    },
  })

  return {
    user: session?.user || null,
    profile: session?.profile || null,
    isAuthenticated: !!session?.user,
    isLoading,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
  }
}
