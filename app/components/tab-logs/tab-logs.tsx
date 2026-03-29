import type { SosLog } from '~/data/mock-data';
import { LogItem } from '~/components/log-item/log-item';
import styles from './tab-logs.module.css';

interface TabLogsProps {
  logs: SosLog[];
}

export function TabLogs({ logs }: TabLogsProps) {
  const resolved = logs.filter((l) => l.status === 'resolved').length;
  const cancelled = logs.filter((l) => l.status === 'cancelled').length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>SOS History</div>
        <div className={styles.count}>{logs.length} events</div>
      </div>

      {logs.length > 0 && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{logs.length}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{resolved}</div>
            <div className={styles.statLabel}>Resolved</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{cancelled}</div>
            <div className={styles.statLabel}>Cancelled</div>
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <div className={styles.empty}>
          <span style={{ fontSize: '2.5rem' }}>📋</span>
          <span>No SOS events recorded yet.<br />Your emergency history will appear here.</span>
        </div>
      ) : (
        <div className={styles.list}>
          {logs.map((log, i) => (
            <LogItem key={log.id} log={log} isLast={i === logs.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}
