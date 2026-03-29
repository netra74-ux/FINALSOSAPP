import { MapPin, Navigation } from 'lucide-react';
import type { Location } from '~/hooks/use-sos';
import styles from './location-map.module.css';

interface LocationMapProps {
  location: Location | null;
  isTracking: boolean;
}

export function LocationMap({ location, isTracking }: LocationMapProps) {
  return (
    <div className={styles.mapCard}>
      <div className={styles.mapHeader}>
        <div className={styles.mapTitle}>
          <MapPin size={16} color="var(--color-primary)" />
          Live Location
        </div>
        {isTracking && (
          <div className={styles.liveTag}>
            <span className={styles.dot} />
            LIVE
          </div>
        )}
      </div>

      <div className={styles.mapFrame}>
        {location ? (
          <>
            <div className={styles.mapGrid} />
            <div className={styles.mapPin}>
              <div className={styles.pinRing} />
              <div className={styles.pinDot} />
            </div>
            <div className={styles.mapPlaceholder} style={{ position: 'absolute', bottom: 8, right: 12, gap: 0 }}>
              <Navigation size={12} color="var(--color-text-muted)" />
            </div>
          </>
        ) : (
          <div className={styles.noLocation}>
            <Navigation size={28} />
            <span>{isTracking ? 'Acquiring GPS signal...' : 'Location not available'}</span>
          </div>
        )}
      </div>

      {location && (
        <div className={styles.coordsRow}>
          <div className={styles.coordPill}>
            <div className={styles.coordLabel}>Latitude</div>
            <div className={styles.coordVal}>{location.latitude.toFixed(6)}°</div>
          </div>
          <div className={styles.coordPill}>
            <div className={styles.coordLabel}>Longitude</div>
            <div className={styles.coordVal}>{location.longitude.toFixed(6)}°</div>
          </div>
          <div className={styles.coordPill}>
            <div className={styles.coordLabel}>Accuracy</div>
            <div className={styles.coordVal}>±{Math.round(location.accuracy)}m</div>
          </div>
        </div>
      )}
    </div>
  );
}
