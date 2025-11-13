/**
 * Standardized Logger Utility
 *
 * Provides consistent logging format across the application.
 * Use this instead of direct console.log/error/warn calls for better
 * debugging and future log aggregation integration.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  timestamp?: boolean;
  data?: unknown;
}

/**
 * Formats a log message with consistent structure
 */
function formatMessage(
  level: LogLevel,
  context: string,
  message: string,
  options?: LogOptions
): string {
  const timestamp = options?.timestamp ? new Date().toISOString() : '';
  const timestampPrefix = timestamp ? `${timestamp} ` : '';

  return `${timestampPrefix}[${context}] ${message}`;
}

/**
 * Application logger with standardized format
 *
 * @example
 * ```typescript
 * // Basic error logging
 * logger.error('home', 'featured cars fetch failed', error);
 *
 * // Info logging with data
 * logger.info('auth', 'user logged in', { userId: user.id });
 *
 * // Warning
 * logger.warn('api', 'rate limit approaching', { remaining: 10 });
 *
 * // Debug (only in development)
 * logger.debug('query', 'executing SQL', { query: sql });
 *
 * // Performance timing
 * const timer = logger.time('database', 'fetch users query');
 * const users = await fetchUsers();
 * timer.end(); // Logs: [database] fetch users query: 142ms
 * ```
 */
export const logger = {
  /**
   * Log informational messages
   * Use for important application events
   */
  info: (context: string, message: string, data?: unknown) => {
    const formatted = formatMessage('info', context, message);
    if (data !== undefined) {
      console.log(formatted, data);
    } else {
      console.log(formatted);
    }
  },

  /**
   * Log warning messages
   * Use for non-critical issues that should be monitored
   */
  warn: (context: string, message: string, data?: unknown) => {
    const formatted = formatMessage('warn', context, message);
    if (data !== undefined) {
      console.warn(formatted, data);
    } else {
      console.warn(formatted);
    }
  },

  /**
   * Log error messages
   * Use for errors and exceptions that need attention
   */
  error: (context: string, message: string, error?: unknown) => {
    const formatted = formatMessage('error', context, message);
    if (error !== undefined) {
      console.error(formatted, error);
    } else {
      console.error(formatted);
    }
  },

  /**
   * Log debug messages
   * Only logs in development environment
   */
  debug: (context: string, message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      const formatted = formatMessage('debug', context, message);
      if (data !== undefined) {
        console.debug(formatted, data);
      } else {
        console.debug(formatted);
      }
    }
  },

  /**
   * Performance measurement utility
   * Use to track operation duration
   */
  time: (context: string, operation: string) => {
    const startTime = performance.now();

    return {
      end: () => {
        const duration = performance.now() - startTime;
        logger.debug(context, `${operation}: ${duration.toFixed(2)}ms`);
      },
    };
  },
};

/**
 * Type-safe logger for better IDE support
 */
export type Logger = typeof logger;
