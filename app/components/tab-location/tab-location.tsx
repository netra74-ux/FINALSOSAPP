import { Share2 } from 'lucide-react';
import type { Location } from '~/hooks/use-sos';
import { LocationMap } from '~/components/location-map/location-map';
import styles from './tab-location.module.css';

interface TabLocationProps {
  location: Location | null;
  isTracking: boolean;
}

export function TabLocation({ location, isTracking }: TabLocationProps) {
  const handleShare = () => {
    if (!location) return;
    const url = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    if (navigator.share) {
      navigator.share({ title: 'My Live Location', text: 'Emergency SOS - My current location', url });
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      alert('Location link copied to clipboard!');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.title}>Live Location</div>

      <LocationMap location={location} isTracking={isTracking} />

      {location && (
        <>
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.cardLabel}>Latitude</div>
              <div className={styles.cardValue}>{location.latitude.toFixed(6)}°</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.cardLabel}>Longitude</div>
              <div className={styles.cardValue}>{location.longitude.toFixed(6)}°</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.cardLabel}>Accuracy</div>
              <div className={styles.cardValue}>±{Math.round(location.accuracy)}m</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.cardLabel}>Updated</div>
              <div className={styles.cardValue}>
                {new Date(location.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          </div>

          <button className={styles.shareBtn} onClick={handleShare} type="button">
            <Share2 size={18} /> Share My Location
          </button>

          <p className={styles.gpsNote}>
            Location updates automatically every few seconds while tracking is active.
          </p>
        </>
      )}

      {!location && (
        <p className={styles.gpsNote}>
          Location becomes available when SOS is triggered or when the app gets permission to access GPS.
        </p>
      )}
    </div>
  );
}
