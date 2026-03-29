import { Home, Users, MapPin, History, User, Cpu } from 'lucide-react';
import classNames from 'classnames';
import styles from './bottom-nav.module.css';

export type NavTab = 'home' | 'contacts' | 'location' | 'logs' | 'sensors' | 'profile';

const NAV_ITEMS: { id: NavTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'sensors', label: 'Sensors', icon: Cpu },
  { id: 'logs', label: 'Logs', icon: History },
  { id: 'profile', label: 'Profile', icon: User },
];

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  contactCount?: number;
}

export function BottomNav({ activeTab, onTabChange, contactCount }: BottomNavProps) {
  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={classNames(styles.navItem, { [styles.active]: activeTab === id })}
          onClick={() => onTabChange(id)}
          aria-label={label}
          aria-current={activeTab === id ? 'page' : undefined}
          type="button"
        >
          {id === 'contacts' && contactCount !== undefined && contactCount > 0 && (
            <span className={styles.badge}>{contactCount > 9 ? '9+' : contactCount}</span>
          )}
          <Icon size={20} />
          {label}
        </button>
      ))}
    </nav>
  );
}
