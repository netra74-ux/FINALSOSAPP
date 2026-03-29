import { MapPin, Users, CheckCircle, XCircle, Bell } from 'lucide-react';
import type { Location } from '~/hooks/use-sos';
import styles from './active-alert.module.css';
import classNames from 'classnames';

interface ActiveAlertProps {
  location: Location | null;
  alertsSent: number;
  elapsedSeconds: number;
  contactCount: number;
  onCancel: () => void;
  onResolve: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function ActiveAlert({ location, alertsSent, elapsedSeconds, contactCount, onCancel, onResolve }: ActiveAlertProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.dot} />
          EMERGENCY ACTIVE
        </div>
        <div className={styles.timer}>{formatTime(elapsedSeconds)}</div>
      </div>

      {alertsSent > 0 && (
        <div className={styles.alertsRow}>
          <Bell size={12} />
          {alertsSent} alert{alertsSent !== 1 ? 's' : ''} sent to {contactCount} contacts
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Contacts Notified</span>
          <span className={classNames(styles.statValue, styles.highlight)}>
            {contactCount} <Users size={16} style={{ display: 'inline' }} />
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Next Alert In</span>
          <span className={styles.statValue}>{30 - (elapsedSeconds % 30)}s</span>
        </div>
      </div>

      {location && (
        <div className={styles.location}>
          <MapPin size={18} className={styles.locationIcon} />
          <div className={styles.locationText}>
            <div className={styles.locationLabel}>Live Location</div>
            <div className={styles.locationCoords}>
              {location.latitude.toFixed(5)}°N, {Math.abs(location.longitude).toFixed(5)}°W
            </div>
            <div className={styles.locationAccuracy}>±{Math.round(location.accuracy)}m accuracy</div>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.btnCancel} onClick={onCancel} type="button">
          <XCircle size={16} /> Cancel SOS
        </button>
        <button className={styles.btnResolve} onClick={onResolve} type="button">
          <CheckCircle size={16} /> I'm Safe
        </button>
      </div>
    </div>
  );
}
