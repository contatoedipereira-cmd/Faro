'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Company } from '@/lib/types';

interface Props {
  companies: Company[];
  center: { lat: number; lng: number };
  radiusKm?: number;
  flyTo?: { lat: number; lng: number; nonce: number };
  onMapClick: (lat: number, lng: number) => void;
  onSelectCompany: (id: string) => void;
}

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

export default function Map({ companies, center, radiusKm, flyTo, onMapClick, onSelectCompany }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const pinMarkerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [center.lng, center.lat],
      zoom: 12,
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('click', (e) => onMapClick(e.lngLat.lat, e.lngLat.lng));

    map.on('load', () => {
      map.addSource('radius', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Point', coordinates: [center.lng, center.lat] }, properties: {} },
      });
      map.addLayer({
        id: 'radius-fill',
        type: 'circle',
        source: 'radius',
        paint: {
          'circle-radius': 0,
          'circle-color': '#ed9e19',
          'circle-opacity': 0.08,
          'circle-stroke-color': '#ed9e19',
          'circle-stroke-width': 1,
          'circle-stroke-opacity': 0.6,
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!pinMarkerRef.current) {
      const el = document.createElement('div');
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.background = '#000';
      el.style.border = '3px solid #ed9e19';
      el.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.6)';
      pinMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat([center.lng, center.lat]).addTo(map);
    } else {
      pinMarkerRef.current.setLngLat([center.lng, center.lat]);
    }

    const applyRadius = () => {
      const source = map.getSource('radius') as maplibregl.GeoJSONSource | undefined;
      if (source) {
        source.setData({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [center.lng, center.lat] },
          properties: {},
        });
      }
      if (radiusKm && map.getLayer('radius-fill')) {
        const metersPerPixel =
          (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, map.getZoom());
        const radiusPx = (radiusKm * 1000) / metersPerPixel;
        map.setPaintProperty('radius-fill', 'circle-radius', radiusPx);
      }
    };

    if (map.isStyleLoaded()) applyRadius();
    else map.once('load', applyRadius);
  }, [center, radiusKm]);

  // Move a câmera do mapa quando uma localização é escolhida na busca (não em cliques no mapa)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyTo) return;

    map.flyTo({ center: [flyTo.lng, flyTo.lat], zoom: 12, essential: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTo?.nonce]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = companies.map((company) => {
      const el = document.createElement('button');
      el.setAttribute('aria-label', company.name);
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '50%';
      el.style.background = '#ed9e19';
      el.style.border = '2px solid #000';
      el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.5)';
      el.style.cursor = 'pointer';
      el.onclick = () => onSelectCompany(company.id);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([company.longitude, company.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 12 }).setHTML(
            `<strong>${escapeHtml(company.name)}</strong><br/>${escapeHtml(company.segment ?? '')}`,
          ),
        );
      marker.addTo(map);
      return marker;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies]);

  return <div ref={containerRef} className="h-full w-full" />;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}