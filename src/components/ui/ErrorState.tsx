'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Error State Component
 * 
 * UX/UI Specs:
 * - Clear error messaging for users
 * - Actionable recovery options (retry, go home)
 * - Mobile-friendly touch targets (44x44px minimum)
 * - Accessible with ARIA labels
 */

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content. Please try again.',
  onRetry,
  showHomeButton = true,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      {/* Error icon */}
      <div className="mb-6 p-4 rounded-full bg-error/10">
        <AlertCircle className="h-12 w-12 text-error" aria-hidden="true" />
      </div>
      
      {/* Error message */}
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
        {message}
      </p>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors min-h-[44px] min-w-[120px]"
            aria-label="Retry loading content"
          >
            <RefreshCw className="h-5 w-5" aria-hidden="true" />
            Try Again
          </button>
        )}
        
        {showHomeButton && (
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors min-h-[44px] min-w-[120px]"
            aria-label="Go to homepage"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            Go Home
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Network Error State
 * Specific messaging for connection issues (common on 3G/4G)
 */
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      message="We're having trouble connecting to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}

/**
 * Not Found Error State
 * For 404 errors
 */
export function NotFoundState({ 
  title = 'Not Found',
  message = "The page or resource you're looking for doesn't exist.",
}: { title?: string; message?: string }) {
  return (
    <ErrorState
      title={title}
      message={message}
      showHomeButton={true}
    />
  );
}
