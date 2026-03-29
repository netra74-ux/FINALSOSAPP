import { useState, useEffect, useCallback, useRef } from 'react';
import type { EmergencyContact, SosLog } from '~/data/mock-data';
import { MOCK_CONTACTS, MOCK_LOGS } from '~/data/mock-data';

export type SosPhase = 'idle' | 'countdown' | 'active' | 'cancelling';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export function useSos() {
  const [phase, setPhase] = useState<SosPhase>('idle');
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [alertsSent, setAlertsSent] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [logs, setLogs] = useState<SosLog[]>(MOCK_LOGS);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const alertRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const locationRef = useRef<Location | null>(null);

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const loc: Location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        };
        setLocation(loc);
        locationRef.current = loc;
        setLocationError(null);
      },
      (err) => {
        setLocationError(err.message);
        // Use a mock location for demo purposes
        const mockLoc: Location = {
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.006 + (Math.random() - 0.5) * 0.01,
          accuracy: 15,
          timestamp: Date.now(),
        };
        setLocation(mockLoc);
        locationRef.current = mockLoc;
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  const stopLocation = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
  }, []);

  const clearAllIntervals = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    if (alertRef.current) clearInterval(alertRef.current);
    countdownRef.current = null;
    elapsedRef.current = null;
    alertRef.current = null;
  }, []);

  const triggerSos = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('countdown');
    setCountdown(5);
    fetchLocation();

    let count = 5;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownRef.current!);
        countdownRef.current = null;
        activateSos();
      }
    }, 1000);
  }, [phase, fetchLocation]);

  const activateSos = useCallback(() => {
    startTimeRef.current = new Date();
    setPhase('active');
    setAlertsSent(0);
    setElapsedSeconds(0);

    // Simulate sending alerts to contacts immediately
    setAlertsSent(MOCK_CONTACTS.length);

    // Re-send alert every 30 seconds
    alertRef.current = setInterval(() => {
      setAlertsSent((prev) => prev + MOCK_CONTACTS.length);
    }, 30000);

    // Track elapsed time
    elapsedRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  const cancelSos = useCallback(() => {
    const duration = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000)
      : 0;

    clearAllIntervals();
    stopLocation();

    if (phase === 'active' && locationRef.current) {
      const newLog: SosLog = {
        id: `log-${Date.now()}`,
        timestamp: startTimeRef.current ?? new Date(),
        latitude: locationRef.current.latitude,
        longitude: locationRef.current.longitude,
        address: `${locationRef.current.latitude.toFixed(4)}°N, ${Math.abs(locationRef.current.longitude).toFixed(4)}°W`,
        contactsNotified: MOCK_CONTACTS.length,
        duration,
        status: 'cancelled',
      };
      setLogs((prev) => [newLog, ...prev]);
    }

    setPhase('idle');
    setCountdown(5);
    setElapsedSeconds(0);
    setAlertsSent(0);
    startTimeRef.current = null;
  }, [phase, clearAllIntervals, stopLocation]);

  const cancelCountdown = useCallback(() => {
    clearAllIntervals();
    stopLocation();
    setPhase('idle');
    setCountdown(5);
  }, [clearAllIntervals, stopLocation]);

  const resolveSos = useCallback(() => {
    const duration = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000)
      : 0;

    clearAllIntervals();
    stopLocation();

    if (locationRef.current) {
      const newLog: SosLog = {
        id: `log-${Date.now()}`,
        timestamp: startTimeRef.current ?? new Date(),
        latitude: locationRef.current.latitude,
        longitude: locationRef.current.longitude,
        address: `${locationRef.current.latitude.toFixed(4)}°N, ${Math.abs(locationRef.current.longitude).toFixed(4)}°W`,
        contactsNotified: MOCK_CONTACTS.length,
        duration,
        status: 'resolved',
      };
      setLogs((prev) => [newLog, ...prev]);
    }

    setPhase('idle');
    setCountdown(5);
    setElapsedSeconds(0);
    setAlertsSent(0);
    startTimeRef.current = null;
  }, [clearAllIntervals, stopLocation]);

  useEffect(() => {
    return () => {
      clearAllIntervals();
      stopLocation();
    };
  }, [clearAllIntervals, stopLocation]);

  return {
    phase,
    countdown,
    location,
    locationError,
    alertsSent,
    elapsedSeconds,
    logs,
    triggerSos,
    cancelCountdown,
    cancelSos,
    resolveSos,
  };
}
