import { Database } from './database.types';

// Database types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type CarRow = Database['public']['Tables']['cars']['Row'];

// Extended Car interface with computed properties and joined data
export interface Car extends Omit<CarRow, 'specifications'> {
  // Database fields are inherited from CarRow
  // Override specifications with typed version
  specifications?: {
    engine?: string;
    mileage?: number | string; // Can be number (km) or string with units ("11.7 km/L", "475 km range")
    mileage_km?: number;
    transmission?: 'Automatic' | 'Manual' | string;
    fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | string;
    fuel_type?: string;
    bodyType?: 'Sedan' | 'SUV' | 'Truck' | 'Hatchback' | 'Coupe' | string;
    body_type?: string;
    color?: string;
    [key: string]: any; // Allow additional JSONB fields
  };
  // Computed/joined fields
  location?: {
    city: string;
    country: string;
  };
  seller?: Profile; // Joined dealer profile
  dealer?: Profile; // Alias for seller
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'buyer' | 'seller';
  phone?: string;
  location?: string;
  businessDescription?: string;
}

export type Language = 'en' | 'ko' | 'fr' | 'sw';

export type Page = 'home' | 'cars' | 'seller-dashboard' | 'list-car' | 'car-detail' | 'favorites' | 'messages' | 'saved-searches';

export type ToastMessage = {
  message: string;
  type: 'success' | 'error' | 'info';
};

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'seller';
  timestamp: string;
}
