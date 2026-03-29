import { Trash2 } from 'lucide-react';
import type { EmergencyContact } from '~/data/mock-data';
import styles from './contact-card.module.css';

interface ContactCardProps {
  contact: EmergencyContact;
  onRemove: (id: string) => void;
}

export function ContactCard({ contact, onRemove }: ContactCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.avatar}>{contact.avatar}</div>
      <div className={styles.info}>
        <div className={styles.name}>{contact.name}</div>
        <div className={styles.meta}>
          <span className={styles.relation}>{contact.relation}</span>
          <span className={styles.phone}>{contact.phone}</span>
        </div>
      </div>
      <button className={styles.removeBtn} onClick={() => onRemove(contact.id)} aria-label="Remove contact" type="button">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
