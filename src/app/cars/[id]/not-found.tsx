import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Not Found Page for Car Detail
 *
 * Displayed when a car with the requested ID is not found in the database.
 * Provides helpful navigation options to the user.
 */
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        {/* Icon */}
        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
          <SearchX className="h-12 w-12 text-gray-400" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Car Not Found
          </h1>
          <p className="text-lg text-gray-600">
            Sorry, we could not find the car you are looking for.
          </p>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-6 w-full">
          <p className="text-sm text-gray-700 mb-4">
            This could happen if:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 text-left list-disc list-inside">
            <li>The car listing has been removed or sold</li>
            <li>The URL is incorrect or outdated</li>
            <li>The listing is no longer available</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button variant="primary" size="lg" asChild>
            <Link href="/cars">
              Browse All Cars
            </Link>
          </Button>
          <Button variant="default" outline size="lg" asChild>
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>

        {/* Help Link */}
        <p className="text-sm text-gray-500">
          Need help?{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
