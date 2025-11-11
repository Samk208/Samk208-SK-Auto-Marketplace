
import { useCallback, useState } from 'react';

const FAVORITES_KEY = 'sk-autosphere-favorites';

export const useFavorites = () => {
  // Initialize with a function to avoid setState during render
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') {
      return new Set();
    }
    
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        return new Set(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
    }
    return new Set();
  });

  const toggleFavorite = useCallback((carId: string) => {
    setFavoriteIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(carId)) {
        newIds.delete(carId);
      } else {
        newIds.add(carId);
      }
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newIds)));
      } catch (error) {
        console.error('Error saving favorites to localStorage', error);
      }
      return newIds;
    });
  }, []);

  const isFavorite = useCallback((carId: string) => {
    return favoriteIds.has(carId);
  }, [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite };
};
