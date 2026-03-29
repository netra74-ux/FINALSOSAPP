import { useState, useCallback } from 'react';
import type { Location } from './use-sos';

export type ZoneType = 'safe' | 'danger' | 'neutral';

export interface SafeZone {
  id: string;
  name: string;
  type: ZoneType;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  description: string;
}

/** Haversine distance in meters */
function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const INITIAL_ZONES: SafeZone[] = [
  { id: 'z-1', name: 'City Police HQ', type: 'safe', latitude: 40.7128, longitude: -74.006, radiusMeters: 400, description: 'NYPD main station' },
  { id: 'z-2', name: 'Central Hospital', type: 'safe', latitude: 40.7614, longitude: -73.9776, radiusMeters: 300, description: 'Mount Sinai Medical Center' },
  { id: 'z-3', name: 'High-Crime Zone A', type: 'danger', latitude: 40.695, longitude: -73.99, radiusMeters: 800, description: 'Reported incident hotspot' },
  { id: 'z-4', name: 'Fire Station 21', type: 'safe', latitude: 40.7282, longitude: -74.0776, radiusMeters: 200, description: 'FDNY Station 21' },
  { id: 'z-5', name: 'High-Crime Zone B', type: 'danger', latitude: 40.75, longitude: -74.012, radiusMeters: 600, description: 'Elevated risk area — avoid at night' },
];

export function useSafeZones() {
  const [zones] = useState<SafeZone[]>(INITIAL_ZONES);
  const [notifiedZones, setNotifiedZones] = useState<Set<string>>(new Set());

  /**
   * Returns which zone the user is currently in (nearest match),
   * and whether it requires sending a safety notification.
   */
  const evaluateLocation = useCallback(
    (location: Location, onDangerZoneEntered: (zone: SafeZone) => void) => {
      for (const zone of zones) {
        const dist = distanceMeters(location.latitude, location.longitude, zone.latitude, zone.longitude);
        if (dist <= zone.radiusMeters) {
          if (zone.type === 'danger' && !notifiedZones.has(zone.id)) {
            setNotifiedZones((prev) => new Set([...prev, zone.id]));
            onDangerZoneEntered(zone);
          }
          return zone;
        }
      }
      return null;
    },
    [zones, notifiedZones]
  );

  const getCurrentZone = useCallback(
    (location: Location | null): SafeZone | null => {
      if (!location) return null;
      let nearest: SafeZone | null = null;
      let minDist = Infinity;
      for (const zone of zones) {
        const dist = distanceMeters(location.latitude, location.longitude, zone.latitude, zone.longitude);
        if (dist <= zone.radiusMeters && dist < minDist) {
          minDist = dist;
          nearest = zone;
        }
      }
      return nearest;
    },
    [zones]
  );

  const getNearestSafeZone = useCallback(
    (location: Location | null): SafeZone | null => {
      if (!location) return null;
      let nearest: SafeZone | null = null;
      let minDist = Infinity;
      for (const zone of zones.filter((z) => z.type === 'safe')) {
        const dist = distanceMeters(location.latitude, location.longitude, zone.latitude, zone.longitude);
        if (dist < minDist) {
          minDist = dist;
          nearest = zone;
        }
      }
      return nearest;
    },
    [zones]
  );

  return { zones, evaluateLocation, getCurrentZone, getNearestSafeZone };
}
