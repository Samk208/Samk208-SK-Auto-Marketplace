import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Building2, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface DealerCardProps {
  dealer: Profile;
  carId: string;
}

/**
 * DealerCard Component
 *
 * Server component that displays dealer information on the car detail page.
 * Includes:
 * - Dealer avatar and business name
 * - Verification status badge
 * - Rating display
 * - Contact information
 * - Call-to-action buttons (Message, Call)
 *
 * @param dealer - The dealer profile information
 * @param carId - The ID of the current car (for messaging context)
 */
export function DealerCard({ dealer, carId }: DealerCardProps) {
  const {
    full_name,
    avatar_url,
    business_name,
    verification_status,
    seller_rating,
    phone_number,
    country,
  } = dealer;

  const getVerificationBadge = (status: typeof verification_status) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Verified Dealer
          </Badge>
        );
      case 'pending':
        return <Badge variant="warning">Verification Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Not Verified</Badge>;
      default:
        return <Badge variant="secondary">Unverified</Badge>;
    }
  };

  const displayName = business_name || full_name;
  const hasRating = seller_rating !== null && seller_rating > 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Dealer Header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {avatar_url ? (
              <Image
                src={avatar_url}
                alt={displayName}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-primary/10 text-primary text-xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Dealer Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{displayName}</h3>

            {/* Verification Badge */}
            <div className="mt-1">
              {getVerificationBadge(verification_status)}
            </div>

            {/* Rating */}
            {hasRating && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {seller_rating?.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">/5.0</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-sm">
          {business_name && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{business_name}</span>
            </div>
          )}

          {country && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{country}</span>
            </div>
          )}

          {phone_number && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{phone_number}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <Button
            variant="primary"
            className="w-full"
            asChild
          >
            <Link href={`/messages?car=${carId}&dealer=${dealer.id}`}>
              Message Dealer
            </Link>
          </Button>

          {phone_number && (
            <Button
              variant="default"
              outline
              className="w-full"
              asChild
            >
              <a href={`tel:${phone_number}`}>
                Call Now
              </a>
            </Button>
          )}
        </div>

        {/* Dealer Profile Link */}
        <div className="text-center pt-2">
          <Link
            href={`/dealers/${dealer.id}`}
            className="text-sm text-primary hover:underline"
          >
            View Dealer Profile
          </Link>
        </div>
      </div>
    </Card>
  );
}

export type { DealerCardProps };
