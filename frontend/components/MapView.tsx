'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import circle from '@turf/circle';
import { Company } from '@/lib/types';

// Tiles públicos do OpenStreetMap — ótimos para desenvolvimento local.
// Para uso com tráfego real, troque por um provedor dedicado (MapTiler,
// Stadia Maps, Geoapify) para respeitar a política de uso do OSM.
const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

const RADIUS_SOURCE_ID = 'search-radius';

interface MapViewProps {
  center: { lat: number; lng: number } | null;
  radiusKm: number;
  companies: Company[];
  hoveredId: string | null;
  onPointSelect: (point: { lat: number; lng: number }) => void;
  onHover: (id: string | null) => void;
}

export function MapView({
  center,
  radiusKm,
  companies,
  hoveredId,
  onPointSelect,
  onHover,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const centerMarkerRef = useRef<Marker | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});

  // Inicializa o mapa uma única vez
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: [center?.lng ?? -43.8514, center?.lat ?? -19.7697],
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    map.on('click', (e) => {
      onPointSelect({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    map.on('load', () => {
      map.addSource(RADIUS_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: `${RADIUS_SOURCE_ID}-fill`,
        type: 'fill',
        source: RADIUS_SOURCE_ID,
        paint: { 'fill-color': '#ed9e19', 'fill-opacity': 0.08 },
      });
      map.addLayer({
        id: `${RADIUS_SOURCE_ID}-line`,
        type: 'line',
        source: RADIUS_SOURCE_ID,
        paint: { 'line-color': '#ed9e19', 'line-width': 1.5, 'line-dasharray': [2, 2] },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza o pino central e o círculo de raio
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center) return;

    if (!centerMarkerRef.current) {
      const el = document.createElement('div');
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.borderRadius = '50%';
      el.style.background = '#ed9e19';
      el.style.boxShadow = '0 0 0 4px rgba(237,158,25,0.25)';
      centerMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([center.lng, center.lat])
        .addTo(map);
    } else {
      centerMarkerRef.current.setLngLat([center.lng, center.lat]);
    }

    const circlePolygon = circle([center.lng, center.lat], radiusKm, {
      units: 'kilometers',
      steps: 64,
    });

    const source = map.getSource(RADIUS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    source?.setData({ type: 'FeatureCollection', features: [circlePolygon] });

    map.flyTo({ center: [center.lng, center.lat], zoom: radiusKmToZoom(radiusKm) });
  }, [center, radiusKm]);

  // Sincroniza marcadores de resultado da busca
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    companies.forEach((company) => {
      if (company.lat == null || company.lng == null) return;

      const el = document.createElement('div');
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid #050505';
      el.style.background = hoveredId === company.id ? '#ed9e19' : '#f4b64a';
      el.style.cursor = 'pointer';
      el.addEventListener('mouseenter', () => onHover(company.id));
      el.addEventListener('mouseleave', () => onHover(null));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([company.lng, company.lat])
        .addTo(map);

      markersRef.current[company.id] = marker;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, hoveredId]);

  return <div ref={containerRef} className="h-full w-full" />;
}

function radiusKmToZoom(radiusKm: number): number {
  if (radiusKm <= 1) return 14.5;
  if (radiusKm <= 3) return 13.3;
  if (radiusKm <= 5) return 12.6;
  if (radiusKm <= 10) return 11.6;
  return 10.4;
}
