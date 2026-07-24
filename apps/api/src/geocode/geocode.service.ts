import { Injectable } from '@nestjs/common';

export interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
  type: string;
}

interface NominatimItem {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

@Injectable()
export class GeocodeService {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';

  async search(query?: string): Promise<GeocodeResult[]> {
    if (!query || query.trim().length < 2) return [];

    const params = new URLSearchParams({
      q: query,
      format: 'jsonv2',
      addressdetails: '0',
      limit: '5',
    });

    const res = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers: {
        'User-Agent': 'FARO-SalesIntelligence/1.0 (uso pessoal; sem redistribuicao)',
        'Accept-Language': 'pt-BR',
      },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as NominatimItem[];

    return data.map((item) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
    }));
  }
}