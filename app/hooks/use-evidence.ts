import { useState, useRef, useCallback } from 'react';

export interface EvidenceEntry {
  id: string;
  type: 'audio' | 'photo';
  timestamp: Date;
  dataUrl: string;
  label: string;
}

/**
 * Auto evidence recorder — captures audio clips and photos during an SOS event.
 * All evidence is stored locally (in-memory / base64) for offline access.
 */
export function useEvidence() {
  const [entries, setEntries] = useState<EvidenceEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addEntry = useCallback((entry: Omit<EvidenceEntry, 'id'>) => {
    setEntries((prev) => [{ ...entry, id: `ev-${Date.now()}-${Math.random()}` }, ...prev]);
  }, []);

  /** Start continuous audio recording loop (30s clips) */
  const startRecording = useCallback(async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);

      const recordClip = () => {
        audioChunks.current = [];
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onload = () => {
            addEntry({
              type: 'audio',
              timestamp: new Date(),
              dataUrl: reader.result as string,
              label: `Audio clip — ${new Date().toLocaleTimeString()}`,
            });
          };
          reader.readAsDataURL(blob);
        };

        recorder.start();
        setTimeout(() => {
          if (recorder.state === 'recording') recorder.stop();
        }, 30000); // 30s clips
      };

      recordClip();
      // Start a new clip every 32 seconds
      intervalRef.current = setInterval(recordClip, 32000);
    } catch {
      // Mic not available — silently ignore
    }
  }, [isRecording, addEntry]);

  /** Capture a photo from the device camera */
  const capturePhoto = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      stream.getTracks().forEach((t) => t.stop());

      addEntry({
        type: 'photo',
        timestamp: new Date(),
        dataUrl,
        label: `Photo — ${new Date().toLocaleTimeString()}`,
      });
    } catch {
      // Camera not available — silently ignore
    }
  }, [addEntry]);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const clearEvidence = useCallback(() => setEntries([]), []);

  return { entries, isRecording, startRecording, stopRecording, capturePhoto, clearEvidence };
}
