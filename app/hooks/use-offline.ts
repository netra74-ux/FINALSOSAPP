import { useState, useEffect, useCallback } from 'react';

export interface OfflineStatus {
  isOnline: boolean;
  bluetoothAvailable: boolean;
  offlineSmsQueued: number;
  offlineSmsDelivered: number;
  lastSyncTime: number | null;
  relayActive: boolean;
}

export interface QueuedSms {
  id: string;
  to: string;
  message: string;
  timestamp: Date;
  status: 'queued' | 'delivered' | 'failed';
}

/**
 * Manages offline detection, queued SMS messages, and simulated Bluetooth relay.
 * In a real implementation, this would use the Web Bluetooth API to find nearby
 * phones and relay SMS via them. Here we simulate the logic for demo purposes.
 */
export function useOffline() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    bluetoothAvailable: 'bluetooth' in navigator,
    offlineSmsQueued: 0,
    offlineSmsDelivered: 0,
    lastSyncTime: null,
    relayActive: false,
  });
  const [queue, setQueue] = useState<QueuedSms[]>([]);

  useEffect(() => {
    const onOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true, relayActive: false }));
      flushQueue();
    };
    const onOffline = () => setStatus((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  /** Queue an SMS for delivery when network returns or via Bluetooth relay */
  const queueSms = useCallback((to: string, message: string) => {
    const sms: QueuedSms = {
      id: `sms-${Date.now()}`,
      to,
      message,
      timestamp: new Date(),
      status: 'queued',
    };
    setQueue((prev) => [...prev, sms]);
    setStatus((prev) => ({ ...prev, offlineSmsQueued: prev.offlineSmsQueued + 1 }));

    // Simulate Bluetooth relay attempt after 2 seconds
    if ('bluetooth' in navigator) {
      setStatus((prev) => ({ ...prev, relayActive: true }));
      setTimeout(() => {
        setQueue((prev) =>
          prev.map((s) => (s.id === sms.id ? { ...s, status: 'delivered' } : s))
        );
        setStatus((prev) => ({
          ...prev,
          relayActive: false,
          offlineSmsDelivered: prev.offlineSmsDelivered + 1,
          lastSyncTime: Date.now(),
        }));
      }, 3500);
    }
  }, []);

  const flushQueue = useCallback(() => {
    setQueue((prev) =>
      prev.map((s) => (s.status === 'queued' ? { ...s, status: 'delivered' } : s))
    );
    setStatus((prev) => ({
      ...prev,
      offlineSmsDelivered: prev.offlineSmsQueued,
      lastSyncTime: Date.now(),
    }));
  }, []);

  return { status, queue, queueSms };
}
