export interface Company {
  id: string;
  name: string;
  segment: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  googleRating: number | null;
  googleReviews: number | null;
  hasWebsite: boolean;
  hasInstagram: boolean;
  hasFacebook: boolean;
  hasWhatsapp: boolean;
  distance_m?: number | null;
}

export interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
  type: string;
}

export interface SearchFilters {
  lat?: number;
  lng?: number;
  radiusKm?: number;
  segment?: string;
  city?: string;
  state?: string;
  query?: string;
  hasWebsite?: 'true' | 'false';
  hasInstagram?: 'true' | 'false';
  hasWhatsapp?: 'true' | 'false';
  minRating?: number;
}