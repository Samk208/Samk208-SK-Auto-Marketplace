'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';
import type { Database } from '@/types/database.types';

type Favorite = Database['public']['Tables']['favorites']['Row'];

interface FavoriteButtonProps {
  carId: string;
  initialIsFavorited?: boolean;
  className?: string;
}

/**
 * FavoriteButton Component
 *
 * Client component that allows users to favorite/unfavorite cars.
 * Integrates with Supabase to persist favorites across sessions.
 * Falls back to localStorage for unauthenticated users.
 *
 * @param carId - The ID of the car to favorite
 * @param initialIsFavorited - Initial favorite state (optional)
 * @param className - Additional CSS classes
 */
export function FavoriteButton({
  carId,
  initialIsFavorited = false,
  className
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Check authentication status and load favorite state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      if (user) {
        // Authenticated user: check database
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('car_id', carId)
          .single();

        setIsFavorited(!!data);
      } else {
        // Unauthenticated user: check localStorage
        const localFavorites = localStorage.getItem('sk-autosphere-favorites');
        if (localFavorites) {
          try {
            const favorites = JSON.parse(localFavorites);
            setIsFavorited(favorites.includes(carId));
          } catch (error) {
            console.error('Error parsing localStorage favorites:', error);
          }
        }
      }
    };

    checkAuth();
  }, [carId, supabase]);

  const toggleFavorite = useCallback(async () => {
    setIsLoading(true);

    try {
      if (userId) {
        // Authenticated user: update database
        if (isFavorited) {
          // Remove from favorites
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('car_id', carId);
        } else {
          // Add to favorites
          await supabase
            .from('favorites')
            .insert({
              user_id: userId,
              car_id: carId,
            });
        }
        setIsFavorited(!isFavorited);
      } else {
        // Unauthenticated user: use localStorage
        const localFavorites = localStorage.getItem('sk-autosphere-favorites');
        let favorites: string[] = [];

        if (localFavorites) {
          try {
            favorites = JSON.parse(localFavorites);
          } catch (error) {
            console.error('Error parsing localStorage favorites:', error);
          }
        }

        if (isFavorited) {
          // Remove from favorites
          favorites = favorites.filter(id => id !== carId);
        } else {
          // Add to favorites
          favorites.push(carId);
        }

        localStorage.setItem('sk-autosphere-favorites', JSON.stringify(favorites));
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  }, [carId, isFavorited, userId, supabase]);

  return (
    <Button
      variant={isFavorited ? 'primary' : 'default'}
      size="icon"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={className}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`}
        aria-hidden="true"
      />
    </Button>
  );
}

export type { FavoriteButtonProps };
