
export interface Car {
  id: string; // UUID from Supabase
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  location: {
    city: string;
    country: string;
  };
  imageUrls: string[];
  specifications: {
    engine: string;
    mileage: string;
    transmission: 'Automatic' | 'Manual';
    fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
    bodyType: 'Sedan' | 'SUV' | 'Truck' | 'Hatchback' | 'Coupe';
  } | Record<string, unknown>; // allow JSONB from DB during migration
  description: string;
  status: 'Active' | 'Sold' | 'Pending' | 'available' | 'sold' | 'pending';
  dealer_id: string;
  // Optional fields mirrored from Supabase schema to aid migration
  images?: string[];
  specifications_raw?: Record<string, unknown>;
  location_city?: string;
  location_country?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'buyer' | 'seller';
  phone?: string;
  location?: string;
  businessName?: string;
  businessDescription?: string;
}

export type Language = 'en' | 'ko' | 'fr' | 'sw';

export type Page = 'home' | 'cars' | 'seller-dashboard' | 'list-car' | 'car-detail' | 'favorites' | 'messages' | 'saved-searches';

export interface NavigationContext {
  initialSearchTerm?: string;
  carId?: string;
}

export type NavigateHandler = (page: Page, context?: NavigationContext) => void;

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
