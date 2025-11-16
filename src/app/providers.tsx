'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * React Query Providers
 * 
 * Configures global data fetching and caching for SK AutoSphere
 * Following PRD tech stack: TanStack Query for server state management
 * 
 * Configuration optimized for:
 * - 3G/4G connectivity (longer stale times, aggressive caching)
 * - Mobile-first experience (prefetch on hover disabled by default)
 * - Real-time features (short stale times for messages)
 */

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes (good for vehicle listings that don't change often)
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Don't refetch on window focus (saves bandwidth on mobile)
            refetchOnWindowFocus: false,
            // Retry failed requests once (3G/4G can be flaky)
            retry: 1,
            // Retry delay: 1 second
            retryDelay: 1000,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
