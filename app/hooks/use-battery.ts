import { useState, useEffect } from 'react';

export interface BatteryStatus {
  level: number; // 0–1
  charging: boolean;
  isLow: boolean;  // < 0.15
  isCritical: boolean; // < 0.01  (1%)
  ultraLowPower: boolean;
}

const DEFAULT: BatteryStatus = {
  level: 1,
  charging: true,
  isLow: false,
  isCritical: false,
  ultraLowPower: false,
};

/**
 * Reads the Battery Status API and exposes simplified status.
 * Falls back gracefully when API is unavailable.
 */
export function useBattery() {
  const [battery, setBattery] = useState<BatteryStatus>(DEFAULT);

  useEffect(() => {
    let batteryObj: BatteryManager | null = null;

    const update = (b: BatteryManager) => {
      const level = b.level;
      const charging = b.charging;
      setBattery({
        level,
        charging,
        isLow: level < 0.15 && !charging,
        isCritical: level <= 0.01,
        ultraLowPower: level <= 0.01,
      });
    };

    (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> })
      .getBattery?.().then((b) => {
        batteryObj = b;
        update(b);
        b.addEventListener('levelchange', () => update(b));
        b.addEventListener('chargingchange', () => update(b));
      }).catch(() => {
        // API not available — use a simulated value for demo
        setBattery({ level: 0.72, charging: false, isLow: false, isCritical: false, ultraLowPower: false });
      });

    return () => {
      if (batteryObj) {
        batteryObj.removeEventListener('levelchange', () => {});
        batteryObj.removeEventListener('chargingchange', () => {});
      }
    };
  }, []);

  return battery;
}

// Minimal BatteryManager type (not in standard lib)
declare class BatteryManager extends EventTarget {
  readonly level: number;
  readonly charging: boolean;
}
