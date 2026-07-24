export interface Company {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  segment?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  googleRating?: number | null;
  googleReviewsCount?: number | null;
  employeesEstimate?: string | null;
  revenueRangeEstimate?: string | null;
  runningAds?: boolean | null;
  lat?: number | null;
  lng?: number | null;
  distanceMeters?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchFilters {
  lat?: number;
  lng?: number;
  radiusKm?: number;
  segment?: string;
  city?: string;
  state?: string;
  minGoogleRating?: number;
  runningAds?: 'true' | 'false';
}
