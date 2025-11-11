/**
 * Utility functions for formatting data
 * Used across the SK AutoSphere application
 */

/**
 * Format a number as USD currency
 * @param amount - The amount to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format mileage with proper separators
 * @param mileage - The mileage value
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted mileage string with 'km' suffix
 */
export function formatMileage(mileage: number, locale: string = 'en-US'): string {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(mileage);
  return `${formatted} km`;
}

/**
 * Format a date string to a human-readable format
 * @param dateString - ISO date string
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted date string
 * @throws RangeError if the date string is invalid
 */
export function formatDate(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString);
  
  // Validate date before formatting
  if (isNaN(date.getTime())) {
    throw new RangeError('Invalid date string');
  }
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date string to a relative time (e.g., "2 days ago")
 * @param dateString - ISO date string
 * @param locale - The locale to use (default: 'en-US')
 * @returns Relative time string, or empty string if invalid date
 */
export function formatRelativeTime(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString);
  
  // Validate date before calculations
  if (isNaN(date.getTime())) {
    return ''; // Return empty string for invalid dates
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInYears > 0) {
    return rtf.format(-diffInYears, 'year');
  } else if (diffInMonths > 0) {
    return rtf.format(-diffInMonths, 'month');
  } else if (diffInDays > 0) {
    return rtf.format(-diffInDays, 'day');
  } else if (diffInHours > 0) {
    return rtf.format(-diffInHours, 'hour');
  } else if (diffInMinutes > 0) {
    return rtf.format(-diffInMinutes, 'minute');
  } else {
    return rtf.format(-diffInSeconds, 'second');
  }
}

/**
 * Format a number to a compact notation (e.g., 1.2K, 5.3M)
 * @param num - The number to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns Compact number string
 */
export function formatCompactNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format a phone number to international format
 * @param phone - The phone number
 * @param countryCode - The country code (default: '+1')
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+1'): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Apply formatting based on length
  if (cleaned.length === 10) {
    return `${countryCode} (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}
