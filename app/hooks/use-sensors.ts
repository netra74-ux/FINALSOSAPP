import { useState, useEffect, useCallback, useRef } from 'react';

export interface SensorConfig {
  shakeEnabled: boolean;
  voiceEnabled: boolean;
  motionEnabled: boolean;
}

export interface SensorState {
  shakeDetected: boolean;
  voiceDetected: boolean;
  dangerMotion: boolean;
  lastShakeTime: number | null;
  lastVoiceTime: number | null;
  permissionGranted: boolean;
  config: SensorConfig;
  shakeCount: number;
}

export interface SensorsReturn extends SensorState {
  toggleConfig: (key: keyof SensorConfig) => void;
}

const SHAKE_THRESHOLD = 18;
const SHAKE_TRIGGER_COUNT = 3;
const SHAKE_WINDOW_MS = 2500;
const VOICE_KEYWORDS = ['help', 'sos', 'emergency', 'help me', 'save me'];

type VoiceRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { resultIndex: number; results: { length: number; [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
};

/**
 * Manages shake detection (DeviceMotion), voice keyword detection (Web Speech),
 * and exposes an `onAutoTrigger` callback when auto-trigger conditions are met.
 */
export function useSensors(onAutoTrigger: () => void): SensorsReturn {
  const [state, setState] = useState<SensorState>({
    shakeDetected: false,
    voiceDetected: false,
    dangerMotion: false,
    lastShakeTime: null,
    lastVoiceTime: null,
    permissionGranted: false,
    config: { shakeEnabled: true, voiceEnabled: false, motionEnabled: true },
    shakeCount: 0,
  });

  const shakeTimestamps = useRef<number[]>([]);
  const recognitionRef = useRef<VoiceRecognitionLike | null>(null);
  const onAutoTriggerRef = useRef(onAutoTrigger);
  onAutoTriggerRef.current = onAutoTrigger;

  const lastAccel = useRef({ x: 0, y: 0, z: 0 });

  // ─── SHAKE DETECTION ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!state.config.shakeEnabled) return;

    const handleMotion = (e: DeviceMotionEvent) => {
      const accel = e.accelerationIncludingGravity;
      if (!accel) return;

      const dx = Math.abs((accel.x ?? 0) - lastAccel.current.x);
      const dy = Math.abs((accel.y ?? 0) - lastAccel.current.y);
      const dz = Math.abs((accel.z ?? 0) - lastAccel.current.z);

      lastAccel.current = { x: accel.x ?? 0, y: accel.y ?? 0, z: accel.z ?? 0 };

      const delta = dx + dy + dz;
      if (delta > SHAKE_THRESHOLD) {
        const now = Date.now();
        shakeTimestamps.current.push(now);
        shakeTimestamps.current = shakeTimestamps.current.filter((t) => now - t < SHAKE_WINDOW_MS);

        const count = shakeTimestamps.current.length;
        setState((prev) => ({ ...prev, shakeDetected: true, lastShakeTime: now, shakeCount: count }));

        if (count >= SHAKE_TRIGGER_COUNT) {
          shakeTimestamps.current = [];
          setState((prev) => ({ ...prev, shakeDetected: false, shakeCount: 0 }));
          onAutoTriggerRef.current();
        }

        setTimeout(() => setState((prev) => ({ ...prev, shakeDetected: false })), 1500);
      }
    };

    // iOS 13+ requires permission
    type DMEWithPermission = typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> };
    const DME = DeviceMotionEvent as DMEWithPermission;

    if (typeof DME !== 'undefined' && typeof DME.requestPermission === 'function') {
      DME.requestPermission()
        .then((result) => {
          if (result === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
            setState((prev) => ({ ...prev, permissionGranted: true }));
          }
        })
        .catch(() => {});
    } else if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion);
      setState((prev) => ({ ...prev, permissionGranted: true }));
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [state.config.shakeEnabled]);

  // ─── VOICE DETECTION ────────────────────────────────────────────────────────
  const startVoiceDetection = useCallback(() => {
    type SpeechCtor = new () => VoiceRecognitionLike;
    const win = window as unknown as Record<string, unknown>;
    const SpeechAPI: SpeechCtor | undefined =
      (win['SpeechRecognition'] as SpeechCtor) ??
      (win['webkitSpeechRecognition'] as SpeechCtor);

    if (!SpeechAPI) return;

    const recognition = new SpeechAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = String(event.results[i][0].transcript).toLowerCase();
        if (VOICE_KEYWORDS.some((kw) => transcript.includes(kw))) {
          setState((prev) => ({ ...prev, voiceDetected: true, lastVoiceTime: Date.now() }));
          onAutoTriggerRef.current();
          setTimeout(() => setState((prev) => ({ ...prev, voiceDetected: false })), 3000);
        }
      }
    };

    recognition.onerror = () => {};
    recognition.onend = () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch { /* already started */ }
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch { /* already started */ }
  }, []);

  const stopVoiceDetection = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (state.config.voiceEnabled) {
      startVoiceDetection();
    } else {
      stopVoiceDetection();
    }
    return stopVoiceDetection;
  }, [state.config.voiceEnabled, startVoiceDetection, stopVoiceDetection]);

  const toggleConfig = useCallback((key: keyof SensorConfig) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, [key]: !prev.config[key] },
    }));
  }, []);

  return { ...state, toggleConfig };
}
