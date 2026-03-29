import { CheckCircle, XCircle, AlertCircle, MapPin, Users, Clock } from 'lucide-react';
import type { SosLog } from '~/data/mock-data';
import classNames from 'classnames';
import styles from './log-item.module.css';

interface LogItemProps {
  log: SosLog;
  isLast?: boolean;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const STATUS_ICONS = {
  resolved: CheckCircle,
  cancelled: XCircle,
  active: AlertCircle,
};

export function LogItem({ log, isLast }: LogItemProps) {
  const Icon = STATUS_ICONS[log.status];

  return (
    <div className={styles.item}>
      <div className={styles.iconCol}>
        <div className={classNames(styles.statusIcon, styles[log.status])}>
          <Icon size={18} />
        </div>
        {!isLast && <div className={styles.timeline} />}
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={classNames(styles.statusBadge, styles[log.status])}>{log.status}</span>
          <span className={styles.time}>{formatDate(log.timestamp)} {formatTime(log.timestamp)}</span>
        </div>
        <div className={styles.address}>
          <MapPin size={12} color="var(--color-text-muted)" />
          {log.address}
        </div>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Users size={11} />
            {log.contactsNotified} notified
          </div>
          <div className={styles.metaItem}>
            <Clock size={11} />
            {formatDuration(log.duration)}
          </div>
        </div>
      </div>
    </div>
  );
}
