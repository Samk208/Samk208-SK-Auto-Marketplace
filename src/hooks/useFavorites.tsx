
import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'sk-autosphere-favorites';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavoriteIds(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
    }
  }, []);

  const toggleFavorite = useCallback((carId: number) => {
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

  const isFavorite = useCallback((carId: number) => {
    return favoriteIds.has(carId);
  }, [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite };
};
