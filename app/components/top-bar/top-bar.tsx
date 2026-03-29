import { Sun, Moon, LogOut } from 'lucide-react';
import { useColorScheme } from '@dazl/color-scheme/react';
import classNames from 'classnames';
import type { BatteryStatus } from '~/hooks/use-battery';
import styles from './top-bar.module.css';

interface TopBarProps {
  isEmergencyActive: boolean;
  battery?: BatteryStatus;
  onLogout: () => void;
}

function BatteryIcon({ level, charging }: { level: number; charging: boolean }) {
  const pct = Math.round(level * 100);
  const color = level <= 0.15 ? 'var(--color-primary)' : level <= 0.5 ? 'var(--color-warning)' : 'var(--color-safe)';
  return (
    <span className={styles.batteryChip} style={{ color }}>
      {charging ? '⚡' : ''}{pct}%
    </span>
  );
}

export function TopBar({ isEmergencyActive, battery, onLogout }: TopBarProps) {
  const { isDark, setColorScheme } = useColorScheme();
  const toggleTheme = () => setColorScheme(isDark ? 'light' : 'dark');

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>SOS</div>
        <div>
          <div className={styles.logoName}>Emergency SOS</div>
          <div className={styles.logoTag}>Safety System</div>
        </div>
      </div>

      <div className={styles.actions}>
        {battery && <BatteryIcon level={battery.level} charging={battery.charging} />}
        <div className={classNames(styles.statusPill, isEmergencyActive ? styles.emergency : styles.safe)}>
          <span className={styles.dot} />
          {isEmergencyActive ? 'EMERGENCY' : 'SAFE'}
        </div>
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme" type="button">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className={styles.iconBtn} onClick={onLogout} aria-label="Logout" type="button">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
