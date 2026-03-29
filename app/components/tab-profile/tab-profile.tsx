import { Phone, Mail, Droplets, FileText, LogOut, Shield } from 'lucide-react';
import type { UserProfile } from '~/data/mock-data';
import styles from './tab-profile.module.css';

interface TabProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

export function TabProfile({ user, onLogout }: TabProfileProps) {
  return (
    <div className={styles.page}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{user.avatar}</div>
        <div>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.email}>{user.email}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Personal Info</div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <div className={styles.rowIcon}><Phone size={15} /></div>
            Phone
          </div>
          <div className={styles.rowValue}>{user.phone}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <div className={styles.rowIcon}><Mail size={15} /></div>
            Email
          </div>
          <div className={styles.rowValue}>{user.email}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Medical Info</div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <div className={styles.rowIcon}><Droplets size={15} /></div>
            Blood Type
          </div>
          <span className={styles.medicalBadge}>{user.bloodType}</span>
        </div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <div className={styles.rowIcon}><FileText size={15} /></div>
            Medical Notes
          </div>
          <div className={styles.rowValue}>{user.medicalNotes}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Security</div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <div className={styles.rowIcon}><Shield size={15} /></div>
            Data Protection
          </div>
          <div className={styles.rowValue}>End-to-end encrypted</div>
        </div>
      </div>

      <button className={styles.logoutBtn} onClick={onLogout} type="button">
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
